import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecentPatients } from '../../services/api';
import { usePatientAccess } from '../../context/PatientAccessContext';
import { Users, QrCode, Lock, ShieldCheck, ArrowRight, Search } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Recent Patients Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Patients you have recently consulted or reviewed
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Security Info Card */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">RBAC Access Protection Notice</h4>
          <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
            Clicking a recent patient will NOT bypass session security. If your temporary session has expired,
            you will be prompted to scan the patient's temporary QR code before records are rendered.
          </p>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-xs">Loading recent patients directory...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No patient records matched your search.
          </div>
        ) : (
          filteredPatients.map((p) => {
            const hasActiveSession = isAuthorizedForPatient(p.id);
            return (
              <div
                key={p.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                        <span className="font-mono text-[11px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 rounded-md">
                          {p.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {p.gender} • {p.age} yrs • Blood Group: <strong className="text-rose-600">{p.bloodGroup}</strong>
                      </p>
                    </div>
                  </div>

                  {hasActiveSession ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Session
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-full border border-slate-200">
                      QR Required
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Last Visit:</span>
                    <strong className="text-slate-800">{p.lastVisit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Action:</span>
                    <span className="text-blue-700 font-medium">{p.lastAction || 'Consultation'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAccessRequest(p.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    hasActiveSession
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                  }`}
                >
                  {hasActiveSession ? (
                    <>Open Patient Record <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>Scan QR to Access Record <QrCode className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
