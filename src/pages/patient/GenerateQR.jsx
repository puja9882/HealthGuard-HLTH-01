import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';
import * as api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCountdown } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

export default function GenerateQR() {
  const { showToast } = useToast();
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const syncedExpiry = useRef(false);

  useEffect(() => {
    api.getQRStatus().then((status) => { setQr(status); setLoading(false); });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = qr ? new Date(qr.expiresAt).getTime() - now : 0;
  const isActive = qr?.status === 'active' && remainingMs > 0;
  const displayStatus = qr?.status === 'active' && remainingMs <= 0 ? 'expired' : qr?.status;

  // Sync the "expired" flip back to the mock store once, so other pages
  // (e.g. Dashboard) that re-fetch status see it consistently.
  useEffect(() => {
    if (qr?.status === 'active' && remainingMs <= 0 && !syncedExpiry.current) {
      syncedExpiry.current = true;
      api.getQRStatus().then(setQr);
    }
    if (isActive) syncedExpiry.current = false;
  }, [remainingMs, qr, isActive]);

  async function handleGenerate() {
    setBusy(true);
    const newQr = await api.generateQR();
    setQr(newQr);
    setBusy(false);
    showToast('QR generated successfully');
  }

  async function handleRevoke() {
    setBusy(true);
    const revoked = await api.revokeQR();
    setQr(revoked);
    setBusy(false);
    setConfirmRevoke(false);
    showToast('QR revoked');
  }

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="max-w-md space-y-4">
      <Card>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Secure Record Access</h2>
        <p className="text-sm text-slate-500 mb-4">
          Generate a temporary QR code to allow an authenticated clinician to access your authorized medical record.
        </p>

        {!qr || displayStatus === 'revoked' || displayStatus === 'expired' ? (
          <div className="text-center py-6">
            {qr && (
              <div className="mb-4">
                <StatusBadge status={displayStatus === 'expired' ? 'Expired' : 'Revoked'} />
                <p className="text-sm text-slate-500 mt-2">
                  {displayStatus === 'expired'
                    ? 'Your QR code has expired. Generate a new temporary QR to share access with your clinician.'
                    : 'This QR code was revoked and can no longer be used.'}
                </p>
              </div>
            )}
            <Button variant="emerald" onClick={handleGenerate} disabled={busy}>
              {busy ? 'Generating...' : qr ? 'Generate New QR' : 'Generate QR'}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center bg-white p-4 rounded-lg border border-slate-200">
              <QRCodeSVG value={qr.token} size={200} />
            </div>
            <StatusBadge status="Active" />
            <p className="text-sm text-slate-600">Expires in <span className="font-mono font-medium">{formatCountdown(remainingMs)}</span></p>
            <p className="text-xs text-slate-400">Generated at {new Date(qr.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            <div className="flex justify-center gap-2 pt-1">
              <Button variant="outline" onClick={handleGenerate} disabled={busy}>Regenerate</Button>
              <Button variant="danger" onClick={() => setConfirmRevoke(true)} disabled={busy}>Revoke QR</Button>
            </div>
            <p className="text-xs text-slate-400 pt-2">
              This QR code expires automatically. Do not share it with anyone other than your authorized healthcare provider.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex gap-3">
          <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-800">Secure Access</p>
            <p className="text-sm text-slate-500 mt-1">
              Your QR code does not contain your medical records. It contains a temporary access token.
              Your records are only returned after the system verifies the clinician's identity, role and authorization.
            </p>
          </div>
        </div>
      </Card>

      <Modal
        open={confirmRevoke}
        onClose={() => setConfirmRevoke(false)}
        title="Revoke QR?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmRevoke(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRevoke} disabled={busy}>Revoke</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Anyone using this QR will no longer be able to use it to request access.
        </p>
      </Modal>
    </div>
  );
}
