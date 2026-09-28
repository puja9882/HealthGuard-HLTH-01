export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    emerald: 'bg-emerald-700 text-white hover:bg-emerald-800',
    cyan: 'bg-cyan-700 text-white hover:bg-cyan-800',
    violet: 'bg-violet-700 text-white hover:bg-violet-800',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
