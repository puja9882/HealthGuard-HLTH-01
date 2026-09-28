import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, Key, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ShieldX } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export default function QRScanner({ onScanSuccess, onError }) {
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrcodeInstance = useRef(null);

  useEffect(() => {
    return () => {
      stopScannerSilently();
    };
  }, []);

  const stopScannerSilently = async () => {
    if (html5QrcodeInstance.current && html5QrcodeInstance.current.isScanning) {
      try {
        await html5QrcodeInstance.current.stop();
        html5QrcodeInstance.current.clear();
      } catch (e) {
        // Ignore stop errors on unmount
      }
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    setScanning(true);
    try {
      if (!html5QrcodeInstance.current) {
        html5QrcodeInstance.current = new Html5Qrcode('qr-reader-container');
      }
      await html5QrcodeInstance.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScannerSilently();
          setScanning(false);
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Frame decode noise; safe to ignore
        }
      );
    } catch (err) {
      setScanning(false);
      setCameraError(err?.message || 'Failed to access camera. Please check browser permissions.');
    }
  };

  const stopScanner = async () => {
    await stopScannerSilently();
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onScanSuccess(manualToken.trim());
  };

  const handleQuickDemoToken = (tokenValue) => {
    onScanSuccess(tokenValue);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Viewport (kept dark intentionally — it's a camera surface) */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-sm min-h-[320px] flex flex-col items-center justify-center p-4">
        <div id="qr-reader-container" className="w-full max-w-sm rounded-xl overflow-hidden" />

        {!scanning && !cameraError && (
          <div className="text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-600 text-cyan-300 flex items-center justify-center mx-auto">
              <Camera size={26} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Device Camera Access</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                Position the patient's temporary QR code inside the camera frame to verify session authorization.
              </p>
            </div>
            <Button variant="cyan" onClick={startScanner}>
              <Camera size={15} className="inline mr-1.5 -mt-0.5" />Start Camera Scanner
            </Button>
          </div>
        )}

        {scanning && (
          <div className="mt-4 text-center">
            <button
              onClick={stopScanner}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              <CameraOff size={14} />
              Stop Camera
            </button>
          </div>
        )}

        {cameraError && (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert size={22} />
            </div>
            <p className="text-amber-300 text-sm max-w-xs mx-auto">{cameraError}</p>
            <button
              onClick={startScanner}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              Retry Camera
            </button>
          </div>
        )}
      </div>

      {/* Manual Input Fallback */}
      <Card>
        <div className="flex items-center gap-2 text-slate-800 font-medium text-sm mb-3">
          <Key size={16} className="text-slate-500" />
          <span>Manual Token Entry (Development &amp; Fallback)</span>
        </div>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Paste temporary QR token (e.g. temporary-secure-token-...)"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <Button type="submit" variant="cyan" disabled={!manualToken.trim()}>
            Verify Token
          </Button>
        </form>
      </Card>

      {/* Hackathon Demo Quick Test Simulator */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Demo Simulator — Test Security Response States
          </span>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            1-Click Demo
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleQuickDemoToken('DEMO_VALID_PT10482')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200 transition-colors text-left"
          >
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Valid QR</span>
          </button>
          <button
            onClick={() => handleQuickDemoToken('DEMO_EXPIRED')}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium rounded-lg border border-amber-200 transition-colors text-left"
          >
            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
            <span>Expired QR</span>
          </button>
          <button
            onClick={() => handleQuickDemoToken('DEMO_REVOKED')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors text-left"
          >
            <ShieldX size={14} className="text-slate-600 shrink-0" />
            <span>Revoked QR</span>
          </button>
          <button
            onClick={() => handleQuickDemoToken('DEMO_UNAUTHORIZED')}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-medium rounded-lg border border-red-200 transition-colors text-left"
          >
            <XCircle size={14} className="text-red-600 shrink-0" />
            <span>Access Denied</span>
          </button>
        </div>
      </div>
    </div>
  );
}
