const styles = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  successful: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
  revoked: 'bg-slate-100 text-slate-600 border-slate-200',
  denied: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function StatusBadge({ status }) {
  const key = String(status).toLowerCase();
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5 ${styles[key] || styles.pending}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
