import { useState } from 'react';
import { changePassword } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-cyan-600' : 'bg-slate-300'}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-1 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

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
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>

      {/* Security Section */}
      <Card title="Change Password">
        {passwordStatus && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <AlertCircle size={16} className="text-red-600" />
            )}
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="clinician-current-password" className="block text-xs text-slate-400 mb-1">Current password</label>
            <input
              id="clinician-current-password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="clinician-new-password" className="block text-xs text-slate-400 mb-1">New password</label>
            <input
              id="clinician-new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" disabled={updatingPassword}>
            {updatingPassword ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </Card>

      {/* Notifications Toggles Section */}
      <Card title="Notification Preferences">
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Patient Record Updates</p>
              <p className="text-xs text-slate-500 mt-0.5">Receive alerts when consultation or prescriptions are added</p>
            </div>
            <Toggle checked={notifState.recordUpdates} onChange={(v) => setNotifState((s) => ({ ...s, recordUpdates: v }))} />
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Follow-up Reminders</p>
              <p className="text-xs text-slate-500 mt-0.5">Get notified when patient follow-ups are due</p>
            </div>
            <Toggle checked={notifState.followUpReminders} onChange={(v) => setNotifState((s) => ({ ...s, followUpReminders: v }))} />
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">System &amp; Security Notices</p>
              <p className="text-xs text-slate-500 mt-0.5">Medical verification and audit trail alerts</p>
            </div>
            <Toggle checked={notifState.systemNotifs} onChange={(v) => setNotifState((s) => ({ ...s, systemNotifs: v }))} />
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-800">Account Alerts</p>
              <p className="text-xs text-slate-500 mt-0.5">Verification status and account changes</p>
            </div>
            <Toggle checked={notifState.accountAlerts} onChange={(v) => setNotifState((s) => ({ ...s, accountAlerts: v }))} />
          </div>
        </div>
      </Card>
    </div>
  );
}
