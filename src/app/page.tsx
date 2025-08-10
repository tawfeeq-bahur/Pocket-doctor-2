"use client";

import { useState } from "react";
import type { Medication } from "@/lib/types";
import { AppLayout } from "@/components/AppLayout";
import { AddMedicationDialog } from "@/components/medication/AddMedicationDialog";
import { MedicationList } from "@/components/medication/MedicationList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MedicationSummary } from "@/components/medication/MedicationSummary";
import { Separator } from "@/components/ui/separator";

const initialMedications: Medication[] = [
  {
    id: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice a day",
    timings: ["08:00", "20:00"],
    doses: [
      { scheduled: "08:00", status: "pending" },
      { scheduled: "20:00", status: "pending" },
    ],
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once a day",
    timings: ["09:00"],
    doses: [{ scheduled: "09:00", status: "taken" }],
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once a day",
    timings: ["21:00"],
    doses: [{ scheduled: "21:00", status: "skipped" }],
  },
];


export default function DashboardPage() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const addMedication = (medication: Omit<Medication, "id" | "doses">) => {
    const newMedication: Medication = {
      ...medication,
      id: new Date().toISOString(),
      doses: medication.timings.map(t => ({ scheduled: t, status: 'pending' })),
    };
    setMedications(prev => [...prev, newMedication]);
  };
  
  const updateDoseStatus = (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => {
    setMedications(prevMeds => prevMeds.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          doses: med.doses.map(dose => 
            dose.scheduled === scheduledTime ? { ...dose, status } : dose
          )
        };
      }
      return med;
    }));
  };

  const deleteMedication = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Medication Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <AddMedicationDialog onAddMedication={addMedication}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </AddMedicationDialog>
          </div>
        </div>
        <MedicationSummary medications={medications} />
        <Separator className="my-4" />
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          My Medications
        </h2>
        <MedicationList medications={medications} onUpdateDose={updateDoseStatus} onDeleteMedication={deleteMedication} />
      </div>
    </AppLayout>
  );
}
