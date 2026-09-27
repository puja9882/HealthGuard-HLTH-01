import { useState } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { createPrescription } from '../../../services/api';
import { Pill, Plus, Trash2, CheckCircle2, ArrowRight, Stethoscope } from 'lucide-react';

export default function AddPrescription() {
  const { patient } = useOutletContext();
  const navigate = useNavigate();

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
    medicines.forEach((m, i) => {
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

  if (createdRx) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-lg mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
            Prescription Issued
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Prescription Added Successfully</h2>
          <p className="text-slate-600 text-xs mt-1">
            Prescription <strong className="text-slate-900">#{createdRx.id}</strong> for patient{' '}
            <strong className="text-slate-900">{patient.name}</strong> has been generated and appended to records.
          </p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl text-left border border-emerald-200 text-xs space-y-2">
          <p className="font-bold text-emerald-900">Condition: {createdRx.condition}</p>
          <div className="space-y-1">
            {createdRx.medicines.map((m, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-100 text-slate-800 flex justify-between">
                <span>{m.name} ({m.dosage})</span>
                <span className="text-slate-500 text-[11px]">{m.frequency} • {m.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            to="../prescriptions"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all"
          >
            View Patient Prescriptions History
          </Link>
          <button
            onClick={() => {
              setCreatedRx(null);
              setMedicines([{ name: '', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days', instructions: '' }]);
            }}
            className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl transition-all"
          >
            Add Another Prescription
          </button>
          <Link
            to="../"
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
          >
            Return to Patient Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" /> Issue New Prescription
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribing medications for <strong className="text-slate-900">{patient.name}</strong> ({patient.id})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.server && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errors.server}
          </div>
        )}

        {/* Condition / Reason */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Condition / Medical Reason <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Acute Upper Respiratory Tract Infection"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          {errors.condition && <p className="text-rose-600 text-[11px] mt-1">{errors.condition}</p>}
        </div>

        {/* Medicines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Medication List ({medicines.length})
            </span>
            <button
              type="button"
              onClick={handleAddMedicineRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          {errors.medicines && (
            <p className="text-rose-600 text-xs bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errors.medicines}
            </p>
          )}

          {/* Medicine Rows */}
          <div className="space-y-4">
            {medicines.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-700 text-xs">Medicine #{idx + 1}</span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicineRow(idx)}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol / Amoxicillin"
                      value={m.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 mg / 10 ml"
                      value={m.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                    <select
                      value={m.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days / 2 weeks"
                      value={m.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Special Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Take after meals with water."
                      value={m.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to="../prescriptions"
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            {submitting ? 'Issuing Prescription...' : 'Issue Prescription'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
