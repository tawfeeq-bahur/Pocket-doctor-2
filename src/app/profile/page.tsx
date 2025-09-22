
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSharedState } from '@/components/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserCog, Languages, Palette, Lock } from 'lucide-react';


export default function ProfilePage() {
    const { user } = useSharedState();
    const { toast } = useToast();
    
    const handleSaveChanges = () => {
        toast({
            title: "Settings Updated",
            description: "Your preferences have been saved.",
        });
    };

    if (!user) {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-5 w-72 mt-2" />
                    </div>
                     <Skeleton className="h-10 w-32" />
                </div>
             </div>
        )
    }

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Accessibility & UX
                </h1>
                <p className="text-muted-foreground">Mobile-first layout, RTL support, large-text mode, and in-app help.</p>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
        
        <div className="grid gap-6 pt-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <UserCog className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Display & Accessibility</CardTitle>
                    <CardDescription>Adjust display settings for a more comfortable experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="large-text" className="text-base">Large Text Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Increase the font size across the application.
                            </p>
                        </div>
                        <Switch id="large-text" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="rtl-mode" className="text-base">Right-to-Left (RTL) Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                For languages written from right to left.
                            </p>
                        </div>
                        <Switch id="rtl-mode" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Palette className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Choose your preferred language and region.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="language" className="text-base">Language</Label>
                            <p className="text-sm text-muted-foreground">
                                English (United States)
                            </p>
                        </div>
                         <Button variant="outline">Change</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Caregiver Access</CardTitle>
                    <CardDescription>Invite and manage caregiver roles with granular permissions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-40">
                    <p className="text-muted-foreground max-w-sm">
                        Functionality to invite and manage caregivers will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
  );
}
