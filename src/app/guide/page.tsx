
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileHeart, FilePlus, Receipt } from "lucide-react";

export default function GuidePage() {
  
  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Health Records</h1>
          <p className="text-muted-foreground">
            View and download labs, prescriptions, visit notes, and more.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecordCard 
            icon={FileHeart}
            title="Visit Notes"
            description="Summaries from your recent appointments."
          />
          <RecordCard 
            icon={Receipt}
            title="Prescriptions"
            description="A full history of your prescribed medications."
          />
          <RecordCard 
            icon={FilePlus}
            title="Lab Results"
            description="View results from blood tests and other labs."
          />
        </div>
      </div>
  );
}

const RecordCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
      <p className="text-sm text-center mt-6 text-muted-foreground">(Details would be displayed here)</p>
    </CardContent>
  </Card>
)
