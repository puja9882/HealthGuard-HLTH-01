import { useState } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { createConsultation } from '../../../services/api';
import { CheckCircle2, FilePlus, ArrowRight, Stethoscope, AlertCircle, Calendar } from 'lucide-react';

export default function NewConsultation() {
  const { patient } = useOutletContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    visitType: 'Consultation',
    symptoms: '',
    diagnosis: '',
    category: 'Infectious Disease',
    diagnosisNotes: '',
    treatment: '',
    followUp: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successVisit, setSuccessVisit] = useState(null);

  const categories = [
    'Infectious Disease',
    'Chronic Disease',
    'Respiratory',
    'Cardiovascular',
    'Neurological',
    'Dermatological',
    'Gastrointestinal',
    'Other',
  ];

  const visitTypes = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'];

  const validate = () => {
    const errs = {};
    if (!formData.visitDate) errs.visitDate = 'Visit date is required.';
    if (!formData.visitType) errs.visitType = 'Visit type is required.';
    if (!formData.symptoms.trim()) errs.symptoms = 'Please describe the patient symptoms.';
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Condition / Diagnosis is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await createConsultation(patient.id, formData);
      setSuccessVisit(res);
    } catch (err) {
      setErrors({ server: err.message || 'Failed to save consultation.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (successVisit) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-lg mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
            Record Updated
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Consultation Added Successfully</h2>
          <p className="text-slate-600 text-xs mt-1">
            The medical record for patient <strong className="text-slate-900">{patient.name}</strong> ({patient.id}) has been saved and logged.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 text-xs space-y-1.5">
          <p className="font-semibold text-slate-800">Diagnosis: {successVisit.diagnosis}</p>
          <p className="text-slate-600">Category: {successVisit.category} • {successVisit.visitType}</p>
          <p className="text-slate-500 text-[11px] font-mono">Timestamp: {successVisit.date} {successVisit.time}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            to="../prescription/new"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-4 h-4" /> Add Prescription for this Visit
          </Link>
          <Link
            to="../history"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all"
          >
            View Updated Medical History
          </Link>
          <Link
            to="../"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all text-center"
          >
            Return to Patient Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FilePlus className="w-5 h-5 text-blue-600" /> New Medical Consultation
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Recording clinical visit notes for <strong className="text-slate-900">{patient.name}</strong> ({patient.id})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.server && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errors.server}
          </div>
        )}

        {/* Visit Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Date</label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.visitDate && <p className="text-rose-600 text-[11px] mt-1">{errors.visitDate}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Time</label>
            <input
              type="text"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
            <select
              value={formData.visitType}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {visitTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Symptoms Textarea */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Symptoms <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe the patient's presenting symptoms in detail..."
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.symptoms && <p className="text-rose-600 text-[11px] mt-1">{errors.symptoms}</p>}
        </div>

        {/* Diagnosis & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Condition / Diagnosis <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acute Viral Bronchitis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.diagnosis && <p className="text-rose-600 text-[11px] mt-1">{errors.diagnosis}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Condition Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diagnosis Notes */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">Clinical Notes & Observations</label>
          <textarea
            rows={3}
            placeholder="Physical examination observations, lab findings, vital stats..."
            value={formData.diagnosisNotes}
            onChange={(e) => setFormData({ ...formData, diagnosisNotes: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Treatment Plan */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">Treatment Plan</label>
          <textarea
            rows={3}
            placeholder="Dietary recommendations, therapy, procedures..."
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Follow-up Instructions */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">Follow-up Instructions</label>
          <input
            type="text"
            placeholder="e.g. Return after 5 days if fever persists."
            value={formData.followUp}
            onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="../"
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            {submitting ? 'Saving Consultation...' : 'Save Consultation Record'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
