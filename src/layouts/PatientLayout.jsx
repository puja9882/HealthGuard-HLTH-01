import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const titleByPath = {
  '/patient': 'Dashboard',
  '/patient/profile': 'Profile',
  '/patient/history': 'Medical History',
  '/patient/prescriptions': 'Prescriptions',
  '/patient/qr': 'Generate QR',
  '/patient/access-history': 'Access History',
  '/patient/notifications': 'Notifications',
};

export default function PatientLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = titleByPath[location.pathname] || 'Patient Portal';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar title={title} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
