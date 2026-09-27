import { useState } from 'react';
import { changePassword } from '../../services/api';
import { Settings as SettingsIcon, Key, Bell, Sun, Moon, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notification toggles
  const [notifState, setNotifState] = useState({
    recordUpdates: true,
    followUpReminders: true,
    systemNotifs: true,
    accountAlerts: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setPasswordStatus(null);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordStatus({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" /> Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage security, notifications, and portal preferences</p>
      </div>

      {/* Security Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Key className="w-4 h-4 text-blue-600" /> Security & Password
        </h2>

        {passwordStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
          >
            {updatingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Notifications Toggles Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-blue-600" /> Notification Preferences
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">Patient Record Updates</span>
              <span className="text-slate-500 text-[11px]">Receive alerts when consultation or prescriptions are added</span>
            </div>
            <input
              type="checkbox"
              checked={notifState.recordUpdates}
              onChange={(e) => setNotifState({ ...notifState, recordUpdates: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">Follow-up Reminders</span>
              <span className="text-slate-500 text-[11px]">Get notified when patient follow-ups are due</span>
            </div>
            <input
              type="checkbox"
              checked={notifState.followUpReminders}
              onChange={(e) => setNotifState({ ...notifState, followUpReminders: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-semibold text-slate-900 block">System & Security Notices</span>
              <span className="text-slate-500 text-[11px]">Medical verification and audit trail alerts</span>
            </div>
            <input
              type="checkbox"
              checked={notifState.systemNotifs}
              onChange={(e) => setNotifState({ ...notifState, systemNotifs: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sun className="w-4 h-4 text-blue-600" /> Interface Appearance
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-900 block">Dark Mode</span>
            <span className="text-slate-500 text-[11px]">Switch between light and dark clinical theme</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-semibold"
          >
            {darkMode ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
