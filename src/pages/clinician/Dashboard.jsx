import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePatientAccess } from '../../context/PatientAccessContext';
import { getClinicianAccessHistory } from '../../services/api';
import { formatCountdown } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {
  QrCode,
  Users,
  FilePlus,
  Activity,
  ShieldCheck,
  Stethoscope,
  Clock,
  ChevronRight,
} from 'lucide-react';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { authorizedSession, secondsRemaining } = usePatientAccess();
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
    { title: "Today's Consultations", value: '12', change: '+2 from yesterday', icon: Stethoscope },
    { title: 'Patients Accessed', value: '86', change: 'This month', icon: Users },
    { title: 'Records Updated', value: '9', change: 'Last 7 days', icon: FilePlus },
    { title: 'Pending Follow-ups', value: '5', change: 'Action required', icon: Clock },
  ];

  const handleNewConsultation = () => {
    if (authorizedSession?.patientId) {
      navigate(`/clinician/patient/${authorizedSession.patientId}/consultation`);
    } else {
      navigate('/clinician/scan?notice=consultation');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{greeting()}, {user?.name || 'Doctor'}</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {user?.specialization || 'General Physician'} · {user?.organization || 'City Care Clinic'} — scan a patient QR to begin.
        </p>
      </div>

      {/* Primary action: Scan Patient QR */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Scan Patient QR</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Scan the patient's temporary QR code to request temporary, authorized access to their record.
              </p>
            </div>
          </div>
          <Link to="/clinician/scan" className="shrink-0">
            <Button variant="cyan">
              <QrCode size={15} className="inline mr-1.5 -mt-0.5" />Open Scanner
            </Button>
          </Link>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/clinician/scan" className="group">
          <Card className="h-full transition-colors group-hover:border-cyan-200 group-hover:bg-cyan-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <QrCode size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Scan Patient QR</p>
                  <p className="text-xs text-slate-500 mt-0.5">Verify a patient's temporary access token.</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-700" />
            </div>
          </Card>
        </Link>

        <Link to="/clinician/recent-patients" className="group">
          <Card className="h-full transition-colors group-hover:border-cyan-200 group-hover:bg-cyan-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Recent Patients</p>
                  <p className="text-xs text-slate-500 mt-0.5">View interaction history and request record access.</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-700" />
            </div>
          </Card>
        </Link>

        <Card className="h-full">
          <button onClick={handleNewConsultation} className="group w-full text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <FilePlus size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-cyan-800">New Consultation</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {authorizedSession?.patient
                      ? `Create record for ${authorizedSession.patient.name}`
                      : 'Requires active QR authorization first.'}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-700" />
            </div>
          </button>
        </Card>
      </div>

      {/* Active Session Indicator (If authorized) */}
      {authorizedSession?.patient && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {authorizedSession.patient.name} ({authorizedSession.patient.id})
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Active session · expires in <span className="font-mono font-medium">{formatCountdown(secondsRemaining * 1000)}</span>
                </p>
              </div>
            </div>
            <Link to={`/clinician/patient/${authorizedSession.patient.id}`}>
              <Button variant="emerald">Open Patient Record</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Recent Access &amp; Consultations</h3>
            <p className="text-sm text-slate-500">Audited actions logged during your session</p>
          </div>
          <Link to="/clinician/access-history" className="text-sm text-cyan-700 hover:underline">
            View All
          </Link>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading activity feed...</p>
          ) : activities.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No recent activity recorded yet.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Activity size={16} className="text-cyan-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{act.action}</p>
                    <p className="text-xs text-slate-500">
                      Patient: <span className="font-medium text-slate-700">{act.patientName}</span> ({act.patientId})
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                      act.status === 'Authorized'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : act.status === 'Expired'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {act.status}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
