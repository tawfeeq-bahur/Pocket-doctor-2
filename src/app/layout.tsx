
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AppLayout, SharedStateProvider } from '@/components/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
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
      <body className={`${inter.variable} font-body antialiased`}>
        <SharedStateProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </SharedStateProvider>
        <Toaster />
      </body>
    </html>
  );
}
