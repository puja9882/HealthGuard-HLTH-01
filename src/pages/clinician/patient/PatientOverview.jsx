import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getPatientHistory, getPatientPrescriptions } from '../../../services/api';
import Card from '../../../components/Card';
import { User, Activity, Pill, AlertCircle, ChevronRight } from 'lucide-react';

export default function PatientOverview() {
  const { patient } = useOutletContext();
  const [latestVisits, setLatestVisits] = useState([]);
  const [latestPrescriptions, setLatestPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [vData, pData] = await Promise.all([
          getPatientHistory(patient.id),
          getPatientPrescriptions(patient.id),
        ]);
        setLatestVisits(vData.slice(0, 2));
        setLatestPrescriptions(pData.slice(0, 2));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [patient.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column: Basic Info & Known Conditions */}
      <div className="space-y-4">
        {/* Basic Information Card */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <User size={16} className="text-cyan-700" /> Patient Demographics
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Full Name</span>
              <span className="font-medium text-slate-800">{patient.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Patient ID</span>
              <span className="font-mono font-medium text-slate-800">{patient.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Age &amp; Gender</span>
              <span className="font-medium text-slate-800">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-medium text-rose-600">{patient.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Region</span>
              <span className="font-medium text-slate-800">{patient.region}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Emergency Contact</span>
              <span className="font-medium text-slate-800">
                {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
              </span>
            </div>
          </div>
        </Card>

        {/* Current Conditions Card */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-600" /> Known Conditions
          </h3>

          <div className="flex flex-wrap gap-2">
            {patient.conditions && patient.conditions.length > 0 ? (
              patient.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-medium rounded-full border border-amber-200"
                >
                  {cond}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">No chronic conditions recorded.</span>
            )}
          </div>
        </Card>
      </div>

      {/* Middle & Right Column: Recent Activity & Latest Prescriptions */}
      <div className="lg:col-span-2 space-y-4">
        {/* Recent Medical Visits */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Activity size={16} className="text-cyan-700" /> Recent Consultations
            </h3>
            <Link to="history" className="text-sm text-cyan-700 hover:underline">
              View Full Timeline
            </Link>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-3">
            {loading ? (
              <p className="py-3 text-center text-sm text-slate-400">Loading medical visits...</p>
            ) : latestVisits.length === 0 ? (
              <p className="py-3 text-center text-sm text-slate-400">No medical visit history found.</p>
            ) : (
              latestVisits.map((visit) => (
                <div key={visit.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-800">{visit.diagnosis}</span>
                    <span className="text-xs text-slate-500 font-mono">{visit.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-700">Symptoms:</strong> {visit.symptoms}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-700">Treatment:</strong> {visit.treatment}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-200/60">
                    <span>Clinician: {visit.clinician}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{visit.visitType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Pill size={16} className="text-emerald-700" /> Active &amp; Recent Prescriptions
            </h3>
            <Link to="prescriptions" className="text-sm text-cyan-700 hover:underline inline-flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-3">
            {loading ? (
              <p className="py-3 text-center text-sm text-slate-400">Loading prescriptions...</p>
            ) : latestPrescriptions.length === 0 ? (
              <p className="py-3 text-center text-sm text-slate-400">No active prescriptions found.</p>
            ) : (
              latestPrescriptions.map((rx) => (
                <div key={rx.id} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-emerald-900">{rx.condition}</span>
                    <span className="text-xs font-mono text-emerald-800">{rx.date}</span>
                  </div>
                  <div className="space-y-1.5">
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-100 text-slate-800">
                        <span className="font-medium text-xs">{m.name} ({m.dosage})</span>
                        <span className="text-xs text-slate-500">{m.frequency} • {m.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
