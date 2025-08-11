
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'user@pillpal.com',
        dob: '1990-01-01',
        phone: '555-123-4567',
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>("https://placehold.co/80x80.png");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = () => {
        // In a real app, you would save this data to a backend.
        console.log("Saving profile:", profile);
        console.log("Avatar file:", fileInputRef.current?.files?.[0]);
         toast({
            title: "Profile Updated",
            description: "Your personal details have been saved.",
        });
    };

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Profile
          </h1>
          <p className="text-muted-foreground">View and edit your personal information.</p>
        </div>
        
        <div className="space-y-6 pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "https://placehold.co/80x80.png"} alt="User" data-ai-hint="person portrait" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="picture">Profile Picture</Label>
                <Input 
                    id="picture" 
                    type="file" 
                    className="mt-2" 
                    ref={fileInputRef}
                    onChange={handlePictureChange}
                    accept="image/png, image/jpeg, image/gif"
                />
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB.</p>
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profile.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email} onChange={handleInputChange} />
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={profile.dob} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
                </div>
             </div>
              <div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
          </div>

      </div>
  );
}
