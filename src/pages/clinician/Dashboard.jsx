import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePatientAccess } from '../../context/PatientAccessContext';
import { getClinicianAccessHistory } from '../../services/api';
import {
  QrCode,
  Users,
  FilePlus,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { authorizedSession } = usePatientAccess();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await getClinicianAccessHistory();
        setActivities(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActivity();
  }, []);

  const stats = [
    { title: "Today's Consultations", value: '12', change: '+2 from yesterday', icon: Stethoscope, color: 'blue' },
    { title: 'Patients Accessed', value: '86', change: 'This month', icon: Users, color: 'emerald' },
    { title: 'Records Updated', value: '9', change: 'Last 7 days', icon: FilePlus, color: 'indigo' },
    { title: 'Pending Follow-ups', value: '5', change: 'Action required', icon: Clock, color: 'amber' },
  ];

  const handleNewConsultation = () => {
    if (authorizedSession?.patientId) {
      navigate(`/clinician/patient/${authorizedSession.patientId}/consultation`);
    } else {
      navigate('/clinician/scan?notice=consultation');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10">
          <Activity className="w-64 h-64 text-blue-400" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Clinical Workspace</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-300">Live Practice Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good Morning, {user?.name || 'Dr. Rahul Mehta'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Specialization: <span className="text-white font-medium">{user?.specialization || 'General Physician'}</span> • {user?.organization || 'City Care Clinic'}
            </p>
          </div>

          <Link
            to="/clinician/scan"
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Patient QR</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Quick Clinical Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Scan Patient QR */}
          <Link
            to="/clinician/scan"
            className="group bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all space-y-4 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                Scan Patient QR <ArrowRight className="w-4 h-4 text-blue-200" />
              </h3>
              <p className="text-blue-100 text-xs leading-relaxed">
                Scan a patient's temporary QR code to securely access their medical record.
              </p>
            </div>
          </Link>

          {/* Action 2: Recent Patients */}
          <Link
            to="/clinician/recent-patients"
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                Recent Patients <ArrowRight className="w-4 h-4 text-slate-400" />
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                View interaction history and request patient record access.
              </p>
            </div>
          </Link>

          {/* Action 3: New Consultation */}
          <button
            onClick={handleNewConsultation}
            className="group text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FilePlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                New Consultation <ArrowRight className="w-4 h-4 text-slate-400" />
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {authorizedSession?.patient
                  ? `Create record for ${authorizedSession.patient.name}`
                  : 'Requires active QR authorization before starting.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Active Session Indicator Card (If authorized) */}
      {authorizedSession?.patient && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Active Patient Session</span>
              <h4 className="font-bold text-slate-900 text-sm">
                {authorizedSession.patient.name} ({authorizedSession.patient.id})
              </h4>
              <p className="text-xs text-emerald-700">Access authorized via temporary QR scan.</p>
            </div>
          </div>
          <Link
            to={`/clinician/patient/${authorizedSession.patient.id}`}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            Open Patient Record →
          </Link>
        </div>
      )}

      {/* Dashboard Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Access & Consultations Activity</h3>
            <p className="text-slate-500 text-xs">Audited actions logged during your session</p>
          </div>
          <Link to="/clinician/access-history" className="text-xs font-semibold text-blue-600 hover:underline">
            View All Audit Logs
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading activity feed...</div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No recent activity recorded yet.</div>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{act.action}</p>
                    <p className="text-[11px] text-slate-500">
                      Patient: <span className="font-medium text-slate-700">{act.patientName}</span> ({act.patientId})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      act.status === 'Authorized'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : act.status === 'Expired'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {act.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
