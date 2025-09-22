
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, ShieldCheck, UserCheck, Pencil } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ScannerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Forms & Intake</h1>
        <p className="text-muted-foreground">Digital pre-visit forms, consent, screening tools, and automated chart updates.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pre-Visit Forms</CardTitle>
            <CardDescription>Complete these forms before your next appointment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem 
              icon={FileText} 
              title="Health History Questionnaire"
              status="Completed"
              action="View"
            />
             <FormItem 
              icon={ShieldCheck} 
              title="Consent for Treatment"
              status="Action Required"
              action="Sign"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screening Tools</CardTitle>
            <CardDescription>Fill out these screeners as requested by your care team.</CardDescription>
          </CardHeader>
          <CardContent>
             <FormItem 
              icon={UserCheck} 
              title="PHQ-9 Depression Screening"
              status="Not Started"
              action="Start"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const FormItem = ({ icon: Icon, title, status, action }: { icon: React.ElementType, title: string, status: string, action: string }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
      <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary"/>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
      </div>
      <Button size="sm" variant={action === "Sign" ? "default" : "outline"}>
          <Pencil className="mr-2 h-4 w-4" />
          {action}
      </Button>
  </div>
);

