import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerClinician } from '../../services/api';
import { Activity, ShieldCheck, CheckCircle2, Clock, ArrowRight, Eye, EyeOff, Building2, UserCheck, Stethoscope } from 'lucide-react';

export default function ClinicianRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    specialization: 'General Physician',
    organization: '',
    city: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(null);

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
    'Neurologist',
    'Dentist',
    'Other',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (formData.confirmPassword !== formData.password) errs.confirmPassword = 'Passwords do not match.';

    if (!formData.registrationNumber.trim()) errs.registrationNumber = 'Medical registration number is required.';
    if (!formData.organization.trim()) errs.organization = 'Hospital or organization name is required.';
    if (!formData.city.trim()) errs.city = 'City / Region is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await registerClinician(formData);
      setVerificationPending(res.clinician);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
              Status: Pending Verification
            </span>
            <h2 className="text-xl font-bold text-slate-900">Registration Submitted</h2>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              Your clinician registration details have been received and submitted for credential verification.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-semibold text-slate-800">{verificationPending.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">License Reg No:</span>
              <span className="font-semibold text-slate-800">{verificationPending.registrationNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Specialization:</span>
              <span className="font-semibold text-slate-800">{verificationPending.specialization}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Organization:</span>
              <span className="font-semibold text-slate-800">{verificationPending.organization}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl text-blue-800 text-[11px] leading-relaxed border border-blue-200 text-left">
            ℹ️ Access to patient medical records requires verified medical credentials per health privacy policies.
          </div>

          <button
            onClick={() => navigate('/login/clinician')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
          >
            Proceed to Clinician Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
            <Stethoscope className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400">
              <Activity className="w-4 h-4" /> PulseVault Medical
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Clinician Registration</h1>
            <p className="text-slate-400 text-xs">
              Register your medical practitioner account to securely access authorized patient records.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errors.server && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errors.server}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" /> Personal Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Dr. Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="doctor@hospital.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-600 text-[11px] mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.confirmPassword && <p className="text-rose-600 text-[11px] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Professional Information Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" /> Professional Credentials
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medical License / Reg Number</label>
              <input
                type="text"
                placeholder="e.g. MH-MED-10293"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.registrationNumber && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.registrationNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. City Care Hospital"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.organization && <p className="text-rose-600 text-[11px] mt-1">{errors.organization}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.city && <p className="text-rose-600 text-[11px] mt-1">{errors.city}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'Submitting Registration...' : 'Submit for Verification'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs text-slate-500">Already registered as a clinician? </span>
            <Link to="/login/clinician" className="text-xs font-semibold text-blue-600 hover:underline">
              Sign In Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
