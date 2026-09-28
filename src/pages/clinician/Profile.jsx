import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClinicianProfile, updateClinicianProfile } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Pencil, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

function Field({ label, value, children }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {children || <p className="text-sm text-slate-800">{value || '—'}</p>}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    organization: '',
    region: '',
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getClinicianProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          organization: data.organization || '',
          region: data.region || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const updated = await updateClinicianProfile(formData);
      setProfile(updated);
      setStatusMsg({ type: 'success', text: 'Profile changes saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading profile...</p>;

  const isVerified = profile?.verificationStatus !== 'PENDING';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Profile</h2>
      </div>

      {/* Identity Card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-700 text-white font-medium text-base flex items-center justify-center shrink-0">
            {profile?.name ? profile.name.replace('Dr. ', '').substring(0, 2).toUpperCase() : 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-slate-900">{profile?.name}</h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5 ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <ShieldCheck size={13} /> {profile?.verificationStatus === 'PENDING' ? 'Pending Verification' : 'Verified'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {profile?.specialization} · {profile?.organization}
            </p>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Reg No: {profile?.registrationNumber}</p>
          </div>
        </div>
      </Card>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-lg text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-600" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Editable Form */}
      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Personal &amp; Contact Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input className={inputClass} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </Field>
            <Field label="Hospital / Organization">
              <input className={inputClass} value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
            </Field>
            <Field label="City / Region">
              <input className={inputClass} value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" variant="cyan" disabled={saving}>
              <Pencil size={15} className="inline mr-1.5 -mt-0.5" />{saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Protected Non-Editable Professional Information */}
      <Card title="Medical Board License Credentials">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
            <Lock size={12} /> Admin Protected
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="Medical Registration Number" value={profile?.registrationNumber} />
          <Field label="Specialization" value={profile?.specialization} />
          <Field label="Verification Status" value={profile?.verificationStatus} />
          <Field label="Account Created" value={profile?.createdAt || '2025-01-15'} />
        </div>
      </Card>

      {/* Hidden context reference so user prop stays part of the contract */}
      <span className="sr-only">{user?.id}</span>
    </div>
  );
}
