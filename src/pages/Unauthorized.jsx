import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3 text-center px-4 bg-slate-50">
      <h1 className="text-2xl font-semibold text-slate-800">Access Denied</h1>
      <p className="text-slate-500 max-w-sm">You are not authorized to access this page.</p>
      <Link to="/patient"><Button variant="emerald">Return to Dashboard</Button></Link>
    </div>
  );
}
