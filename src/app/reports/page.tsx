
'use client';

import { useSharedState } from '@/components/AppLayout';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { MedicationSummary } from '@/components/medication/MedicationSummary';

export default function ReportsPage() {
  const { medications } = useSharedState();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Reports & Achievements
        </h1>
        <p className="text-muted-foreground">
          View your adherence statistics and badges.
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
          <MedicationSummary medications={medications} />
        </div>
      </div>
    </div>
  );
}
