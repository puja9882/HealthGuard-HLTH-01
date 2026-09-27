import { useState, useEffect } from 'react';
import {
  getClinicianNotifications,
  markClinicianNotificationRead,
  markAllClinicianNotificationsRead,
} from '../../services/api';
import { Bell, CheckCheck, Trash2, Clock, CheckCircle2, AlertTriangle, Info, Shield } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" /> Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System notices, consultation alerts, and follow-up reminders
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-all cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filterUnreadOnly}
            onChange={(e) => setFilterUnreadOnly(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <span>Show unread notifications only</span>
        </label>
        <span className="text-slate-400 font-mono">{filteredNotifs.length} items</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No notifications to display</p>
            <p className="text-slate-400 text-xs">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'success'
                    ? 'bg-emerald-100 text-emerald-700'
                    : n.type === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {n.type !== 'success' && n.type !== 'warning' && <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{n.message}</p>
              </div>

              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
