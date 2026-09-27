import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatientAccess } from '../context/PatientAccessContext';
import {
  LayoutDashboard,
  QrCode,
  Users,
  History,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function ClinicianSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { clearAccess } = usePatientAccess();
  const navigate = useNavigate();

  const navItems = [
    { to: '/clinician', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/clinician/scan', label: 'Scan Patient QR', icon: QrCode, highlight: true },
    { to: '/clinician/recent-patients', label: 'Recent Patients', icon: Users },
    { to: '/clinician/access-history', label: 'Access History', icon: History },
    { to: '/clinician/notifications', label: 'Notifications', icon: Bell },
  ];

  const secondaryItems = [
    { to: '/clinician/profile', label: 'Profile', icon: User },
    { to: '/clinician/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    clearAccess('LOGOUT');
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              PV
            </div>
            <span className="font-bold text-slate-100 text-sm tracking-wide">PulseVault MD</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security badge banner in sidebar */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-200">RBAC Guard Active</p>
            <p className="text-[10px] text-slate-400">QR token session required</p>
          </div>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Clinical Workspace
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : item.highlight
                          ? 'bg-blue-900/40 text-blue-200 hover:bg-blue-900/60 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Account & System
            </span>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
