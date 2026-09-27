import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getPatientHistory, getPatientPrescriptions } from '../../../services/api';
import { User, Activity, Pill, AlertCircle, Calendar, ArrowRight, Shield } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Left Column: Basic Info & Known Conditions */}
      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" /> Patient Demographics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Full Name</span>
              <span className="font-semibold text-slate-900">{patient.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Patient ID</span>
              <span className="font-mono font-semibold text-slate-900">{patient.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Age & Gender</span>
              <span className="font-semibold text-slate-900">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Region</span>
              <span className="font-semibold text-slate-900">{patient.region}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Emergency Contact</span>
              <span className="font-semibold text-slate-900">
                {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
              </span>
            </div>
          </div>
        </div>

        {/* Current Conditions Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" /> Known Conditions
          </h3>

          <div className="flex flex-wrap gap-2 pt-1">
            {patient.conditions && patient.conditions.length > 0 ? (
              patient.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-50 text-amber-900 text-xs font-semibold rounded-full border border-amber-200"
                >
                  {cond}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No chronic conditions recorded.</span>
            )}
          </div>
        </div>
      </div>

      {/* Middle & Right Column: Recent Activity & Latest Prescriptions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Medical Visits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Recent Consultations
            </h3>
            <Link to="history" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View Full Timeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-xs">Loading medical visits...</div>
            ) : latestVisits.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">No medical visit history found.</div>
            ) : (
              latestVisits.map((visit) => (
                <div key={visit.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{visit.diagnosis}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{visit.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Symptoms:</strong> {visit.symptoms}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Treatment:</strong> {visit.treatment}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span>Clinician: {visit.clinician}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">{visit.visitType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" /> Active & Recent Prescriptions
            </h3>
            <Link to="prescriptions" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All Prescriptions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-xs">Loading prescriptions...</div>
            ) : latestPrescriptions.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">No active prescriptions found.</div>
            ) : (
              latestPrescriptions.map((rx) => (
                <div key={rx.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">{rx.condition}</span>
                    <span className="text-[11px] font-mono text-emerald-800">{rx.date}</span>
                  </div>
                  <div className="space-y-1">
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-100 text-slate-800">
                        <span className="font-semibold">{m.name} ({m.dosage})</span>
                        <span className="text-[11px] text-slate-500">{m.frequency} • {m.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
