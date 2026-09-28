import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecentPatients } from '../../services/api';
import { usePatientAccess } from '../../context/PatientAccessContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Users, QrCode, Lock, ShieldCheck, Search, FileClock } from 'lucide-react';

export default function RecentPatients() {
  const navigate = useNavigate();
  const { isAuthorizedForPatient } = usePatientAccess();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getRecentPatients();
        setPatients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term) || p.region.toLowerCase().includes(term);
  });

  const handleAccessRequest = (patientId) => {
    // If clinician currently holds active session for this patient, open record directly
    if (isAuthorizedForPatient(patientId)) {
      navigate(`/clinician/patient/${patientId}`);
    } else {
      // Otherwise, enforce QR scan requirement per Security Rule #4!
      navigate('/clinician/scan');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-cyan-700" /> Recent Patients
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Patients you have recently consulted or reviewed
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
        <Lock size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">RBAC Access Protection Notice</h4>
          <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
            Clicking a recent patient will NOT bypass session security. If your temporary session has expired,
            you will be prompted to scan the patient's temporary QR code before records are rendered.
          </p>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-sm">Loading recent patients directory...</div>
        ) : filteredPatients.length === 0 ? (
          <Card className="col-span-full"><p className="text-sm text-slate-500 text-center py-4">No patient records matched your search.</p></Card>
        ) : (
          filteredPatients.map((p) => {
            const hasActiveSession = isAuthorizedForPatient(p.id);
            return (
              <Card key={p.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-800 font-medium text-sm flex items-center justify-center shrink-0">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800 text-sm truncate">{p.name}</h3>
                        <span className="font-mono text-[11px] text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded">
                          {p.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.gender} • {p.age} yrs • Blood Group: <strong className="text-rose-600">{p.bloodGroup}</strong>
                      </p>
                    </div>
                  </div>

                  {hasActiveSession ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                      <ShieldCheck size={13} /> Active Session
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                      QR Required
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><FileClock size={13} className="text-slate-400" />Last Visit:</span>
                    <span className="font-medium text-slate-800">{p.lastVisit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recent Action:</span>
                    <span className="text-cyan-700 font-medium">{p.lastAction || 'Consultation'}</span>
                  </div>
                </div>

                <Button
                  variant={hasActiveSession ? 'primary' : 'cyan'}
                  onClick={() => handleAccessRequest(p.id)}
                  className="w-full"
                >
                  {hasActiveSession ? (
                    <>Open Patient Record</>
                  ) : (
                    <><QrCode size={15} className="inline mr-1.5 -mt-0.5" />Scan QR to Access Record</>
                  )}
                </Button>
              </Card>
            );
          })
        )}
      </div>

      {/* Hidden helper link kept for keyboard users (matches old sidebar escape hatch) */}
      <Link to="/clinician/scan" className="sr-only">Scan Patient QR</Link>
    </div>
  );
}
