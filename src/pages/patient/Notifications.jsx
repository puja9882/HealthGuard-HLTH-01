import { Bell, UserCheck, Pill, QrCode, FileText, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { timeAgo } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';

const iconByType = { access: UserCheck, prescription: Pill, qr: QrCode, record: FileText };

export default function Notifications() {
  const { notifications, loading, unreadCount, markRead, markAllRead, remove } = useNotifications();

  if (loading) return <p className="text-slate-500">Loading notifications...</p>;

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>Mark all as read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-10">
          <Bell size={28} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-700">You're all caught up.</p>
          <p className="text-sm text-slate-400">No new notifications.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconByType[n.type] || Bell;
            return (
              <Card key={n.id} className={!n.read ? 'border-emerald-200 bg-emerald-50/40' : ''}>
                <div className="flex items-start gap-3">
                  <Icon size={18} className={n.read ? 'text-slate-400' : 'text-emerald-700'} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>{n.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-xs text-emerald-700 hover:underline">Mark as read</button>
                    )}
                    <button onClick={() => remove(n.id)} className="text-slate-300 hover:text-slate-500" aria-label="Delete notification">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
