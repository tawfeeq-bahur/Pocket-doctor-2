import { getDatabase } from './mongodb';
import { PatientDB, DoctorDB, CaretakerDB, Appointment } from './models';
import { subDays, addDays, formatISO } from "date-fns";

const patient1Medications = [
  {
    id: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice a day",
    startDate: subDays(new Date(), 35).toISOString(),
    timings: ["08:00", "20:00"],
    doses: [
      { scheduled: "08:00", status: "taken" as const },
      { scheduled: "20:00", status: "pending" as const },
    ],
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once a day",
    startDate: subDays(new Date(), 10).toISOString(),
    timings: ["09:00"],
    doses: [{ scheduled: "09:00", status: "taken" as const }],
  },
];

const patient2Medications = [
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once a day",
    startDate: new Date().toISOString(),
    timings: ["21:00"],
    doses: [{ scheduled: "21:00", status: "skipped" as const }],
  },
  {
    id: "4",
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once a day",
    startDate: subDays(new Date(), 60).toISOString(),
    timings: ["10:00"],
    doses: [{ scheduled: "10:00", status: "taken" as const }],
  },
];

export async function initializeDatabase() {
  try {
    const db = await getDatabase();
    
    // Clear existing data
    await db.collection('patients').deleteMany({});
    await db.collection('doctors').deleteMany({});
    await db.collection('caretakers').deleteMany({});
    await db.collection('appointments').deleteMany({});
    
    // Insert patients
    const patients: PatientDB[] = [
      {
        id: 'user-patient-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'patient',
        avatar: 'https://i.pravatar.cc/150?u=john-doe',
        fallback: 'JD',
        patientCode: 'JD-9D3K4L',
        caretakerId: 'user-caretaker-1',
        doctorId: 'user-doctor-1',
        medications: patient1Medications,
        emergencyContacts: [
          { id: '1', name: 'Jane Doe', phone: '555-123-4567', initials: 'JD' },
        ],
        medicalHistory: {
          allergies: 'Peanuts, Penicillin',
          chronicConditions: 'Hypertension, Type 2 Diabetes',
        },
        appointments: {
          next: formatISO(addDays(new Date(), 15), { representation: 'date' }),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-patient-2',
        name: 'Emily Smith',
        email: 'emily.smith@example.com',
        role: 'patient',
        avatar: 'https://i.pravatar.cc/150?u=emily-smith',
        fallback: 'ES',
        patientCode: 'ES-L8F9G2',
        doctorId: 'user-doctor-1',
        medications: patient2Medications,
        emergencyContacts: [],
        medicalHistory: {
          allergies: 'None',
          chronicConditions: 'Asthma',
        },
        appointments: {
          next: formatISO(addDays(new Date(), 22), { representation: 'date' }),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Insert doctors
    const doctors: DoctorDB[] = [
      {
        id: 'user-doctor-1',
        name: 'Dr. Evelyn Reed',
        email: 'e.reed@clinic.com',
        role: 'doctor',
        avatar: 'https://i.pravatar.cc/150?u=evelyn-reed',
        fallback: 'ER',
        patientIds: ['user-patient-1', 'user-patient-2'],
        specialization: 'Internal Medicine',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Insert caretakers
    const caretakers: CaretakerDB[] = [
      {
        id: 'user-caretaker-1',
        name: 'Susan Miller',
        email: 's.miller@family.com',
        role: 'caretaker',
        avatar: 'https://i.pravatar.cc/150?u=susan-miller',
        fallback: 'SM',
        patientId: 'user-patient-1',
        relationship: 'Daughter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-caretaker-2',
        name: 'David Chen',
        email: 'd.chen@family.com',
        role: 'caretaker',
        avatar: 'https://i.pravatar.cc/150?u=david-chen',
        fallback: 'DC',
        relationship: 'Son',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Insert appointments
    const appointments: Appointment[] = [
      {
        id: 'appointment-1',
        patientId: 'user-patient-1',
        doctorId: 'user-doctor-1',
        date: formatISO(addDays(new Date(), 15), { representation: 'date' }),
        time: '10:00',
        description: 'Regular checkup and medication review',
        status: 'scheduled',
      },
      {
        id: 'appointment-2',
        patientId: 'user-patient-2',
        doctorId: 'user-doctor-1',
        date: formatISO(addDays(new Date(), 22), { representation: 'date' }),
        time: '14:30',
        description: 'Asthma management consultation',
        status: 'scheduled',
      },
    ];
    
    // Insert all data
    await db.collection('patients').insertMany(patients);
    await db.collection('doctors').insertMany(doctors);
    await db.collection('caretakers').insertMany(caretakers);
    await db.collection('appointments').insertMany(appointments);
    
    console.log('Database initialized successfully!');
    return { success: true, message: 'Database initialized successfully!' };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
