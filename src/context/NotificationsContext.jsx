import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    api.getNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function markRead(id) {
    const updated = await api.markNotificationRead(id);
    setNotifications(updated);
  }

  async function markAllRead() {
    const updated = await api.markAllNotificationsRead();
    setNotifications(updated);
  }

  async function remove(id) {
    const updated = await api.deleteNotification(id);
    setNotifications(updated);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, loading, unreadCount, markRead, markAllRead, remove }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
