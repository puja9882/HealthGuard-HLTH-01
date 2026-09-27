import { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import * as api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { calculateAge } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600';

function Field({ label, value, editing, children }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {editing ? children : <p className="text-sm text-slate-800">{value || '—'}</p>}
    </div>
  );
}

export default function Profile() {
  const { showToast } = useToast();
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    api.getProfile().then((p) => { setPatient(p); setForm(p); });
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateEmergencyField(field, value) {
    setForm((f) => ({ ...f, emergencyContact: { ...f.emergencyContact, [field]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    const updated = await api.updateProfile(form);
    setPatient(updated);
    setForm(updated);
    setEditing(false);
    setSaving(false);
    showToast('Profile updated');
  }

  function handleCancel() {
    setForm(patient);
    setEditing(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed');
    } catch (err) {
      setPasswordError(err.message || 'Could not change password');
    } finally {
      setChangingPassword(false);
    }
  }

  if (!patient) return <p className="text-slate-500">Loading profile...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Profile</h2>
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil size={15} className="inline mr-1.5 -mt-0.5" />Edit Profile
          </Button>
        )}
      </div>

      <Card title="Personal Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={patient.name} editing={editing}>
            <input className={inputClass} value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </Field>
          <Field label="Date of Birth" value={`${patient.dateOfBirth} (${calculateAge(patient.dateOfBirth)} yrs)`} editing={editing}>
            <input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
          </Field>
          <Field label="Gender" value={patient.gender} editing={editing}>
            <select className={inputClass} value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Blood Group" value={patient.bloodGroup} editing={editing}>
            <select className={inputClass} value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg}>{bg}</option>)}
            </select>
          </Field>
          <Field label="Phone" value={patient.phone} editing={editing}>
            <input className={inputClass} value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </Field>
          <Field label="Email" value={patient.email} editing={editing}>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Location">
        <Field label="Region" value={patient.region} editing={editing}>
          <input className={inputClass} value={form.region} onChange={(e) => updateField('region', e.target.value)} />
        </Field>
      </Card>

      <Card title="Emergency Contact">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name" value={patient.emergencyContact.name} editing={editing}>
            <input className={inputClass} value={form.emergencyContact.name} onChange={(e) => updateEmergencyField('name', e.target.value)} />
          </Field>
          <Field label="Relationship" value={patient.emergencyContact.relationship} editing={editing}>
            <input className={inputClass} value={form.emergencyContact.relationship} onChange={(e) => updateEmergencyField('relationship', e.target.value)} />
          </Field>
          <Field label="Phone" value={patient.emergencyContact.phone} editing={editing}>
            <input className={inputClass} value={form.emergencyContact.phone} onChange={(e) => updateEmergencyField('phone', e.target.value)} />
          </Field>
        </div>
      </Card>

      {editing && (
        <div className="flex gap-2">
          <Button variant="emerald" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
        </div>
      )}

      <Card title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="current-password" className="block text-xs text-slate-400 mb-1">Current password</label>
            <div className="relative">
              <input
                id="current-password"
                type={showPasswords ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
              >
                {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-xs text-slate-400 mb-1">New password</label>
            <input
              id="new-password"
              type={showPasswords ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs text-slate-400 mb-1">Confirm new password</label>
            <input
              id="confirm-password"
              type={showPasswords ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {passwordError && <p className="text-sm text-red-600" role="alert">{passwordError}</p>}
          <Button type="submit" variant="outline" disabled={changingPassword}>
            {changingPassword ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
