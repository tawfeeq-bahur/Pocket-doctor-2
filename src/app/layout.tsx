
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { SharedStateProvider, useSharedState, AppLayout } from '@/components/AppLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LoaderCircle } from 'lucide-react';
import LoginPage from '@/app/login/page';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// We can't export metadata from a client component.
// We can either move it to a server component or keep it static.
// For now, let's just define it here.
const metadata: Metadata = {
  title: 'Pocket Doctor',
  description: 'Your personal medication assistant.',
};


function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, login, allUsers } = useSharedState();

  if (user === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage allUsers={allUsers} onLogin={login} />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SharedStateProvider>
            <AppInitializer>{children}</AppInitializer>
          </SharedStateProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
