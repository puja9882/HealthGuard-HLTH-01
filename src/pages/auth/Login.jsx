import { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const roleConfig = {
  patient: {
    title: 'Patient login',
    subtitle: 'Access your health records',
    accent: 'emerald',
    ring: 'focus:ring-emerald-600',
    button: 'emerald',
    canRegister: true,
    registerLink: '/register',
    enabled: true,
  },
  clinician: {
    title: 'Clinician login',
    subtitle: 'Access authorized patient records',
    accent: 'cyan',
    ring: 'focus:ring-blue-600',
    button: 'primary',
    canRegister: true,
    registerLink: '/register/clinician',
    enabled: true,
  },
  admin: {
    title: 'Admin login',
    subtitle: 'Manage the health record system',
    accent: 'violet',
    ring: 'focus:ring-violet-600',
    button: 'primary',
    canRegister: false,
    enabled: false,
  },
};

export default function Login() {
  const { role: roleParam } = useParams();
  const role = roleParam || 'patient';
  const config = roleConfig[role];

  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!config) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!config.enabled) return;
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password, role);
      if (role === 'clinician') {
        navigate('/clinician');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
          <Link to="/" className="hover:text-slate-600">HealthRecord</Link>
          {' · '}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">{config.title}</h1>
        <p className="text-sm text-slate-500 mb-6">{config.subtitle}</p>

        {!config.enabled ? (
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-5 text-center">
            <p className="text-sm font-medium text-slate-800">Coming soon</p>
            <p className="text-sm text-slate-500 mt-1">The {role} portal is not available yet.</p>
            <Link to="/" className="inline-block mt-4 text-sm text-emerald-700 font-medium hover:underline">
              Back to portals
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${config.ring}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'clinician' ? 'rahul.mehta@citycare.org' : 'rahul.sharma@example.com'}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 ${config.ring}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 font-medium" role="alert">{error}</p>}

              <Button type="submit" variant={config.button} className="w-full cursor-pointer" disabled={loading}>
                {loading ? 'Signing in...' : 'Log in'}
              </Button>
            </form>

            {config.canRegister && (
              <p className="text-sm text-slate-500 mt-5 text-center">
                Don't have an account?{' '}
                <Link to={config.registerLink || '/register'} className="text-blue-600 font-medium hover:underline">
                  Register
                </Link>
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
