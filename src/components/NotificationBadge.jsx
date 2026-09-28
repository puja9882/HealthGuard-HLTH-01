import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';

export default function NotificationBadge({ to = '/patient/notifications' }) {
  const { unreadCount } = useNotifications();

  return (
    <Link to={to} className="relative p-2 rounded-full hover:bg-slate-100" aria-label={`Notifications, ${unreadCount} unread`}>
      <Bell size={20} className="text-slate-600" />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[10px] leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
