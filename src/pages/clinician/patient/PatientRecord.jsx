import { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { usePatientAccess } from '../../../context/PatientAccessContext';
import { getAuthorizedPatient } from '../../../services/api';
import AccessStatusBadge from '../../../components/AccessStatusBadge';
import {
  User,
  Calendar,
  Activity,
  FileText,
  Pill,
  FilePlus,
  Lock,
  QrCode,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export default function PatientRecord() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { isAuthorizedForPatient, authorizedSession } = usePatientAccess();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthorized = isAuthorizedForPatient(patientId);

  useEffect(() => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }

    async function fetchPatientData() {
      try {
        setLoading(true);
        const data = await getAuthorizedPatient(patientId);
        setPatient(data);
      } catch (err) {
        setError(err.message || 'Failed to load patient record.');
      } finally {
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [patientId, isAuthorized]);

  // Security Wall: If not authorized via QR code, do NOT render medical data!
  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 max-w-lg mx-auto my-12 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider">
            RBAC Access Blocked
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Patient QR Authorization Required</h2>
          <p className="text-slate-600 text-xs mt-2 leading-relaxed">
            Clinicians cannot access a patient's medical records directly by URL, ID, or search.
            You must scan the patient's active temporary QR code to establish session permission.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Healthcare Privacy Protocol:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
            <li>QR codes provide temporary, single-use session access keys.</li>
            <li>No raw medical data is stored on patient QR codes.</li>
            <li>Every access request is audited by the security log.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/clinician/scan"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> Scan Patient QR
          </Link>
          <button
            onClick={() => navigate('/clinician')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-medium">Authenticating & loading authorized patient record...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center space-y-3">
        <p className="text-xs font-bold text-rose-800">{error || 'Unable to load patient record.'}</p>
        <button
          onClick={() => navigate('/clinician/scan')}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg"
        >
          Re-scan QR
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <div>
        <Link
          to="/clinician"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Clinician Workspace
        </Link>
      </div>

      {/* Patient Header Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {patient.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 font-mono">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {patient.gender} • {patient.age} years • Blood Group:{' '}
                <span className="font-bold text-rose-600">{patient.bloodGroup}</span> • Region: {patient.region}
              </p>
            </div>
          </div>

          {/* Security Authorization Countdown Badge */}
          <div>
            <AccessStatusBadge patientId={patient.id} />
          </div>
        </div>

        {/* Clinical Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Visits</span>
            <span className="text-lg font-bold text-slate-900">8</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Known Conditions</span>
            <span className="text-lg font-bold text-slate-900">{patient.conditions?.length || 3}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Prescriptions</span>
            <span className="text-lg font-bold text-slate-900">11</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Last Visit</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">{patient.lastVisit}</span>
          </div>
        </div>

        {/* Patient Sub-navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <User className="w-4 h-4" /> Overview
          </NavLink>
          <NavLink
            to="history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <FileText className="w-4 h-4" /> Medical History
          </NavLink>
          <NavLink
            to="prescriptions"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Pill className="w-4 h-4" /> Prescriptions
          </NavLink>
          <NavLink
            to="consultation"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
              }`
            }
          >
            <FilePlus className="w-4 h-4" /> New Consultation
          </NavLink>
          <NavLink
            to="prescription/new"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`
            }
          >
            <Pill className="w-4 h-4" /> Add Prescription
          </NavLink>
        </div>
      </div>

      {/* Render Active Sub-tab View */}
      <Outlet context={{ patient }} />
    </div>
  );
}
