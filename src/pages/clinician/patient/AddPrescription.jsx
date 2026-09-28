import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { createPrescription } from '../../../services/api';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Pill, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddPrescription() {
  const { patient } = useOutletContext();

  const [condition, setCondition] = useState('General Consultation');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days', instructions: 'Take after meals.' },
  ]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [createdRx, setCreatedRx] = useState(null);

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Every 6 hours',
    'As needed',
    'Other',
  ];

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: 'Once daily', duration: '5 days', instructions: '' },
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const validate = () => {
    const errs = {};
    if (!condition.trim()) errs.condition = 'Condition / Reason is required.';

    let medError = false;
    medicines.forEach((m) => {
      if (!m.name.trim() || !m.dosage.trim() || !m.duration.trim()) {
        medError = true;
      }
    });

    if (medError) {
      errs.medicines = 'All medicine rows must have Name, Dosage, and Duration specified.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await createPrescription(patient.id, { condition, medicines });
      setCreatedRx(res);
    } catch (err) {
      setErrors({ server: err.message || 'Failed to save prescription.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600';

  if (createdRx) {
    return (
      <Card className="max-w-lg mx-auto text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} />
        </div>

        <div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
            Prescription Issued
          </span>
          <h2 className="text-lg font-semibold text-slate-900 mt-2">Prescription Added Successfully</h2>
          <p className="text-slate-600 text-sm mt-1">
            Prescription <strong className="text-slate-900">#{createdRx.id}</strong> for patient{' '}
            <strong className="text-slate-900">{patient.name}</strong> has been generated and appended to records.
          </p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg text-left border border-emerald-200 text-sm space-y-2">
          <p className="font-medium text-emerald-900">Condition: {createdRx.condition}</p>
          <div className="space-y-1.5">
            {createdRx.medicines.map((m, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-100 text-slate-800 flex justify-between">
                <span>{m.name} ({m.dosage})</span>
                <span className="text-slate-500 text-xs">{m.frequency} • {m.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link to="../prescriptions">
            <Button variant="primary" className="w-full">View Patient Prescriptions History</Button>
          </Link>
          <Button
            variant="emerald"
            className="w-full"
            onClick={() => {
              setCreatedRx(null);
              setMedicines([{ name: '', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days', instructions: '' }]);
            }}
          >
            Add Another Prescription
          </Button>
          <Link to="../" className="text-sm text-slate-500 hover:text-slate-800 text-center">
            Return to Patient Overview
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Pill size={18} className="text-emerald-700" /> Issue New Prescription
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Prescribing medications for <strong className="text-slate-800">{patient.name}</strong> ({patient.id})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.server && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errors.server}
          </div>
        )}

        {/* Condition / Reason */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Condition / Medical Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Acute Upper Respiratory Tract Infection"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={inputClass}
          />
          {errors.condition && <p className="text-red-600 text-xs mt-1">{errors.condition}</p>}
        </div>

        {/* Medicines Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">
              Medication List ({medicines.length})
            </span>
            <Button type="button" variant="outline" onClick={handleAddMedicineRow}>
              <Plus size={15} className="inline mr-1.5 -mt-0.5" />Add Medicine
            </Button>
          </div>

          {errors.medicines && (
            <p className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errors.medicines}
            </p>
          )}

          {/* Medicine Rows */}
          <div className="space-y-3">
            {medicines.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-medium text-slate-700 text-sm">Medicine #{idx + 1}</span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicineRow(idx)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs font-medium"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol / Amoxicillin"
                      value={m.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className={`${inputClass} bg-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 mg / 10 ml"
                      value={m.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className={`${inputClass} bg-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Frequency</label>
                    <select
                      value={m.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className={`${inputClass} bg-white`}
                    >
                      {frequencyOptions.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days / 2 weeks"
                      value={m.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className={`${inputClass} bg-white`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Special Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Take after meals with water."
                      value={m.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                      className={`${inputClass} bg-white`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Link to="../prescriptions">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="emerald" disabled={submitting}>
            {submitting ? 'Issuing Prescription...' : 'Issue Prescription'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
