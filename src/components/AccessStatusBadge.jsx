import { usePatientAccess } from '../context/PatientAccessContext';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

export default function AccessStatusBadge({ patientId }) {
  const { authorizedSession, secondsRemaining, isAuthorizedForPatient } = usePatientAccess();

  const isAuthorized = isAuthorizedForPatient(patientId);

  if (!isAuthorized) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle size={13} className="text-red-600" />
        <span>Unauthorized Access</span>
      </div>
    );
  }

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isWarning = secondsRemaining <= 60;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
        isWarning
          ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}
    >
      <ShieldCheck size={13} className={isWarning ? 'text-amber-600' : 'text-emerald-600'} />
      <span>Authorized Access</span>
      <span className="w-px h-3 bg-current opacity-30" />
      <div className="flex items-center gap-1 font-mono">
        <Clock size={12} className="opacity-70" />
        <span>{timeStr}</span>
      </div>
    </div>
  );
}
