
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Video } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Secure Messaging
        </h1>
        <p className="text-muted-foreground">
          HIPAA-grade chat with the care team, structured templates, and file uploads.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Chat with Your Care Team</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                     <div className="p-4 bg-primary/10 rounded-full">
                        <MessageSquare className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground max-w-sm">
                        A secure chat interface to communicate with your doctor and care team will be here.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Start a Telehealth Visit</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                     <div className="p-4 bg-primary/10 rounded-full">
                        <Video className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground max-w-sm">
                       Join your scheduled video visits, check your device, and view summaries post-call.
                    </p>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
