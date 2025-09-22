'use client';

import { useSharedState } from "@/components/AppLayout";
import CaretakerDashboard from "@/components/dashboards/CaretakerDashboard";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import PatientDashboard from "@/components/dashboards/PatientDashboard";

export default function Home() {
  const { user } = useSharedState();

  if (!user) {
    // This case is handled by AppLayout, which will redirect to /login
    return null; 
  }

  // Based on the logged-in user's role, render the appropriate dashboard.
  switch (user.role) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'caretaker':
      return <CaretakerDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      // Fallback in case of an unknown role.
      return <div className="p-4">Unknown user role.</div>;
  }
}
