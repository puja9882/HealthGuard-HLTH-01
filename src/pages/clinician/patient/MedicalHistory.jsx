import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPatientHistory } from '../../../services/api';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';
import StatusBadge from '../../../components/StatusBadge';
import { Search, Stethoscope, Calendar, ChevronRight } from 'lucide-react';

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

  const filtersActive = searchTerm || dateFilter !== 'All' || categoryFilter !== 'All' || visitTypeFilter !== 'All' || prescriptionFilter !== 'All';
  const inputClass = 'border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

  return (
    <div className="space-y-4">
      {/* Search & Filter Control Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search diagnosis, symptoms, clinician, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          {filtersActive && (
            <button onClick={clearFilters} className="text-sm text-cyan-700 hover:underline self-center">
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Time Period</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={`w-full ${inputClass}`}>
              <option value="All">All Time</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last year">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`w-full ${inputClass}`}>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Visit Type</label>
            <select value={visitTypeFilter} onChange={(e) => setVisitTypeFilter(e.target.value)} className={`w-full ${inputClass}`}>
              <option value="All">All Types</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
              <option value="Routine Checkup">Routine Checkup</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Prescription</label>
            <select value={prescriptionFilter} onChange={(e) => setPrescriptionFilter(e.target.value)} className={`w-full ${inputClass}`}>
              <option value="All">All</option>
              <option value="With Prescription">With Prescription</option>
              <option value="Without Prescription">Without Prescription</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Longitudinal Timeline View */}
      <div className="space-y-3">
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading longitudinal medical history...</p>
        ) : filteredHistory.length === 0 ? (
          <Card><p className="text-sm text-slate-500 text-center py-2">No visit history records match the current search or filters.</p></Card>
        ) : (
          filteredHistory.map((visit) => (
            <Card
              key={visit.id}
              className="cursor-pointer hover:border-slate-300 transition-colors space-y-3"
            >
              <div onClick={() => setSelectedVisit(visit)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {visit.category}
                    </span>
                    <StatusBadge status={visit.visitType} />
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{visit.date} ({visit.time})</span>
                  </div>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <h4 className="text-base font-semibold text-slate-900">{visit.diagnosis}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-700 text-xs block mb-0.5">Symptoms</span>
                      <p className="text-slate-600 text-xs leading-snug">{visit.symptoms}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-700 text-xs block mb-0.5">Treatment</span>
                      <p className="text-slate-600 text-xs leading-snug">{visit.treatment}</p>
                    </div>
                  </div>

                  {visit.followUp && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <strong>Follow-up instructions:</strong> {visit.followUp}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Stethoscope size={14} className="text-slate-400" />
                    <span>Attending: <strong className="text-slate-700">{visit.clinician}</strong> ({visit.specialization})</span>
                  </div>

                  <span className="text-cyan-700 font-medium flex items-center gap-0.5">
                    View Full Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Visit Detail Modal */}
      <Modal open={!!selectedVisit} onClose={() => setSelectedVisit(null)} title={selectedVisit?.diagnosis}>
        {selectedVisit && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Visit Information</p>
              <p className="text-slate-700">Date: {selectedVisit.date} ({selectedVisit.time})</p>
              <p className="text-slate-700">Attending Clinician: {selectedVisit.clinician}</p>
              <p className="text-slate-700">Category: {selectedVisit.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Clinical Information</p>
              <p className="text-slate-700">Symptoms: {selectedVisit.symptoms}</p>
              <p className="text-slate-700 mt-1">Clinical notes: {selectedVisit.diagnosisNotes || 'No additional clinical notes recorded.'}</p>
              <p className="text-slate-700 mt-1">Treatment: {selectedVisit.treatment}</p>
              {selectedVisit.followUp && <p className="text-slate-700 mt-1">Follow-up: {selectedVisit.followUp}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
