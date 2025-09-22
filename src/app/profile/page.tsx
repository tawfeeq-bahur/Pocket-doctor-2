

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSharedState } from '@/components/AppLayout';
import { Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
    const { user, patientData } = useSharedState();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    
    // In a real app, this would be a single editable profile state object
    // and would be handled by a form library. For this simulation, we'll read directly.

    const handleSaveChanges = () => {
        // In a real app, you would save this data to a backend.
        toast({
            title: "Profile Updated",
            description: "Your personal details have been saved.",
        });
    };
    
     const copyToClipboard = () => {
        if (patientData?.patientCode) {
            navigator.clipboard.writeText(patientData.patientCode);
            setCopied(true);
            toast({ title: 'Code Copied!', description: 'You can now share this code with your caretaker.' });
            setTimeout(() => setCopied(false), 2000);
        }
    };


    if (!user || !patientData) {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-5 w-72 mt-2" />
                    </div>
                     <Skeleton className="h-10 w-32" />
                </div>
                <Separator />
             </div>
        )
    }

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    My Profile
                </h1>
                <p className="text-muted-foreground">View and edit your personal information.</p>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
        
        <Separator />

        <div className="grid md:grid-cols-3 gap-8 pt-6">
            {/* Left Column for Avatar & Basic Info */}
            <div className="md:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
                            <AvatarFallback className="text-4xl">{user.fallback}</AvatarFallback>
                        </Avatar>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Shareable Patient Code</CardTitle>
                        <CardDescription>Share this code with your caretaker to allow them to monitor your progress.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Input readOnly value={patientData.patientCode} className="font-mono text-lg tracking-widest"/>
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                           {copied ? <Check className="h-5 w-5 text-green-600"/> : <Copy className="h-5 w-5" />}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column for Detailed Forms */}
            <div className="md:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="dob">Date of Birth</Label>
                           <Input id="dob" type="date" defaultValue={'1990-01-01'} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select defaultValue="male">
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Medical Information</CardTitle>
                         <CardDescription>Provide any relevant medical details.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="allergies">Allergies</Label>
                            <Textarea id="allergies" placeholder="e.g., Peanuts, Penicillin" defaultValue={patientData.medicalHistory.allergies} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                            <Textarea id="chronicConditions" placeholder="e.g., Hypertension, Asthma" defaultValue={patientData.medicalHistory.chronicConditions} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  );
}
