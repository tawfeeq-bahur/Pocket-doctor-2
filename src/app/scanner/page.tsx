'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, AlertTriangle, ScanLine, PlusCircle, LoaderCircle, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useSharedState } from '@/components/AppLayout';
import { parsePrescription, PrescriptionParserOutput } from '@/ai/flows/prescription-parser';
import { AddMedicationDialog } from '@/components/medication/AddMedicationDialog';

type ParsedMedication = PrescriptionParserOutput['medications'][0];

export default function ScannerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedMeds, setParsedMeds] = useState<ParsedMedication[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addMedication } = useSharedState();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setParsedMeds(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image of your prescription first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedMeds(null);

    try {
      const result = await parsePrescription({ photoDataUri: imagePreview });
      if (result.medications && result.medications.length > 0) {
        setParsedMeds(result.medications);
        toast({
          title: 'Analysis Complete',
          description: `${result.medications.length} medication(s) found.`,
        });
      } else {
        setError('No medications could be identified in the image. Please try a clearer picture.');
      }
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Prescription Scanner</h1>
        <p className="text-muted-foreground">Upload an image of your prescription to automatically add medications.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Prescription</CardTitle>
            <CardDescription>Choose a clear photo of your prescription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="relative aspect-video w-full border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Prescription preview" layout="fill" objectFit="contain" className="rounded-md" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-12 w-12" />
                  <p>Click to upload or drag & drop</p>
                </div>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button onClick={handleAnalyzeClick} disabled={isLoading || !imageFile} className="w-full">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Analyze Prescription
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Review & Add Medications</CardTitle>
            <CardDescription>Review the medications found and add them to your schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <ResultsSkeleton />}

            {error && (
              <Alert variant="destructive" className="h-full">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && !parsedMeds && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                <CheckCircle className="mx-auto h-12 w-12" />
                <p>Results will appear here after analysis.</p>
              </div>
            )}
            
            {parsedMeds && (
              <div className="space-y-3">
                {parsedMeds.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div>
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                    </div>
                     <AddMedicationDialog 
                        onAddMedication={addMedication}
                        initialData={{
                          name: med.name,
                          dosage: med.dosage,
                          frequency: med.frequency
                        }}
                      >
                        <Button size="sm" variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add
                        </Button>
                      </AddMedicationDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ResultsSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
);
