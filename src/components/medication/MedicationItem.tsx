"use client";

import { Bell, CheckCircle, MoreVertical, SkipForward, Trash2, XCircle } from "lucide-react";
import type { Medication } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MedicationItemProps = {
  medication: Medication;
  onUpdateDose: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  onDeleteMedication: (medicationId: string) => void;
};

export function MedicationItem({ medication, onUpdateDose, onDeleteMedication }: MedicationItemProps) {
  const { toast } = useToast();

  const handleDoseAction = (scheduledTime: string, status: 'taken' | 'skipped') => {
    onUpdateDose(medication.id, scheduledTime, status);
    toast({
      title: "Dose Logged",
      description: `Your ${status} dose of ${medication.name} at ${scheduledTime} has been recorded.`,
    });
  };

  const handleDelete = () => {
    onDeleteMedication(medication.id);
    toast({
      title: "Medication Removed",
      description: `${medication.name} has been removed from your list.`,
      variant: "destructive",
    });
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-xl">{medication.name}</CardTitle>
          <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <Separator className="my-2" />
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Schedule</h4>
            {medication.doses.map(dose => (
              <div key={dose.scheduled} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                   {dose.status === 'pending' && <Bell className="w-4 h-4 text-accent" />}
                   {dose.status === 'taken' && <CheckCircle className="w-4 h-4 text-green-500" />}
                   {dose.status === 'skipped' && <XCircle className="w-4 h-4 text-destructive" />}
                  <span>{dose.scheduled}</span>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDoseAction(dose.scheduled, 'taken')}
                        disabled={dose.status !== 'pending'}
                    >Take</Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDoseAction(dose.scheduled, 'skipped')}
                        disabled={dose.status !== 'pending'}
                    >Skip</Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
