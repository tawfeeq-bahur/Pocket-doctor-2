
'use client';

import { useSharedState } from "@/components/AppLayout";
import { MedicationList } from "@/components/medication/MedicationList";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, PlusCircle, MessageSquare, CalendarClock, HeartPulse, LoaderCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { differenceInDays, format, isFuture, parseISO } from "date-fns";

export default function PatientDashboard() {
  const { patientData, updateDoseStatus, deleteMedication } = useSharedState();

  if (!patientData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const nextAppointmentDate = patientData.appointments.next ? parseISO(patientData.appointments.next) : null;
  const daysUntilAppointment = nextAppointmentDate && isFuture(nextAppointmentDate) ? differenceInDays(nextAppointmentDate, new Date()) : null;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Welcome, {patientData.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Upcoming appointments, recent labs, medication reminders, care tasks, and secure messages.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {daysUntilAppointment !== null && (
             <DashboardCard 
              icon={CalendarClock}
              title="Next Appointment"
              value={`${daysUntilAppointment} days`}
              description={`on ${format(nextAppointmentDate!, 'MMM d, yyyy')}`}
              link="/appointments"
            />
         )}
        <DashboardCard 
          icon={HeartPulse}
          title="Recent Labs"
          value="Results pending"
          description="from your last visit"
          link="/guide"
        />
         <DashboardCard 
          icon={MessageSquare}
          title="New Messages"
          value="1 Unread"
           description="from Dr. Reed"
          link="/reports"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Today's Medications
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
                Your schedule is empty. Add a medication from your E-Prescriptions.
              </p>
              <Button asChild className="mt-2">
                <Link href="/prescriptions">
                  <PlusCircle className="mr-2" />
                  Add Medication
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const DashboardCard = ({ icon: Icon, title, value, description, link }: { icon: React.ElementType, title: string, value: string, description: string, link: string }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
       <Button asChild variant="ghost" size="icon" className="ml-auto">
          <Link href={link}>
            <PlusCircle className="h-5 w-5" />
          </Link>
       </Button>
    </CardContent>
  </Card>
)
