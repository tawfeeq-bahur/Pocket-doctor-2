
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, PlusCircle } from "lucide-react";

export default function AppointmentsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Appointments
                    </h1>
                    <p className="text-muted-foreground">
                        Self-scheduling, reschedule/cancel, waitlist, and automated reminders.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2" />
                    Schedule New
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <CalendarClock className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Your appointment calendar will be displayed here.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
