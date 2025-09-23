
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  HeartPulse,
  Pill,
  BarChart,
  Settings,
  Stethoscope,
  Users,
  Notebook,
  FolderKanban,
  Video,
  BarChart2,
  ShieldQuestion,
  UserCog,
  Home,
  FileText,
  Scan,
  Bot,
  User,
  CalendarClock,
  LoaderCircle,
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type {
  AppUser,
  Medication,
  EmergencyContact,
  UserRole,
  Patient,
  Caretaker,
} from '@/lib/types';
import { ThemeToggle } from './ThemeToggle';
import { Separator } from './ui/separator';
import { MOCK_USERS, MOCK_PATIENTS } from '@/lib/mock-data';

// PATIENT
const patientMenuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/guide', label: 'Medication Guide', icon: HeartPulse },
  { href: '/scanner', label: 'Prescription Scanner', icon: Scan },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// DOCTOR
const doctorMenuItems = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/doctor/patients', label: 'Patient 360°', icon: Users },
  { href: '/doctor/prescriptions', label: 'Notes & Orders', icon: Notebook },
  { href: '/doctor/labs', label: 'Inbox', icon: FolderKanban },
  { href: '/doctor/messages', label: 'Telemedicine', icon: Video },
  { href: '/doctor/records', label: 'Care Plans', icon: HeartPulse },
  { href: '/doctor/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/doctor/permissions', label: 'Permissions', icon: ShieldQuestion },
  { href: '/profile', label: 'Profile', icon: Stethoscope },
];

// CARETAKER
const caretakerMenuItems = [
  { href: '/', label: 'Taskboard', icon: Home },
  { href: '/guide', label: 'Proxy Scheduling', icon: FileText },
  { href: '/appointments', label: 'Document Vault', icon: Notebook },
  { href: '/reports', label: 'Observation Logs', icon: FolderKanban },
  { href: '/scanner', label: 'Permission Manager', icon: UserCog },
  { href: '/profile', label: 'Profile', icon: User },
];

const getMenuItems = (role: UserRole) => {
  switch (role) {
    case 'doctor':
      return doctorMenuItems;
    case 'caretaker':
      return caretakerMenuItems;
    case 'patient':
    default:
      return patientMenuItems;
  }
};

interface SharedState {
  user?: AppUser | null;
  allUsers: AppUser[];
  allPatients: Patient[];
  patientData: Patient | null;
  addMedication: (medication: Omit<Medication, 'id' | 'doses'>) => void;
  updateDoseStatus: (
    medicationId: string,
    scheduledTime: string,
    status: 'taken' | 'skipped'
  ) => void;
  deleteMedication: (medicationId: string) => void;
  addContact: (contact: EmergencyContact) => void;
  removeContact: (contactId: string) => void;
  linkCaretakerToPatient: (patientCode: string) => boolean;
  addPatient: (
    patient: Omit<
      Patient,
      | 'id'
      | 'fallback'
      | 'patientCode'
      | 'role'
      | 'medications'
      | 'emergencyContacts'
      | 'medicalHistory'
      | 'avatar'
      | 'caretakerId'
    > & { caretakerId?: string }
  ) => void;
  switchUser: (userId: string | null) => void;
}

const SharedStateContext = createContext<SharedState | undefined>(undefined);

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};

