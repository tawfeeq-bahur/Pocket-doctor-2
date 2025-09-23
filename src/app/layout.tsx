
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { SharedStateProvider, AppLayout } from '@/components/AppLayout';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const metadata: Metadata = {
  title: 'Pocket Doctor',
  description: 'Your personal medication assistant.',
};

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
            <AppLayout>{children}</AppLayout>
          </SharedStateProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
