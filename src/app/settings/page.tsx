
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function SettingsPage() {
  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Education Hub
          </h1>
          <p className="text-muted-foreground">Personalized content linked to diagnoses/meds and visit notes to boost self-management.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>
                    Articles and videos related to your health conditions.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                 <div className="p-4 bg-primary/10 rounded-full">
                    <GraduationCap className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Learning Materials</h3>
                <p className="text-muted-foreground max-w-sm">
                    Personalized educational content and resources will appear here.
                </p>
            </CardContent>
        </Card>
      </div>
  );
}
