

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Pill, Settings, User, FileText, BookUser, LifeBuoy, ScanLine, Users, Stethoscope, LogOut, MonitorSmartphone } from "lucide-react";
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
import type { AppUser, Medication, EmergencyContact, UserRole, Patient } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";
import { MOCK_USERS, MOCK_PATIENTS } from "@/lib/mock-data";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guide", label: "Medication Guide", icon: LifeBuoy },
  { href: "/scanner", label: "Prescription Scanner", icon: ScanLine },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/doctor/patients", label: "Patients", icon: Users },
  { href: "/profile", label: "Profile", icon: BookUser },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Define the shape of the shared state
interface SharedState {
  isAuthenticated: boolean;
  user: AppUser | null;
  login: (userId: string) => void;
  logout: () => void;
  
  // Patient-specific state
  patientData: Patient | null,
  addMedication: (medication: Omit<Medication, "id" | "doses">) => void;
  updateDoseStatus: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  deleteMedication: (medicationId: string) => void;
  addContact: (contact: EmergencyContact) => void;
  removeContact: (contactId: string) => void;
  linkCaretakerToPatient: (patientCode: string) => boolean;
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


// Create the provider component
export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    // This effect runs when the user logs in or when the list of all patients changes.
    // It finds the correct patient data based on the user's role.
    if (user?.role === 'patient') {
      const currentPatient = allPatients.find(p => p.id === user.id);
      setPatientData(currentPatient || null);
    } else if (user?.role === 'caretaker') {
       // If the caretaker has a linked patientId, find that patient's data.
       const linkedPatient = allPatients.find(p => p.id === user.patientId);
       setPatientData(linkedPatient || null);
    } else {
      // For doctors or unlinked caretakers, there is no specific patient data to show.
      setPatientData(null);
    }
  }, [user, allPatients]);


  const login = (userId: string) => {
    const selectedUser = MOCK_USERS.find(u => u.id === userId);
    if (selectedUser) {
      setUser(selectedUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPatientData(null);
  };
  
  const updatePatientData = (updatedPatient: Patient) => {
    // This function updates a patient's data in the central `allPatients` state.
    // This ensures that any changes (like adding a medication) are reflected everywhere.
    setAllPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  
  const addMedication = (medication: Omit<Medication, "id" | "doses">) => {
    if (!patientData) return;
    const newMedication: Medication = {
      ...medication,
      id: new Date().toISOString(),
      doses: medication.timings.map(t => ({ scheduled: t, status: 'pending' })),
    };
    const updatedPatient = {
      ...patientData,
      medications: [...patientData.medications, newMedication]
    };
    updatePatientData(updatedPatient);
  };
  
  const updateDoseStatus = (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => {
    if (!patientData) return;
    const updatedPatient = {
      ...patientData,
      medications: patientData.medications.map(med => {
        if (med.id === medicationId) {
          return {
            ...med,
            doses: med.doses.map(dose => 
              dose.scheduled === scheduledTime ? { ...dose, status } : dose
            )
          };
        }
        return med;
      })
    };
     updatePatientData(updatedPatient);
  };

  const deleteMedication = (medicationId: string) => {
     if (!patientData) return;
     const updatedPatient = {
       ...patientData,
       medications: patientData.medications.filter(med => med.id !== medicationId)
     };
     updatePatientData(updatedPatient);
  };
  
  const addContact = (contact: EmergencyContact) => {
     if (!patientData || patientData.emergencyContacts.find(c => c.id === contact.id)) return;
     const updatedPatient = {
       ...patientData,
       emergencyContacts: [...patientData.emergencyContacts, contact]
     };
     updatePatientData(updatedPatient);
  }

  const removeContact = (contactId: string) => {
     if (!patientData) return;
      const updatedPatient = {
       ...patientData,
       emergencyContacts: patientData.emergencyContacts.filter(c => c.id !== contactId)
     };
     updatePatientData(updatedPatient);
  };
  
  const linkCaretakerToPatient = useCallback((patientCode: string): boolean => {
    const patientToLink = allPatients.find(p => p.patientCode === patientCode);
    
    // Check if a patient with the code exists and if the current user is a caretaker
    if (patientToLink && user?.role === 'caretaker') {
      // 1. Link patient to caretaker in the user object
      const updatedCaretaker = { ...user, patientId: patientToLink.id };
      setUser(updatedCaretaker as AppUser);
      
      // 2. Link caretaker to patient in the patient object
      const updatedPatient = { ...patientToLink, caretakerId: user.id };
      updatePatientData(updatedPatient);

      // 3. Set the currently viewed patient data for the caretaker
      setPatientData(updatedPatient);
      return true;
    }
    return false;
  }, [user, allPatients]);


  const value: SharedState = {
    isAuthenticated,
    user,
    login,
    logout,
    patientData,
    addMedication,
    updateDoseStatus,
    deleteMedication,
    addContact,
    removeContact,
    linkCaretakerToPatient,
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, patientData } = useSharedState();

  // If the user is not authenticated, just render the children (which will be the LoginPage)
  if (!isAuthenticated || !user) {
     return <>{children}</>;
  }

  // From here, we know the user is authenticated.
  let userDetails = user;
  let viewDescription = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} View`;
  
  // If the user is a caretaker and is linked to a patient, update their display info.
  if (user.role === 'caretaker' && patientData) {
      userDetails = {
          ...user,
          name: `${user.name} (Caring for ${patientData.name})`,
      };
      viewDescription = `Monitoring: ${patientData.name}`;
  }


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
                        <span className="text-xs text-muted-foreground">{viewDescription}</span>
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

