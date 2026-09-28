import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerClinician } from '../../services/api';
import { Eye, EyeOff, Clock, ShieldCheck } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  registrationNumber: '',
  specialization: 'General Physician',
  organization: '',
  city: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(form.email)) errors.email = 'Invalid email format';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match';
  if (!form.registrationNumber.trim()) errors.registrationNumber = 'Medical registration number is required';
  if (!form.organization.trim()) errors.organization = 'Hospital or organization name is required';
  if (!form.city.trim()) errors.city = 'City / Region is required';
  return errors;
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

export default function ClinicianRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await registerClinician(form);
      setVerificationPending(res.clinician);
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  }

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Clock size={24} />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              <ShieldCheck size={13} /> Status: Pending Verification
            </span>
            <h2 className="text-lg font-semibold text-slate-900">Registration Submitted</h2>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
              Your clinician registration details have been received and submitted for credential verification.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-left border border-slate-200 text-sm space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-medium text-slate-800">{verificationPending.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">License Reg No:</span>
              <span className="font-medium text-slate-800">{verificationPending.registrationNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Specialization:</span>
              <span className="font-medium text-slate-800">{verificationPending.specialization}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Organization:</span>
              <span className="font-medium text-slate-800">{verificationPending.organization}</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-50 rounded-lg text-cyan-800 text-xs leading-relaxed border border-cyan-200 text-left">
            ℹ️ Access to patient medical records requires verified medical credentials per health privacy policies.
          </div>

          <Button variant="cyan" className="w-full" onClick={() => navigate('/login/clinician')}>
            Proceed to Clinician Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
          <Link to="/" className="hover:text-slate-600">HealthRecord</Link>
          {' · '}Clinician
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Clinician registration</h1>
        <p className="text-sm text-slate-500 mb-6">
          Register your medical practitioner account to securely access authorized patient records.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Full Name" required error={errors.fullName}>
            <input className={inputClass} placeholder="Dr. Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email Address" required error={errors.email}>
              <input type="email" className={inputClass} placeholder="doctor@hospital.org" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <input className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputClass} pr-10`}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" required error={errors.confirmPassword}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={inputClass}
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
              />
            </Field>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-3">Professional Credentials</p>
            <div className="space-y-4">
              <Field label="Medical License / Reg Number" required error={errors.registrationNumber}>
                <input className={inputClass} placeholder="e.g. MH-MED-10293" value={form.registrationNumber} onChange={(e) => update('registrationNumber', e.target.value)} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Specialization">
                  <select className={inputClass} value={form.specialization} onChange={(e) => update('specialization', e.target.value)}>
                    {['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Neurologist', 'Dentist', 'Other'].map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Hospital / Organization" required error={errors.organization}>
                  <input className={inputClass} placeholder="e.g. City Care Hospital" value={form.organization} onChange={(e) => update('organization', e.target.value)} />
                </Field>
              </div>

              <Field label="City / Region" required error={errors.city}>
                <input className={inputClass} placeholder="e.g. Pune, Maharashtra" value={form.city} onChange={(e) => update('city', e.target.value)} />
              </Field>
            </div>
          </div>

          {errors.form && <p className="text-sm text-red-600" role="alert">{errors.form}</p>}

          <Button type="submit" variant="cyan" className="w-full" disabled={submitting}>
            {submitting ? 'Submitting Registration...' : 'Submit for Verification'}
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already registered as a clinician? <Link to="/login/clinician" className="text-cyan-700 font-medium hover:underline">Sign In Here</Link>
        </p>
      </Card>
    </div>
  );
}
