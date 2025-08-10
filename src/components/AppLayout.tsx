
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Pill, Settings, User, Bell, BookUser, LifeBuoy } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Medication } from "@/lib/types";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guide", label: "Medication Guide", icon: LifeBuoy },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/profile", label: "Profile", icon: BookUser },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Define the shape of the shared state
interface SharedState {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id" | "doses">) => void;
  updateDoseStatus: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  deleteMedication: (medicationId: string) => void;
}

// Create the context
const SharedStateContext = createContext<SharedState | undefined>(undefined);

// Create a custom hook to use the shared state
export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};


const initialMedications: Medication[] = [
  {
    id: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice a day",
    timings: ["08:00", "20:00"],
    doses: [
      { scheduled: "08:00", status: "pending" },
      { scheduled: "20:00", status: "pending" },
    ],
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once a day",
    timings: ["09:00"],
    doses: [{ scheduled: "09:00", status: "taken" }],
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once a day",
    timings: ["21:00"],
    doses: [{ scheduled: "21:00", status: "skipped" }],
  },
];


// Create the provider component
export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const addMedication = (medication: Omit<Medication, "id" | "doses">) => {
    const newMedication: Medication = {
      ...medication,
      id: new Date().toISOString(),
      doses: medication.timings.map(t => ({ scheduled: t, status: 'pending' })),
    };
    setMedications(prev => [...prev, newMedication]);
  };
  
  const updateDoseStatus = (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => {
    setMedications(prevMeds => prevMeds.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          doses: med.doses.map(dose => 
            dose.scheduled === scheduledTime ? { ...dose, status } : dose
          )
        };
      }
      return med;
    }));
  };

  const deleteMedication = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
  };


  const value = {
    medications,
    addMedication,
    updateDoseStatus,
    deleteMedication,
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                    <Pill className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col">
                    <span className="font-semibold font-headline">Pocket Doctor</span>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{
                          children: item.label,
                          className: "bg-primary text-primary-foreground",
                        }}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="person portrait" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">User</span>
                    <span className="text-xs text-muted-foreground">user@pocketdoc.com</span>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col w-full">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
                  <SidebarTrigger />
                  <h1 className="text-lg font-semibold font-headline">Pocket Doctor</h1>
                </header>
                <SidebarInset>{children}</SidebarInset>
            </div>
          </div>
    </SidebarProvider>
  );
}
