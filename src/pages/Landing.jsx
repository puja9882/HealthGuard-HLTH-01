import { Link } from 'react-router-dom';
import { UserRound, Stethoscope, Shield } from 'lucide-react';

const portals = [
  {
    role: 'Patient',
    description: 'View your records, prescriptions, and share temporary QR access with your clinician.',
    to: '/login/patient',
    registerTo: '/register',
    icon: UserRound,
    accent: 'emerald',
    classes: {
      border: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-100 text-emerald-800',
      button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      ring: 'focus-visible:ring-emerald-600',
    },
  },
  {
    role: 'Clinician',
    description: 'Access authorized patient records after scanning a temporary QR code.',
    to: '/login/clinician',
    registerTo: '/register/clinician',
    icon: Stethoscope,
    accent: 'cyan',
    classes: {
      border: 'border-cyan-200 hover:border-cyan-400',
      iconBg: 'bg-cyan-100 text-cyan-800',
      button: 'bg-cyan-700 hover:bg-cyan-800 text-white',
      ring: 'focus-visible:ring-cyan-600',
    },
  },
  {
    role: 'Admin',
    description: 'Manage users, roles, and system-wide health record settings.',
    to: '/login/admin',
    icon: Shield,
    accent: 'violet',
    classes: {
      border: 'border-violet-200 hover:border-violet-400',
      iconBg: 'bg-violet-100 text-violet-800',
      button: 'bg-violet-700 hover:bg-violet-800 text-white',
      ring: 'focus-visible:ring-violet-600',
    },
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-5">
        <span className="text-lg font-semibold tracking-tight text-slate-900">HealthRecord</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <p className="text-sm font-medium text-slate-500 mb-2">Choose how you sign in</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 text-center max-w-lg">
          Three portals. One secure health system.
        </h1>

        <div className="grid sm:grid-cols-3 gap-5 mt-12 w-full max-w-4xl">
          {portals.map(({ role, description, to, registerTo, icon: Icon, classes }) => (
            <div
              key={role}
              className={`bg-white rounded-2xl border-2 p-6 flex flex-col transition-colors ${classes.border}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${classes.iconBg}`}>
                <Icon size={24} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{role}</h2>
              <p className="text-sm text-slate-500 mt-2 flex-1 leading-relaxed">{description}</p>
              <Link
                to={to}
                className={`mt-6 inline-flex items-center justify-center w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${classes.button} ${classes.ring}`}
              >
                Log in as {role}
              </Link>
              {registerTo && (
                <Link to={registerTo} className="mt-3 text-center text-sm text-slate-500 hover:text-slate-700">
                  New patient? Register
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
