
'use client';

import { useState } from 'react';
import { useSharedState } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, LogIn } from 'lucide-react';
import type { UserRole, AppUser } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useMemo } from 'react';

export default function LoginPage() {
  const { login, allUsers } = useSharedState();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user.');
      return;
    }
    if (password !== '123') {
        setError('Incorrect password. Hint: it is 123.');
        return;
    }
    setError('');
    login(selectedUserId);
  };
  
  const usersForRole = useMemo(() => {
    return allUsers.filter(u => u.role === selectedRole);
  }, [allUsers, selectedRole]);
  
  const handleRoleChange = (role: UserRole) => {
      setSelectedRole(role);
      setSelectedUserId('');
  }

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
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Sign in as</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => handleRoleChange(value)}>
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
             <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={!selectedRole}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {usersForRole.map(user => (
                     <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
             {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full">
                <LogIn className="mr-2" />
                Sign In
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-center text-xs text-muted-foreground justify-center">
            <p>Password is `123` for all users.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
