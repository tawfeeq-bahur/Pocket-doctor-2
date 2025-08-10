
"use client";

import { useSharedState } from "@/components/AppLayout";
import { MedicationList } from "@/components/medication/MedicationList";
import { MedicationSummary } from "@/components/medication/MedicationSummary";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { medications, updateDoseStatus, deleteMedication } = useSharedState();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Medication Dashboard
        </h1>
      </div>
      <MedicationSummary medications={medications} />
      <Separator className="my-4" />
      <h2 className="text-2xl font-bold tracking-tight font-headline">
        Today's Schedule
      </h2>
       {medications.length > 0 ? (
        <MedicationList medications={medications} onUpdateDose={updateDoseStatus} onDeleteMedication={deleteMedication} />
      ) : (
         <Card>
          <CardHeader>
            <CardTitle>No Medications Added</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-60">
              <Pill className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground">You haven't added any medications yet.</p>
              <Button asChild>
                <Link href="/guide">Go to Medication Guide to add one</Link>
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
