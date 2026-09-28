import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBadge from './NotificationBadge';

const titleByPath = {
  '/patient': 'Dashboard',
  '/patient/profile': 'Profile',
  '/patient/history': 'Medical History',
  '/patient/prescriptions': 'Prescriptions',
  '/patient/qr': 'Generate QR',
  '/patient/access-history': 'Access History',
  '/patient/notifications': 'Notifications',
  '/clinician': 'Dashboard',
  '/clinician/scan': 'Scan Patient QR',
  '/clinician/recent-patients': 'Recent Patients',
  '/clinician/access-history': 'Access History',
  '/clinician/notifications': 'Notifications',
  '/clinician/profile': 'Profile',
  '/clinician/settings': 'Settings',
  '/admin': 'Public Health Dashboard',
};

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const isClinician = user?.role === 'clinician';

  const pageTitle =
    title ||
    titleByPath[location.pathname] ||
    (location.pathname.startsWith('/clinician/patient/')
      ? 'Patient Record'
      : isClinician
      ? 'Clinician Portal'
      : user?.role === 'admin'
      ? 'Administrative Portal'
      : 'Patient Portal');

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'P';
  const avatarBg = isClinician ? 'bg-cyan-700' : user?.role === 'admin' ? 'bg-violet-700' : 'bg-emerald-700';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-slate-500 p-1 -ml-1" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-slate-800">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBadge to={isClinician ? '/clinician/notifications' : '/patient/notifications'} />
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className={`w-8 h-8 rounded-full ${avatarBg} text-white flex items-center justify-center text-sm font-medium`}>
              {initial}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
