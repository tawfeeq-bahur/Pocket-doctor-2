
'use client';

import { Stethoscope } from "lucide-react";
import { useSharedState } from "../AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function DoctorDashboard() {
    const { role } = useSharedState();
    const title = role === 'doctor' ? 'Doctor Dashboard' : 'Caretaker Dashboard';
    const description = role === 'doctor' ? 'An overview of your patient metrics.' : 'Monitor patient adherence and progress.';

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    {title}
                </h1>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome!</CardTitle>
                    <CardDescription>
                        This is the main dashboard for the {role} view.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                     <div className="p-4 bg-primary/10 rounded-full">
                        <Stethoscope className="w-12 h-12 text-primary" />
                    </div>
                     <h3 className="text-xl font-semibold">Dashboard Under Construction</h3>
                    <p className="text-muted-foreground max-w-sm">
                        The {role} dashboard and patient management features are coming soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
