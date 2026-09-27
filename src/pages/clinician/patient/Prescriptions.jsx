import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getPatientPrescriptions } from '../../../services/api';
import { Search, Pill, Calendar, Stethoscope, Plus, FileText } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine, condition, clinician, or RX ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Link
          to="../prescription/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Prescription
        </Link>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading prescription records...</div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No prescriptions found matching your search.
          </div>
        ) : (
          filteredPrescriptions.map((rx) => (
            <div key={rx.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rx.condition}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-600">
                        #{rx.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Prescribed by <strong className="text-slate-700">{rx.clinician}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rx.date}</span>
                </div>
              </div>

              {/* Medicine rows */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Prescribed Medications ({rx.medicines.length})
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{m.name}</span>
                        <span className="text-slate-500 text-[11px]">{m.instructions || 'Take as directed.'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700 text-xs">
                        <span className="px-2.5 py-1 bg-slate-100 font-semibold rounded-lg text-slate-800">{m.dosage}</span>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-semibold rounded-lg">{m.frequency}</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-lg">{m.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
