import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { createConsultation } from '../../../services/api';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { CheckCircle2, FilePlus, Stethoscope } from 'lucide-react';

export default function NewConsultation() {
  const { patient } = useOutletContext();

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

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

  if (successVisit) {
    return (
      <Card className="max-w-lg mx-auto text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} />
        </div>

        <div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
            Record Updated
          </span>
          <h2 className="text-lg font-semibold text-slate-900 mt-2">Consultation Added Successfully</h2>
          <p className="text-slate-600 text-sm mt-1">
            The medical record for patient <strong className="text-slate-900">{patient.name}</strong> ({patient.id}) has been saved and logged.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg text-left border border-slate-200 text-sm space-y-1.5">
          <p className="font-medium text-slate-800">Diagnosis: {successVisit.diagnosis}</p>
          <p className="text-slate-600">Category: {successVisit.category} • {successVisit.visitType}</p>
          <p className="text-slate-500 text-xs font-mono">Timestamp: {successVisit.date} {successVisit.time}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link to="../prescription/new">
            <Button variant="emerald" className="w-full">
              <Stethoscope size={15} className="inline mr-1.5 -mt-0.5" />Add Prescription for this Visit
            </Button>
          </Link>
          <Link to="../history">
            <Button variant="primary" className="w-full">View Updated Medical History</Button>
          </Link>
          <Link to="../">
            <Button variant="outline" className="w-full">Return to Patient Overview</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FilePlus size={18} className="text-cyan-700" /> New Medical Consultation
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Recording clinical visit notes for <strong className="text-slate-800">{patient.name}</strong> ({patient.id})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.server && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errors.server}
          </div>
        )}

        {/* Visit Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Visit Date</label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className={inputClass}
            />
            {errors.visitDate && <p className="text-red-600 text-xs mt-1">{errors.visitDate}</p>}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Visit Time</label>
            <input
              type="text"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Visit Type</label>
            <select
              value={formData.visitType}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className={inputClass}
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
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe the patient's presenting symptoms in detail..."
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className={inputClass}
          />
          {errors.symptoms && <p className="text-red-600 text-xs mt-1">{errors.symptoms}</p>}
        </div>

        {/* Diagnosis & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Condition / Diagnosis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acute Viral Bronchitis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className={inputClass}
            />
            {errors.diagnosis && <p className="text-red-600 text-xs mt-1">{errors.diagnosis}</p>}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Condition Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={inputClass}
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
        <div>
          <label className="block text-xs text-slate-400 mb-1">Clinical Notes &amp; Observations</label>
          <textarea
            rows={3}
            placeholder="Physical examination observations, lab findings, vital stats..."
            value={formData.diagnosisNotes}
            onChange={(e) => setFormData({ ...formData, diagnosisNotes: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Treatment Plan</label>
          <textarea
            rows={3}
            placeholder="Dietary recommendations, therapy, procedures..."
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Follow-up Instructions */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Follow-up Instructions</label>
          <input
            type="text"
            placeholder="e.g. Return after 5 days if fever persists."
            value={formData.followUp}
            onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Link to="../">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="cyan" disabled={submitting}>
            {submitting ? 'Saving Consultation...' : 'Save Consultation Record'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
