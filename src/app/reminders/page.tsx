'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Snooze, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Reminder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialReminders: Reminder[] = [
  { id: '1', medicationName: 'Metformin', time: '08:00', status: 'pending' },
  { id: '2', medicationName: 'Lisinopril', time: '09:00', status: 'pending' },
  { id: '3', medicationName: 'Metformin', time: '20:00', status: 'snoozed' },
  { id: '4', medicationName: 'Atorvastatin', time: '21:00', status: 'pending' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const { toast } = useToast();

  const handleSnooze = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: 'snoozed' } : r));
    const reminder = reminders.find(r => r.id === id);
    toast({
      title: 'Reminder Snoozed',
      description: `Reminder for ${reminder?.medicationName} has been snoozed.`,
    });
  };

  const handleDelete = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    setReminders(reminders.filter(r => r.id !== id));
     toast({
      title: 'Reminder Deleted',
      description: `Reminder for ${reminder?.medicationName} has been deleted.`,
      variant: 'destructive',
    });
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Reminders</h1>
          <p className="text-muted-foreground">Manage your medication alerts and notifications.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>Here are your pending medication reminders for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map(reminder => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Bell className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">{reminder.medicationName}</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.time}</span>
                          {reminder.status === 'snoozed' && <Badge variant="secondary">Snoozed</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSnooze(reminder.id)}>
                        <Snooze className="mr-2 h-4 w-4" />
                        Snooze
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDelete(reminder.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <Bell className="mx-auto h-12 w-12" />
                <p className="mt-4">No upcoming reminders.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
