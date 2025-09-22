

'use client';

import { MOCK_PATIENTS, MOCK_USERS } from "@/lib/mock-data";
import type { Patient, AppUser } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pill, UserCheck, Calendar, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

const getCaretaker = (caretakerId?: string): AppUser | undefined => {
    return MOCK_USERS.find(user => user.id === caretakerId);
};

export default function PatientsPage() {
    // In a real app, you would fetch patients for the logged-in doctor.
    const patients = MOCK_PATIENTS;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Patient Management
                </h1>
                <p className="text-muted-foreground">
                    Find and open any patient’s profile quickly.
                </p>
            </div>
             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {patients.map(patient => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}
             </div>
        </div>
    )
}


function PatientCard({ patient }: { patient: Patient }) {
    const caretaker = getCaretaker(patient.caretakerId);

    const adherenceStats = useMemo(() => {
        let taken = 0;
        let skipped = 0;
        patient.medications.forEach(med => {
            med.doses.forEach(dose => {
                if (dose.status === 'taken') taken++;
                if (dose.status === 'skipped') skipped++;
            });
        });
        const total = taken + skipped;
        const adherence = total > 0 ? Math.round((taken / total) * 100) : 100; // Assume 100 if no doses logged yet
        return { taken, skipped, adherence };
    }, [patient.medications]);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>{patient.fallback}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl font-headline">{patient.name}</CardTitle>
                    <CardDescription>{patient.email}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Overall Adherence</span>
                        <span className={`text-sm font-semibold ${adherenceStats.adherence < 70 ? 'text-destructive' : 'text-green-600'}`}>
                            {adherenceStats.adherence}%
                        </span>
                    </div>
                    <Progress value={adherenceStats.adherence} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <span>Taking {patient.medications.length} medication(s)</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Next appointment: {patient.appointments.next}</span>
                    </div>
                    {caretaker ? (
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-primary" />
                            <span>Monitored by: {caretaker.name}</span>
                        </div>
                    ) : (
                         <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Not currently monitored by a caretaker.</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
