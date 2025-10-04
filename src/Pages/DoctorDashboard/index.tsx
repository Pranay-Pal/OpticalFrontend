import { useState } from 'react';
import DoctorHeader from './Header';
import Sidebar from './Sidebar';
import { Routes, Route, Navigate } from 'react-router';
import PatientsPage from './Patients';
import PrescriptionsPage from './Prescriptions';
import { useAuth } from '@/hooks/useAuth'; // Authorization handled by wrapper

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">Content coming soon.</p>
    </div>
  );
}

export default function DoctorDashboard() {
  useAuth(); // invoke for potential future context (no direct usage)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-72">
        <DoctorHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Placeholder title="Overview" />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}