export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [allUsers, setAllUsers] = useState<AppUser[]>(MOCK_USERS);
  const [allPatients, setAllPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    // Default to the first patient on load
    const defaultUser = allUsers.find(u => u.id === 'user-patient-1');
    if(defaultUser) {
      setUser(defaultUser);
    }
  }, []); // Runs only once on initial mount

  useEffect(() => {
    if (user?.role === 'patient') {
      const currentPatient = allPatients.find((p) => p.id === user.id);
      setPatientData(currentPatient || null);
    } else if (user?.role === 'caretaker' && user.patientId) {
      const linkedPatient = allPatients.find((p) => p.id === user.patientId);
      setPatientData(linkedPatient || null);
    } else {
      setPatientData(null);
    }
  }, [user, allPatients]);

  const switchUser = (userId: string | null) => {
    if (userId === null) {
      setUser(null);
      setPatientData(null);
      return;
    }
    const selectedUser = allUsers.find((u) => u.id === userId);
    if (selectedUser) {
      setUser(selectedUser);
    }
  };

  const updatePatientData = (updatedPatient: Patient) => {
    setAllPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
     setAllUsers((prev) =>
      prev.map((u) => (u.id === updatedPatient.id ? updatedPatient : u))
    );
  };
  
   const updateCaretakerData = (updatedCaretaker: Caretaker) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === updatedCaretaker.id ? updatedCaretaker : u))
    );
  };

  const addMedication = (medication: Omit<Medication, 'id' | 'doses'>) => {
    if (!patientData) return;
    const newMedication: Medication = {
      ...medication,
      id: new Date().toISOString(),
      doses: medication.timings.map((t) => ({
        scheduled: t,
        status: 'pending',
      })),
    };
    const updatedPatient = {
      ...patientData,
      medications: [...patientData.medications, newMedication],
    };
    updatePatientData(updatedPatient);
  };

  const updateDoseStatus = (
    medicationId: string,
    scheduledTime: string,
    status: 'taken' | 'skipped'
  ) => {
    if (!patientData) return;
    const updatedPatient = {
      ...patientData,
      medications: patientData.medications.map((med) => {
        if (med.id === medicationId) {
          return {
            ...med,
            doses: med.doses.map((dose) =>
              dose.scheduled === scheduledTime ? { ...dose, status } : dose
            ),
          };
        }
        return med;
      }),
    };
    updatePatientData(updatedPatient);
  };

  const deleteMedication = (medicationId: string) => {
    if (!patientData) return;
    const updatedPatient = {
      ...patientData,
      medications: patientData.medications.filter(
        (med) => med.id !== medicationId
      ),
    };
    updatePatientData(updatedPatient);
  };

  const addContact = (contact: EmergencyContact) => {
    if (
      !patientData ||
      patientData.emergencyContacts.find((c) => c.id === contact.id)
    )
      return;
    const updatedPatient = {
      ...patientData,
      emergencyContacts: [...patientData.emergencyContacts, contact],
    };
    updatePatientData(updatedPatient);
  };

  const removeContact = (contactId: string) => {
    if (!patientData) return;
    const updatedPatient = {
      ...patientData,
      emergencyContacts: patientData.emergencyContacts.filter(
        (c) => c.id !== contactId
      ),
    };
    updatePatientData(updatedPatient);
  };

  const linkCaretakerToPatient = useCallback(
    (patientCode: string): boolean => {
      const patientToLink = allPatients.find(
        (p) => p.patientCode === patientCode
      );

      if (patientToLink && user?.role === 'caretaker') {
        const updatedCaretaker = { ...user, patientId: patientToLink.id } as Caretaker;
        setUser(updatedCaretaker);
        updateCaretakerData(updatedCaretaker);

        const updatedPatient = { ...patientToLink, caretakerId: user.id };
        updatePatientData(updatedPatient);

        setPatientData(updatedPatient);
        return true;
      }
      return false;
    },
    [user, allPatients]
  );

  const addPatient = (
    patientInfo: Omit<
      Patient,
      | 'id'
      | 'fallback'
      | 'patientCode'
      | 'role'
      | 'medications'
      | 'emergencyContacts'
      | 'medicalHistory'
      | 'avatar'
      | 'caretakerId'
    > & { caretakerId?: string }
  ) => {
    const newId = `user-patient-${Date.now()}`;
    const nameParts = patientInfo.name.split(' ');
    const fallback = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');
    const patientCode = `${fallback.toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const newPatient: Patient = {
      ...patientInfo,
      id: newId,
      role: 'patient',
      fallback,
      patientCode,
      medications: [],
      emergencyContacts: [],
      medicalHistory: {
        allergies: 'None',
        chronicConditions: 'None',
      },
      avatar: '',
      caretakerId: patientInfo.caretakerId || undefined,
    };

    setAllPatients((prev) => [...prev, newPatient]);
    setAllUsers((prev) => [...prev, newPatient]);
    
    if (patientInfo.caretakerId) {
      const caretaker = allUsers.find(u => u.id === patientInfo.caretakerId) as Caretaker;
      if (caretaker) {
        const updatedCaretaker = { ...caretaker, patientId: newId };
        updateCaretakerData(updatedCaretaker);
      }
    }
  };

  const value: SharedState = {
    user,
    allUsers,
    allPatients,
    patientData,
    addMedication,
    updateDoseStatus,
    deleteMedication,
    addContact,
    removeContact,
    linkCaretakerToPatient,
    addPatient,
    switchUser,
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, patientData, allUsers, switchUser } = useSharedState();

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const menuItems = getMenuItems(user.role);

  let userDetails = user;
  let viewDescription = `${
    user.role.charAt(0).toUpperCase() + user.role.slice(1)
  } View`;

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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full bg-sidebar-primary text-sidebar-primary-foreground"
                >
                  <Pill className="h-4 w-4" />
                </Button>
                <div className="flex flex-col">
                  <span className="font-semibold font-headline">
                    Pocket Doctor
                  </span>
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
                      className: 'bg-primary text-primary-foreground',
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
                  <AvatarImage
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    data-ai-hint="person portrait"
                  />
                  <AvatarFallback>{userDetails.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userDetails.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {viewDescription}
                  </span>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col w-full">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold font-headline">
              Pocket Doctor
            </h1>
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
