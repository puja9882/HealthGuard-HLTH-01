import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PatientAccessProvider } from '../context/PatientAccessContext';
import ClinicianNavbar from '../components/ClinicianNavbar';
import ClinicianSidebar from '../components/ClinicianSidebar';
import { AlertCircle, Clock } from 'lucide-react';

export default function ClinicianLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || user.role !== 'clinician') {
    return <Navigate to="/login/clinician" replace />;
  }

  const isPendingVerification = user.verificationStatus === 'PENDING';

  return (
    <PatientAccessProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <ClinicianNavbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="flex-1 flex overflow-hidden">
          <ClinicianSidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {isPendingVerification && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Account Pending Medical Verification</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Your clinician registration (MH-MED-10293) is currently undergoing administrative verification.
                    Full access to patient records requires verified credentials.
                  </p>
                </div>
              </div>
            )}

            <Outlet />
          </main>
        </div>
      </div>
    </PatientAccessProvider>
  );
}
