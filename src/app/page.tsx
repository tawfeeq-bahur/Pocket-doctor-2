
"use client";

import { useSharedState } from "@/components/AppLayout";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import CaretakerDashboard from "@/components/dashboards/CaretakerDashboard";
import { LoaderCircle } from "lucide-react";
import { MedicationList } from "@/components/medication/MedicationList";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, patientData, updateDoseStatus, deleteMedication } = useSharedState();
  
  if (!user) {
    return <div className="flex items-center justify-center h-screen"><LoaderCircle className="animate-spin h-8 w-8"/></div>;
  }

  // ROUTING LOGIC
  switch (user.role) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'caretaker':
       // If caretaker is not linked to a patient yet, show the linking dashboard.
      if (!patientData) {
        return <CaretakerDashboard />;
      }
      // If linked, show the patient's data.
      return (
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                  <div className="space-y-1">
                      <h1 className="text-3xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-transparent bg-clip-text">
                          {patientData.name}'s Dashboard
                      </h1>
                       <p className="text-muted-foreground">Monitoring patient's medication schedule.</p>
                  </div>
              </div>
              <MedicationList 
                medications={patientData.medications} 
                onUpdateDose={updateDoseStatus} 
                onDeleteMedication={deleteMedication} 
              />
          </div>
       );
    case 'patient':
        if (patientData) {
            return (
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-transparent bg-clip-text">
                        Medication Dashboard
                    </h1>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                        Today's Schedule
                        </h2>
                        {patientData.medications.length > 0 ? (
                        <MedicationList 
                            medications={patientData.medications} 
                            onUpdateDose={updateDoseStatus} 
                            onDeleteMedication={deleteMedication} 
                        />
                        ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                                <div className="p-4 bg-primary/10 rounded-full">
                                <Pill className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">No Medications Added</h3>
                                <p className="text-muted-foreground max-w-sm">
                                Your schedule is empty. Get started by looking up a medication and adding it to your list.
                                </p>
                                <Button asChild className="mt-2">
                                <Link href="/guide">
                                    <PlusCircle className="mr-2" />
                                    Add First Medication
                                </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        )}
                    </div>
                </div>
            );
        }
        // Fallthrough to loader if patient data is not ready
  }
  
  // Fallback for any unhandled cases or while data is loading.
  return <div className="flex items-center justify-center h-screen"><LoaderCircle className="animate-spin h-8 w-8"/></div>
}
