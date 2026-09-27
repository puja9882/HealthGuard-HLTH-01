import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FileClock, Pill, QrCode, ChevronRight } from 'lucide-react';
import * as api from '../../services/api';
import { formatCountdown } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [qr, setQr] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getVisits(), api.getPrescriptions(), api.getQRStatus()]).then(
      ([p, v, rx, qrStatus]) => {
        setPatient(p);
        setVisits(v);
        setPrescriptions(rx);
        setQr(qrStatus);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    const newQr = await api.generateQR();
    setQr(newQr);
    setGenerating(false);
  }

  if (loading) return <p className="text-slate-500">Loading your dashboard...</p>;

  const qrActive = qr && qr.status === 'active' && new Date(qr.expiresAt) > new Date(now);
  const qrRemaining = qrActive ? new Date(qr.expiresAt).getTime() - now : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{greeting()}, {patient.name.split(' ')[0]}</h2>
        <p className="text-sm text-slate-500 mt-0.5">Share temporary access with your clinician, or open your records below.</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <QrCode size={18} className="text-emerald-700" />
              <h3 className="text-base font-semibold text-slate-900">QR Access</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Show this code to your clinician for temporary, authorized access to your record.
            </p>

            {qrActive ? (
              <div className="space-y-3">
                <StatusBadge status="Active" />
                <p className="text-sm text-slate-600">
                  Expires in <span className="font-mono font-medium">{formatCountdown(qrRemaining)}</span>
                </p>
                <Link to="/patient/qr" className="inline-flex items-center text-sm text-emerald-700 hover:underline">
                  Manage QR <ChevronRight size={14} className="ml-0.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <StatusBadge status={qr?.status === 'revoked' ? 'Revoked' : qr?.status === 'expired' ? 'Expired' : 'Inactive'} />
                <p className="text-sm text-slate-500">No active QR code. Generate one when you are with your clinician.</p>
                <Button variant="emerald" onClick={handleGenerate} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate QR'}
                </Button>
              </div>
            )}
          </div>

          <div className="shrink-0 self-center sm:self-start">
            {qrActive ? (
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <QRCodeSVG value={qr.token} size={168} />
              </div>
            ) : (
              <div className="w-[168px] h-[168px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                <QrCode size={40} className="text-slate-300" />
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/patient/history" className="group">
          <Card className="h-full transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileClock size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Medical History</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {visits.length === 0 ? 'No visits yet' : `${visits.length} visit${visits.length === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-700" />
            </div>
          </Card>
        </Link>

        <Link to="/patient/prescriptions" className="group">
          <Card className="h-full transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Pill size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Prescriptions</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {prescriptions.length === 0 ? 'No prescriptions yet' : `${prescriptions.length} prescription${prescriptions.length === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-700" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
