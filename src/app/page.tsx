
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSharedState } from "@/components/AppLayout";
import CaretakerDashboard from "@/components/dashboards/CaretakerDashboard";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import PatientDashboard from "@/components/dashboards/PatientDashboard";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const { user } = useSharedState();
  const router = useRouter();

  // On initial load, if the user is not determined, show a loader.
  if (user === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is null (logged out), redirect to the login page.
  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);
  
  // If the user is logged out, the useEffect above will redirect. Show a loader in the meantime.
  if (user === null) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
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
