import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import * as api from '../../services/api';
import { formatDate } from '../../utils/format';
import Card from '../../components/Card';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getPrescriptions().then((rx) => { setPrescriptions(rx); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return prescriptions;
    return prescriptions.filter((rx) =>
      [rx.condition, rx.clinician, ...rx.medicines.map((m) => m.name)].join(' ').toLowerCase().includes(term)
    );
  }, [prescriptions, search]);

  if (loading) return <p className="text-slate-500">Loading prescriptions...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="Search prescriptions by medicine, condition, or clinician..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {prescriptions.length === 0 ? (
        <Card><p className="text-sm text-slate-500">No prescriptions found.</p></Card>
      ) : filtered.length === 0 ? (
        <Card><p className="text-sm text-slate-500">No records match your search. Try a different term.</p></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((rx) => (
            <Card key={rx.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400">{formatDate(rx.date)}</p>
                  <p className="font-medium text-slate-800">{rx.condition}</p>
                  <p className="text-sm text-slate-500">{rx.clinician}</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {rx.medicines.map((m, i) => (
                  <div key={i} className="py-2 grid grid-cols-2 sm:grid-cols-4 gap-1 text-sm">
                    <span className="font-medium text-slate-800">{m.name}</span>
                    <span className="text-slate-500">{m.dosage}</span>
                    <span className="text-slate-500">{m.frequency}</span>
                    <span className="text-slate-500">{m.duration}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
