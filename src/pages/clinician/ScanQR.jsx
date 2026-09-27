import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAccess } from '../../context/PatientAccessContext';
import { verifyQRCode } from '../../services/api';
import QRScanner from '../../components/QRScanner';
import {
  ShieldCheck,
  Clock,
  ShieldX,
  AlertTriangle,
  XCircle,
  QrCode,
  ArrowRight,
  RefreshCw,
  Lock,
  Info,
} from 'lucide-react';

export default function ScanQR() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noticeParam = searchParams.get('notice');

  const { grantAccess } = usePatientAccess();

  const [verificationState, setVerificationState] = useState('IDLE'); // IDLE | VERIFYING | VALID | EXPIRED | REVOKED | INVALID | UNAUTHORIZED
  const [resultMessage, setResultMessage] = useState('');
  const [verifiedPatient, setVerifiedPatient] = useState(null);

  const handleScanSuccess = async (tokenString) => {
    setVerificationState('VERIFYING');
    setResultMessage('');

    try {
      const res = await verifyQRCode(tokenString);

      if (res.status === 'VALID') {
        setVerificationState('VALID');
        setVerifiedPatient(res.patient);
        grantAccess(res.patient, res.token);

        // Auto redirect after short success feedback
        setTimeout(() => {
          navigate(`/clinician/patient/${res.patient.id}`);
        }, 1200);
      } else {
        setVerificationState(res.status);
        setResultMessage(res.message || 'QR Verification Failed');
      }
    } catch (err) {
      setVerificationState('INVALID');
      setResultMessage(err.message || 'Error processing QR code verification.');
    }
  };

  const handleResetScanner = () => {
    setVerificationState('IDLE');
    setResultMessage('');
    setVerifiedPatient(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Notice Banner if redirected from New Consultation attempt */}
      {noticeParam === 'consultation' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">QR Authorization Required</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              To start a new consultation, you must first scan the patient's temporary QR code to verify session permission.
            </p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Scan Patient QR Code</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Ask the patient to open their mobile web app and display their temporary QR code to grant clinician access.
        </p>
      </div>

      {/* Verification Results Cards */}
      {verificationState === 'VERIFYING' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">Verifying Session Token</h3>
            <p className="text-slate-500 text-xs mt-1">Authenticating clinician role & validating token integrity...</p>
          </div>
        </div>
      )}

      {verificationState === 'VALID' && (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-8 rounded-2xl text-center space-y-4 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <span className="px-3 py-1 bg-emerald-200 text-emerald-900 text-xs font-bold rounded-full uppercase tracking-wider">
              Access Granted
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Patient QR Verified</h2>
            <p className="text-emerald-800 text-xs mt-1">
              Authorized access established for <span className="font-bold text-slate-900">{verifiedPatient?.name}</span> ({verifiedPatient?.id}).
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium animate-pulse">Opening patient medical record...</p>
        </div>
      )}

      {verificationState === 'EXPIRED' && (
        <div className="bg-amber-50 border-2 border-amber-300 p-8 rounded-2xl text-center space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-300">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">QR Code Expired</h2>
            <p className="text-amber-800 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              This QR code has exceeded its 5-minute validity window. Ask the patient to generate a fresh QR code from their portal.
            </p>
          </div>
          <button
            onClick={handleResetScanner}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Scan Again
          </button>
        </div>
      )}

      {verificationState === 'REVOKED' && (
        <div className="bg-purple-50 border-2 border-purple-300 p-8 rounded-2xl text-center space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto border border-purple-300">
            <ShieldX className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">QR Code Revoked</h2>
            <p className="text-purple-800 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              The patient has manually revoked access for this code. Ask the patient to generate a new QR code to proceed.
            </p>
          </div>
          <button
            onClick={handleResetScanner}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Scan Again
          </button>
        </div>
      )}

      {verificationState === 'INVALID' && (
        <div className="bg-rose-50 border-2 border-rose-300 p-8 rounded-2xl text-center space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
            <XCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Invalid QR Code</h2>
            <p className="text-rose-800 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              {resultMessage || 'This QR code could not be verified by the security token authority.'}
            </p>
          </div>
          <button
            onClick={handleResetScanner}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      )}

      {verificationState === 'UNAUTHORIZED' && (
        <div className="bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-slate-300 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              You are not authorized to access this patient record. This event has been logged in the security audit trail.
            </p>
          </div>
          <button
            onClick={handleResetScanner}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Return to Scanner
          </button>
        </div>
      )}

      {/* Camera Scanner Component (When IDLE) */}
      {verificationState === 'IDLE' && (
        <QRScanner onScanSuccess={handleScanSuccess} onError={(err) => setResultMessage(err)} />
      )}

      {/* Security Architecture Information Card */}
      <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Secure Patient Access Model</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          Patient records are protected using authenticated clinician access and temporary QR authorization tokens.
          <strong className="text-slate-800"> QR codes do not contain raw medical records</strong> — they transmit single-use session tokens validated against backend role-based access rules.
        </p>
      </div>
    </div>
  );
}
