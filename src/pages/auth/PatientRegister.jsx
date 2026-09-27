import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const initialForm = {
  fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  dateOfBirth: '', gender: '', bloodGroup: '', region: '',
  emergencyContactName: '', emergencyContactRelationship: '', emergencyContactPhone: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(form.email)) errors.email = 'Invalid email format';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!form.gender) errors.gender = 'Gender is required';
  if (!form.bloodGroup) errors.bloodGroup = 'Blood group is required';
  if (!form.region.trim()) errors.region = 'Region is required';
  if (!form.emergencyContactName.trim()) errors.emergencyContactName = 'Emergency contact name is required';
  if (!form.emergencyContactPhone.trim()) errors.emergencyContactPhone = 'Emergency contact phone is required';
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

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600';

export default function PatientRegister() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        region: form.region,
        emergencyContact: {
          name: form.emergencyContactName,
          relationship: form.emergencyContactRelationship,
          phone: form.emergencyContactPhone,
        },
      });
      showToast('Registration successful — please log in');
      navigate('/login/patient');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">Register to access your health records</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Full Name" required error={errors.fullName}>
            <input className={inputClass} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" required error={errors.email}>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
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

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Date of Birth" required error={errors.dateOfBirth}>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
            </Field>
            <Field label="Gender" required error={errors.gender}>
              <select className={inputClass} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Blood Group" required error={errors.bloodGroup}>
              <select className={inputClass} value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg}>{bg}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Region" required error={errors.region}>
            <input className={inputClass} placeholder="City, State" value={form.region} onChange={(e) => update('region', e.target.value)} />
          </Field>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-3">Emergency Contact</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Name" required error={errors.emergencyContactName}>
                <input className={inputClass} value={form.emergencyContactName} onChange={(e) => update('emergencyContactName', e.target.value)} />
              </Field>
              <Field label="Relationship" error={errors.emergencyContactRelationship}>
                <input className={inputClass} value={form.emergencyContactRelationship} onChange={(e) => update('emergencyContactRelationship', e.target.value)} />
              </Field>
              <Field label="Phone" required error={errors.emergencyContactPhone}>
                <input className={inputClass} value={form.emergencyContactPhone} onChange={(e) => update('emergencyContactPhone', e.target.value)} />
              </Field>
            </div>
          </div>

          {errors.form && <p className="text-sm text-red-600" role="alert">{errors.form}</p>}

          <Button type="submit" variant="emerald" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already have an account? <Link to="/login/patient" className="text-emerald-700 font-medium hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
