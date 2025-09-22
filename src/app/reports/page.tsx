

'use client';

import { useSharedState } from '@/components/AppLayout';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { MedicationSummary } from '@/components/medication/MedicationSummary';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  const { patientData } = useSharedState();

  if (!patientData) {
     return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
           <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight font-headline">
                Reports & Achievements
              </h1>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <FileText className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No Patient Data</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Link to a patient to view their reports and achievements.
                  </p>
              </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {patientData.name}'s Reports & Achievements
        </h1>
        <p className="text-muted-foreground">
          View adherence statistics and badges.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
            Achievements
          </h2>
          <AchievementCard />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
            Adherence Overview
          </h2>
          <MedicationSummary medications={patientData.medications} />
        </div>
      </div>
    </div>
  );
}
