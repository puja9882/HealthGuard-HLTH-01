import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PatientAccessProvider } from '../context/PatientAccessContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Clock } from 'lucide-react';

export default function ClinicianLayout() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user || user.role !== 'clinician') {
    return <Navigate to="/login/clinician" replace />;
  }

  const isPendingVerification = user.verificationStatus === 'PENDING';

  return (
    <PatientAccessProvider>
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="max-w-5xl">
              {isPendingVerification && (
                <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Account Pending Medical Verification</h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Your clinician registration (MH-MED-10293) is currently undergoing administrative verification.
                      Full access to patient records requires verified credentials.
                    </p>
                  </div>
                </div>
              )}

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PatientAccessProvider>
  );
}
