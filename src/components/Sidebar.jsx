import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, FileClock, Pill, QrCode, ShieldCheck, LogOut, X,
  Users, History, Bell, Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePatientAccess } from '../context/PatientAccessContext';

const patientNav = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/profile', label: 'Profile', icon: User },
  { to: '/patient/history', label: 'Medical History', icon: FileClock },
  { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/patient/qr', label: 'Generate QR', icon: QrCode },
  { to: '/patient/access-history', label: 'Access History', icon: ShieldCheck },
];

const clinicianNav = [
  { to: '/clinician', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clinician/scan', label: 'Scan Patient QR', icon: QrCode },
  { to: '/clinician/recent-patients', label: 'Recent Patients', icon: Users },
  { to: '/clinician/access-history', label: 'Access History', icon: History },
  { to: '/clinician/notifications', label: 'Notifications', icon: Bell },
];

const clinicianSecondary = [
  { to: '/clinician/profile', label: 'Profile', icon: User },
  { to: '/clinician/settings', label: 'Settings', icon: Settings },
];

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
];

// Static class strings so Tailwind can detect every accent variant.
const accentClasses = {
  emerald: { active: 'bg-emerald-50 text-emerald-800' },
  cyan: { active: 'bg-cyan-50 text-cyan-800' },
  violet: { active: 'bg-violet-50 text-violet-800' },
};

const navByRole = {
  patient: { primary: patientNav, secondary: null, accent: 'emerald' },
  clinician: { primary: clinicianNav, secondary: clinicianSecondary, accent: 'cyan' },
  admin: { primary: adminNav, secondary: null, accent: 'violet' },
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { clearAccess } = usePatientAccess();
  const role = user?.role;
  const config = navByRole[role] || navByRole.patient;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? accentClasses[config.accent].active : 'text-slate-600 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    if (role === 'clinician') clearAccess('LOGOUT');
    logout();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-dvh bg-white border-r border-slate-200 flex flex-col shrink-0
          transform transition-transform duration-200 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <span className="font-semibold text-slate-800">HealthRecord</span>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 min-h-0 px-3 py-4 space-y-1 overflow-y-auto">
          {config.primary.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {config.secondary && (
            <>
              <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Account &amp; System
              </p>
              {config.secondary.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
