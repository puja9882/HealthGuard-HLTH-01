import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPatientHistory } from '../../../services/api';
import { Search, Filter, Calendar, Stethoscope, FileText, Pill, X, ChevronRight, Check } from 'lucide-react';

export default function MedicalHistory() {
  const { patient } = useOutletContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visitTypeFilter, setVisitTypeFilter] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState('All');

  // Selected visit modal
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getPatientHistory(patient.id);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [patient.id]);

  const categoryOptions = [
    'All',
    'Infectious Disease',
    'Chronic Disease',
    'Respiratory',
    'Cardiovascular',
    'Neurological',
    'Dermatological',
    'Other',
  ];

  const filteredHistory = history.filter((visit) => {
    // Search query matching
    const searchMatch =
      !searchTerm.trim() ||
      [visit.diagnosis, visit.category, visit.symptoms, visit.clinician, visit.diagnosisNotes, visit.treatment]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Category matching
    const categoryMatch = categoryFilter === 'All' || visit.category === categoryFilter;

    // Visit type matching
    const typeMatch = visitTypeFilter === 'All' || visit.visitType === visitTypeFilter;

    // Prescription matching
    const prescriptionMatch =
      prescriptionFilter === 'All' ||
      (prescriptionFilter === 'With Prescription' && visit.hasPrescription) ||
      (prescriptionFilter === 'Without Prescription' && !visit.hasPrescription);

    // Date range matching
    let dateMatch = true;
    if (dateFilter !== 'All') {
      const visitDate = new Date(visit.date);
      const now = new Date();
      if (dateFilter === 'Last 30 days') {
        dateMatch = now - visitDate <= 30 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 6 months') {
        dateMatch = now - visitDate <= 180 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last year') {
        dateMatch = now - visitDate <= 365 * 24 * 60 * 60 * 1000;
      }
    }

    return searchMatch && categoryMatch && typeMatch && prescriptionMatch && dateMatch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('All');
    setCategoryFilter('All');
    setVisitTypeFilter('All');
    setPrescriptionFilter('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Filter Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search diagnosis, symptoms, clinician, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Time Period</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All Time</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last year">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Visit Type</label>
            <select
              value={visitTypeFilter}
              onChange={(e) => setVisitTypeFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All Types</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
              <option value="Routine Checkup">Routine Checkup</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Prescription</label>
            <select
              value={prescriptionFilter}
              onChange={(e) => setPrescriptionFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All</option>
              <option value="With Prescription">With Prescription</option>
              <option value="Without Prescription">Without Prescription</option>
            </select>
          </div>
        </div>
      </div>

      {/* Longitudinal Timeline View */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading longitudinal medical history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No visit history records match the current search or filters.
          </div>
        ) : (
          filteredHistory.map((visit) => (
            <div
              key={visit.id}
              onClick={() => setSelectedVisit(visit)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {visit.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {visit.visitType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{visit.date} ({visit.time})</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="text-base font-bold text-slate-900">{visit.diagnosis}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Symptoms</span>
                    <p className="text-slate-600 leading-snug">{visit.symptoms}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Treatment</span>
                    <p className="text-slate-600 leading-snug">{visit.treatment}</p>
                  </div>
                </div>

                {visit.followUp && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <strong>Follow-up instructions:</strong> {visit.followUp}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attending: <strong>{visit.clinician}</strong> ({visit.specialization})</span>
                </div>

                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  View Full Details <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visit Detail Modal (Section 21) */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                  {selectedVisit.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedVisit.diagnosis}</h3>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Visit Date & Time:</span>
                  <span className="font-semibold text-slate-900">{selectedVisit.date} ({selectedVisit.time})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Attending Clinician:</span>
                  <span className="font-semibold text-slate-900">{selectedVisit.clinician}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Symptoms Reported</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedVisit.symptoms}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Clinical Notes & Observations</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedVisit.diagnosisNotes || 'No additional clinical notes recorded.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Treatment Plan</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedVisit.treatment}
                </p>
              </div>

              {selectedVisit.followUp && (
                <div>
                  <h4 className="font-bold text-amber-800 mb-1">Follow-up Instructions</h4>
                  <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                    {selectedVisit.followUp}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedVisit(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl"
              >
                Close Visit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
