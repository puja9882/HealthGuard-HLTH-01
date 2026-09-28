import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAccess } from '../../context/PatientAccessContext';
import { verifyQRCode } from '../../services/api';
import QRScanner from '../../components/QRScanner';
import Button from '../../components/Button';
import Card from '../../components/Card';
import {
  ShieldCheck,
  Clock,
  ShieldX,
  AlertTriangle,
  XCircle,
  QrCode,
  Lock,
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Notice Banner if redirected from New Consultation attempt */}
      {noticeParam === 'consultation' && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">QR Authorization Required</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              To start a new consultation, you must first scan the patient's temporary QR code to verify session permission.
            </p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto">
          <QrCode size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Scan Patient QR Code</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Ask the patient to open their mobile web app and display their temporary QR code to grant clinician access.
        </p>
      </div>

      {/* Verification Results Cards */}
      {verificationState === 'VERIFYING' && (
        <Card>
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Verifying Session Token</h3>
              <p className="text-slate-500 text-sm mt-1">Authenticating clinician role &amp; validating token integrity...</p>
            </div>
          </div>
        </Card>
      )}

      {verificationState === 'VALID' && (
        <Card className="border-2 border-emerald-300">
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <ShieldCheck size={28} />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
                Access Granted
              </span>
              <h2 className="text-lg font-semibold text-slate-900 mt-2">Patient QR Verified</h2>
              <p className="text-emerald-800 text-sm mt-1">
                Authorized access established for <span className="font-semibold">{verifiedPatient?.name}</span> ({verifiedPatient?.id}).
              </p>
            </div>
            <p className="text-xs text-slate-500 animate-pulse">Opening patient medical record...</p>
          </div>
        </Card>
      )}

      {verificationState === 'EXPIRED' && (
        <Card className="border-2 border-amber-300">
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Clock size={26} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">QR Code Expired</h2>
              <p className="text-amber-800 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                This QR code has exceeded its 5-minute validity window. Ask the patient to generate a fresh QR code from their portal.
              </p>
            </div>
            <Button variant="outline" onClick={handleResetScanner}>Scan Again</Button>
          </div>
        </Card>
      )}

      {verificationState === 'REVOKED' && (
        <Card className="border-2 border-amber-300">
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <ShieldX size={26} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">QR Code Revoked</h2>
              <p className="text-amber-800 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                The patient has manually revoked access for this code. Ask the patient to generate a new QR code to proceed.
              </p>
            </div>
            <Button variant="outline" onClick={handleResetScanner}>Scan Again</Button>
          </div>
        </Card>
      )}

      {verificationState === 'INVALID' && (
        <Card className="border-2 border-red-200">
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <XCircle size={26} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Invalid QR Code</h2>
              <p className="text-red-800 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                {resultMessage || 'This QR code could not be verified by the security token authority.'}
              </p>
            </div>
            <Button variant="outline" onClick={handleResetScanner}>Try Again</Button>
          </div>
        </Card>
      )}

      {verificationState === 'UNAUTHORIZED' && (
        <Card className="border-2 border-red-200 bg-red-50/40">
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <Lock size={26} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Access Denied</h2>
              <p className="text-red-800 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                You are not authorized to access this patient record. This event has been logged in the security audit trail.
              </p>
            </div>
            <Button variant="outline" onClick={handleResetScanner}>Return to Scanner</Button>
          </div>
        </Card>
      )}

      {/* Camera Scanner Component (When IDLE) */}
      {verificationState === 'IDLE' && (
        <QRScanner onScanSuccess={handleScanSuccess} onError={(err) => setResultMessage(err)} />
      )}

      {/* Security Architecture Information Card */}
      <Card>
        <div className="flex gap-3">
          <QrCode size={20} className="text-cyan-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-800">Secure Patient Access Model</p>
            <p className="text-sm text-slate-500 mt-1">
              Patient records are protected using authenticated clinician access and temporary QR authorization tokens.
              <strong className="text-slate-700"> QR codes do not contain raw medical records</strong> — they transmit single-use session tokens validated against backend role-based access rules.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
