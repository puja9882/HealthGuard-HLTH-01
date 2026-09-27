import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBadge from './NotificationBadge';

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'P';

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-500 p-1 -ml-1" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBadge />
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-medium">
            {initial}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
