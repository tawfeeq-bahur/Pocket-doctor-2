
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PatientsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Patient Management
                </h1>
                <p className="text-muted-foreground">
                    View and manage your list of patients.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>My Patients</CardTitle>
                    <CardDescription>
                        A list of patients currently under your care.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                     <div className="p-4 bg-primary/10 rounded-full">
                        <Users className="w-12 h-12 text-primary" />
                    </div>
                     <h3 className="text-xl font-semibold">Feature Under Construction</h3>
                    <p className="text-muted-foreground max-w-sm">
                        The ability to view and manage your patient list is coming soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
