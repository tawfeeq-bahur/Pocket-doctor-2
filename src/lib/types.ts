
export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timings: string[];
  startDate: string;
  doses: {
    scheduled: string;
    status: "pending" | "taken" | "skipped";
  }[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  disclaimer?: string;
};

export type EmergencyContact = {
  id:string;
  name: string;
  phone: string;
  initials: string;
};

export type Reminder = {
  id: string;
  medicationName: string;
  time: string;
  status: 'pending' | 'snoozed';
};

export type UserRole = 'patient' | 'doctor' | 'caretaker';
