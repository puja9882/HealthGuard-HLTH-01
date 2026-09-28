import { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { usePatientAccess } from '../../../context/PatientAccessContext';
import { getAuthorizedPatient } from '../../../services/api';
import AccessStatusBadge from '../../../components/AccessStatusBadge';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import {
  User,
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
  const { isAuthorizedForPatient } = usePatientAccess();

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
      <Card className="max-w-lg mx-auto my-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
          <Lock size={26} />
        </div>

        <div>
          <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-200">
            RBAC Access Blocked
          </span>
          <h2 className="text-lg font-semibold text-slate-900 mt-2">Patient QR Authorization Required</h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Clinicians cannot access a patient's medical records directly by URL, ID, or search.
            You must scan the patient's active temporary QR code to establish session permission.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left text-sm space-y-1.5 text-slate-600">
          <p className="font-medium text-slate-800 flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-amber-600" /> Healthcare Privacy Protocol:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>QR codes provide temporary, single-use session access keys.</li>
            <li>No raw medical data is stored on patient QR codes.</li>
            <li>Every access request is audited by the security log.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link to="/clinician/scan" className="w-full">
            <Button variant="cyan" className="w-full">
              <QrCode size={15} className="inline mr-1.5 -mt-0.5" />Scan Patient QR
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={() => navigate('/clinician')}>
            Return to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Authenticating &amp; loading authorized patient record...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card className="text-center space-y-3 border-red-200">
        <p className="text-sm text-red-700 font-medium">{error || 'Unable to load patient record.'}</p>
        <Button variant="outline" onClick={() => navigate('/clinician/scan')}>Re-scan QR</Button>
      </Card>
    );
  }

  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div>
        <Link
          to="/clinician"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
      </div>

      {/* Patient Header Container */}
      <Card className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-cyan-700 text-white font-medium text-base flex items-center justify-center shrink-0">
              {patient.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-semibold text-slate-900">{patient.name}</h1>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 font-mono">
                  {patient.id}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {patient.gender} • {patient.age} years • Blood Group:{' '}
                <span className="font-medium text-rose-600">{patient.bloodGroup}</span> • Region: {patient.region}
              </p>
            </div>
          </div>

          {/* Security Authorization Countdown Badge */}
          <div>
            <AccessStatusBadge patientId={patient.id} />
          </div>
        </div>

        {/* Clinical Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Total Visits</span>
            <span className="text-base font-semibold text-slate-900">8</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Known Conditions</span>
            <span className="text-base font-semibold text-slate-900">{patient.conditions?.length || 3}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Prescriptions</span>
            <span className="text-base font-semibold text-slate-900">11</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Last Visit</span>
            <span className="text-sm font-semibold text-slate-900 block mt-0.5">{patient.lastVisit}</span>
          </div>
        </div>

        {/* Patient Sub-navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4">
          <NavLink to="" end className={tabClass}>
            <User size={15} /> Overview
          </NavLink>
          <NavLink to="history" className={tabClass}>
            <FileText size={15} /> Medical History
          </NavLink>
          <NavLink to="prescriptions" className={tabClass}>
            <Pill size={15} /> Prescriptions
          </NavLink>
          <NavLink
            to="consultation"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-cyan-700 text-white' : 'text-cyan-800 bg-cyan-50 hover:bg-cyan-100'
              }`
            }
          >
            <FilePlus size={15} /> New Consultation
          </NavLink>
          <NavLink
            to="prescription/new"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-emerald-700 text-white' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`
            }
          >
            <Pill size={15} /> Add Prescription
          </NavLink>
        </div>
      </Card>

      {/* Render Active Sub-tab View */}
      <Outlet context={{ patient }} />
    </div>
  );
}
