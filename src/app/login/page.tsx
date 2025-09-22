
'use client';

import { useState } from 'react';
import { useSharedState } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, LogIn } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const { login } = useSharedState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // This is a simulated login. In a real app, you'd validate credentials.
    setError('');
    login(role);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
       <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Pill className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline">Pocket Doctor</h1>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Sign in as</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="caretaker">Caretaker</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full">
                <LogIn className="mr-2" />
                Sign In
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-center text-xs text-muted-foreground justify-center">
            <p>This is a simulated login. Any credentials will work.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
