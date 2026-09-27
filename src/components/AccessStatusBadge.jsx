import { usePatientAccess } from '../context/PatientAccessContext';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

export default function AccessStatusBadge({ patientId }) {
  const { authorizedSession, secondsRemaining, isAuthorizedForPatient } = usePatientAccess();

  const isAuthorized = isAuthorizedForPatient(patientId);

  if (!isAuthorized) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        isWarning
          ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
      }`}
    >
      <ShieldCheck className={`w-4 h-4 ${isWarning ? 'text-amber-600' : 'text-emerald-600'}`} />
      <span>🔒 Authorized Access</span>
      <span className="w-px h-3 bg-current opacity-30" />
      <div className="flex items-center gap-1 font-mono font-medium">
        <Clock className="w-3.5 h-3.5 opacity-70" />
        <span>{timeStr}</span>
      </div>
    </div>
  );
}
