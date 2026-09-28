import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
