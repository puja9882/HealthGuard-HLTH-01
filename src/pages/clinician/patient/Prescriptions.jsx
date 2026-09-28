import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getPatientPrescriptions } from '../../../services/api';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Search, Pill, Calendar, Plus } from 'lucide-react';

export default function Prescriptions() {
  const { patient } = useOutletContext();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const data = await getPatientPrescriptions(patient.id);
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, [patient.id]);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const medicinesStr = rx.medicines.map((m) => `${m.name} ${m.dosage}`).join(' ');
    return (
      rx.condition.toLowerCase().includes(term) ||
      rx.clinician.toLowerCase().includes(term) ||
      rx.id.toLowerCase().includes(term) ||
      medicinesStr.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine, condition, clinician, or RX ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <Link to="../prescription/new">
          <Button variant="emerald">
            <Plus size={15} className="inline mr-1.5 -mt-0.5" />Add New Prescription
          </Button>
        </Link>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-3">
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading prescription records...</p>
        ) : filteredPrescriptions.length === 0 ? (
          <Card><p className="text-sm text-slate-500 text-center py-2">No prescriptions found matching your search.</p></Card>
        ) : (
          filteredPrescriptions.map((rx) => (
            <Card key={rx.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Pill size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 text-sm">{rx.condition}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-slate-600">
                        #{rx.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prescribed by <strong className="text-slate-700">{rx.clinician}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 shrink-0">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{rx.date}</span>
                </div>
              </div>

              {/* Medicine rows */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                  Prescribed Medications ({rx.medicines.length})
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} className="p-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-medium text-slate-800 block">{m.name}</span>
                        <span className="text-slate-500 text-xs">{m.instructions || 'Take as directed.'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs shrink-0">
                        <span className="px-2 py-0.5 bg-slate-100 font-medium rounded-full text-slate-700">{m.dosage}</span>
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-800 font-medium rounded-full border border-cyan-200">{m.frequency}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-medium rounded-full border border-emerald-200">{m.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
