
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Pill, Settings, User, FileText, BookUser, LifeBuoy, ScanLine, Users, Stethoscope, LogOut } from "lucide-react";
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
import type { Medication, EmergencyContact, UserRole } from "@/lib/types";
import { subDays } from "date-fns";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";

const patientMenuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guide", label: "Medication Guide", icon: LifeBuoy },
  { href: "/scanner", label: "Prescription Scanner", icon: ScanLine },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/profile", label: "Profile", icon: BookUser },
  { href: "/settings", label: "Settings", icon: Settings },
];

const doctorMenuItems = [
  { href: "/doctor/dashboard", label: "Doctor Dashboard", icon: Stethoscope },
  { href: "/doctor/patients", label: "Patients", icon: Users },
];

const caretakerMenuItems = [
    { href: "/", label: "Patient Dashboard", icon: LayoutDashboard },
    { href: "/reports", label: "Patient Reports", icon: FileText },
];

// Define the shape of the shared state
interface SharedState {
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id" | "doses">) => void;
  updateDoseStatus: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  deleteMedication: (medicationId: string) => void;
  contacts: EmergencyContact[];
  addContact: (contact: EmergencyContact) => void;
  removeContact: (contactId: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
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
    startDate: subDays(new Date(), 35).toISOString(),
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
    startDate: subDays(new Date(), 10).toISOString(),
    timings: ["09:00"],
    doses: [{ scheduled: "09:00", status: "taken" }],
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once a day",
    startDate: new Date().toISOString(),
    timings: ["21:00"],
    doses: [{ scheduled: "21:00", status: "skipped" }],
  },
];


// Create the provider component
export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [role, setRole] = useState<UserRole>('patient');

  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Optionally reset role to default
    setRole('patient');
  };

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
  
  const addContact = (contact: EmergencyContact) => {
     if (!contacts.find(c => c.id === contact.id)) {
        setContacts(prev => [...prev, contact]);
     }
  }

  const removeContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };


  const value = {
    isAuthenticated,
    login,
    logout,
    medications,
    addMedication,
    updateDoseStatus,
    deleteMedication,
    contacts,
    addContact,
    removeContact,
    role,
    setRole
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, isAuthenticated, logout } = useSharedState();

  if (!isAuthenticated) {
     return <>{children}</>;
  }

  const menuItems = {
      patient: patientMenuItems,
      doctor: doctorMenuItems,
      caretaker: caretakerMenuItems
  }[role];

  const userDetails = {
    patient: { name: 'John Doe', email: 'user@pocketdoc.com', avatar: 'https://placehold.co/40x40.png', fallback: 'JD' },
    doctor: { name: 'Dr. Smith', email: 'dr.smith@clinic.com', avatar: 'https://placehold.co/40x40.png', fallback: 'DS' },
    caretaker: { name: 'Jane Doe', email: 'jane.d@family.com', avatar: 'https://placehold.co/40x40.png', fallback: 'JD' },
  }[role];

  const currentRoleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                            <Pill className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col">
                            <span className="font-semibold font-headline">Pocket Doctor</span>
                        </div>
                    </div>
                     <ThemeToggle />
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
                 <Separator className="my-2 bg-sidebar-border" />
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userDetails.avatar} alt={userDetails.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{userDetails.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{userDetails.name}</span>
                        <span className="text-xs text-muted-foreground">{currentRoleName} View</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={logout}>
                        <LogOut className="h-4 w-4"/>
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col w-full">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
                  <SidebarTrigger />
                  <h1 className="text-lg font-semibold font-headline">Pocket Doctor</h1>
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </header>
                <SidebarInset>{children}</SidebarInset>
            </div>
          </div>
    </SidebarProvider>
  );
}
