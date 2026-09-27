import { useEffect, useMemo, useState } from 'react';
import { Search, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import { formatDate } from '../../utils/format';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const dateOptions = ['All time', 'This year', 'Last 6 months'];

function withinDateFilter(dateStr, filter) {
  if (filter === 'All time') return true;
  const date = new Date(dateStr);
  const now = new Date();
  if (filter === 'This year') return date.getFullYear() === now.getFullYear();
  if (filter === 'Last 6 months') {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return date >= sixMonthsAgo;
  }
  return true;
}

export default function MedicalHistory() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All time');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [clinicianFilter, setClinicianFilter] = useState('All');
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    api.getVisits().then((v) => { setVisits(v); setLoading(false); });
  }, []);

  const conditions = useMemo(() => ['All', ...new Set(visits.map((v) => v.condition))], [visits]);
  const clinicians = useMemo(() => ['All', ...new Set(visits.map((v) => v.clinician))], [visits]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return visits.filter((v) => {
      const matchesSearch = !term || [v.condition, v.clinician, v.symptoms, v.diagnosisNotes]
        .join(' ').toLowerCase().includes(term);
      const matchesDate = withinDateFilter(v.date, dateFilter);
      const matchesCondition = conditionFilter === 'All' || v.condition === conditionFilter;
      const matchesClinician = clinicianFilter === 'All' || v.clinician === clinicianFilter;
      return matchesSearch && matchesDate && matchesCondition && matchesClinician;
    });
  }, [visits, search, dateFilter, conditionFilter, clinicianFilter]);

  function clearFilters() {
    setSearch(''); setDateFilter('All time'); setConditionFilter('All'); setClinicianFilter('All');
  }

  const filtersActive = search || dateFilter !== 'All time' || conditionFilter !== 'All' || clinicianFilter !== 'All';

  if (loading) return <p className="text-slate-500">Loading medical records...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="Search medical records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          {dateOptions.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
          {conditions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm" value={clinicianFilter} onChange={(e) => setClinicianFilter(e.target.value)}>
          {clinicians.map((c) => <option key={c}>{c}</option>)}
        </select>
        {filtersActive && (
          <button onClick={clearFilters} className="text-sm text-emerald-700 hover:underline">Clear Filters</button>
        )}
        <span className="text-sm text-slate-400 ml-auto">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {visits.length === 0 ? (
        <Card><p className="text-sm text-slate-500">No medical records found. Your medical history will appear here after your first recorded consultation.</p></Card>
      ) : filtered.length === 0 ? (
        <Card><p className="text-sm text-slate-500">No records match your search. Try changing your search or filters.</p></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">{formatDate(v.date)}</p>
                  <p className="font-medium text-slate-800 mt-0.5">{v.condition}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{v.clinician} · {v.clinicianSpecialty}</p>
                  <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{v.category}</span>
                </div>
                <Button variant="outline" onClick={() => setSelectedVisit(v)}>View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!selectedVisit} onClose={() => setSelectedVisit(null)} title={selectedVisit?.condition}>
        {selectedVisit && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Visit Information</p>
              <p className="text-slate-700">Date: {formatDate(selectedVisit.date)}</p>
              <p className="text-slate-700">Clinician: {selectedVisit.clinician} ({selectedVisit.clinicianSpecialty})</p>
              <p className="text-slate-700">Category: {selectedVisit.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Clinical Information</p>
              <p className="text-slate-700">Symptoms: {selectedVisit.symptoms}</p>
              <p className="text-slate-700 mt-1">Diagnosis notes: {selectedVisit.diagnosisNotes}</p>
              <p className="text-slate-700 mt-1">Treatment: {selectedVisit.treatment}</p>
              <p className="text-slate-700 mt-1">Follow-up: {selectedVisit.followUp}</p>
            </div>
            {selectedVisit.hasPrescription && (
              <Link to="/patient/prescriptions" className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline">
                <Pill size={15} /> View Prescription
              </Link>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
