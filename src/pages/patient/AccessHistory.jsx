import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import * as api from '../../services/api';
import { formatDate } from '../../utils/format';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';

export default function AccessHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccessHistory().then((h) => { setHistory(h); setLoading(false); });
  }, []);

  if (loading) return <p className="text-slate-500">Loading access history...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-slate-500">A record of every clinician who has accessed your medical record.</p>

      {history.length === 0 ? (
        <Card><p className="text-sm text-slate-500">No access events recorded yet.</p></Card>
      ) : (
        <div className="space-y-3">
          {history.map((h) => {
            const denied = h.status === 'Denied';
            return (
              <Card key={h.id}>
                <div className="flex items-start gap-3">
                  {denied
                    ? <ShieldAlert size={18} className="text-red-500 mt-0.5 shrink-0" />
                    : <ShieldCheck size={18} className="text-emerald-600 mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{h.clinician}</p>
                    {h.clinicianRole && <p className="text-xs text-slate-400">{h.clinicianRole}</p>}
                    <p className="text-sm text-slate-600 mt-1">{h.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(h.date)} · {h.time}</p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
