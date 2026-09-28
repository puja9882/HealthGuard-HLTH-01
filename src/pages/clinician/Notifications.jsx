import { useState, useEffect } from 'react';
import {
  getClinicianNotifications,
  markClinicianNotificationRead,
  markAllClinicianNotificationsRead,
} from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { formatDate } from '../../utils/format';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const data = await getClinicianNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    const updated = await markClinicianNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await markAllClinicianNotificationsRead();
    setNotifications(updated);
  };

  const filteredNotifs = filterUnreadOnly ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>Mark all as read</Button>
        )}
      </div>

      {/* Control Bar */}
      <Card className="py-3">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filterUnreadOnly}
            onChange={(e) => setFilterUnreadOnly(e.target.checked)}
            className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 w-4 h-4"
          />
          <span>Show unread notifications only</span>
        </label>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading notifications...</p>
        ) : filteredNotifs.length === 0 ? (
          <Card className="text-center py-10">
            <Bell size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">You're all caught up.</p>
            <p className="text-sm text-slate-400">No new notifications.</p>
          </Card>
        ) : (
          filteredNotifs.map((n) => {
            const Icon = n.type === 'success' ? CheckCircle2 : n.type === 'warning' ? AlertTriangle : Info;
            return (
              <Card
                key={n.id}
                className={!n.read ? 'border-cyan-200 bg-cyan-50/40' : ''}
              >
                <div className="flex items-start gap-3">
                  <Icon size={18} className={n.read ? 'text-slate-400' : 'text-cyan-700'} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>{n.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(n.timestamp)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} className="text-xs text-cyan-700 hover:underline">
                        Mark as read
                      </button>
                    )}
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" aria-hidden="true" />}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
