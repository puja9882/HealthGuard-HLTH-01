import {
  Activity,
  AlertTriangle,
  BarChart3,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Cases',
      value: '186',
      change: '+12 this month',
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-700',
    },
    {
      title: 'Active Regions',
      value: '8',
      change: 'Across monitored areas',
      icon: MapPin,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-700',
    },
    {
      title: 'Disease Categories',
      value: '6',
      change: 'Currently monitored',
      icon: Activity,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Privacy Protected',
      value: '100%',
      change: 'Individual records hidden',
      icon: ShieldCheck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const diseaseData = [
    { name: 'Diabetes', cases: 52 },
    { name: 'Hypertension', cases: 41 },
    { name: 'Respiratory', cases: 29 },
    { name: 'Cardiac', cases: 24 },
    { name: 'Arthritis', cases: 18 },
  ];

  const regionalData = [
    { region: 'Pune', cases: 47 },
    { region: 'PCMC', cases: 38 },
    { region: 'Nashik', cases: 26 },
    { region: 'Mumbai', cases: 21 },
    { region: 'Nagpur', cases: 16 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Public Health Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Administrative Workspace · Monitor anonymized disease trends and regional case patterns without exposing individual patient records.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">Privacy-Protected Analytics</p>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Administrative users receive only anonymized aggregate statistics.
              Individual patient names, IDs, contact details and medical records are not displayed in this dashboard.
            </p>
          </div>
        </div>
      </Card>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Disease Trends */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Disease Distribution</h3>
              <p className="text-sm text-slate-500 mt-0.5">Aggregate cases by condition category</p>
            </div>
            <div className="p-2 rounded-lg bg-violet-50 text-violet-700">
              <BarChart3 size={18} />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            {diseaseData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700">{item.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{item.cases}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{
                      width: `${Math.min((item.cases / 60) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Statistics */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Regional Case Distribution</h3>
              <p className="text-sm text-slate-500 mt-0.5">Aggregate cases across monitored regions</p>
            </div>
            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700">
              <MapPin size={18} />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            {regionalData.map((item) => (
              <div key={item.region}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700">{item.region}</span>
                  <span className="text-xs font-semibold text-slate-900">{item.cases}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full"
                    style={{
                      width: `${Math.min((item.cases / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Privacy Threshold */}
      <Card>
        <div className="flex items-start gap-2 pb-3 border-b border-slate-100">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-slate-900">Minimum Group-Size Privacy Rule</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Small groups are suppressed to reduce re-identification risk.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div>
            <p className="text-xs text-slate-500">Current minimum group size</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">k = 5</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">Groups below 5 cases are hidden</p>
            <p className="text-xs text-amber-700 mt-1">
              Individual-level information is never shown in this view.
            </p>
          </div>
        </div>
      </Card>

      {/* AI/ML Placeholder */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI-Assisted Disease Trend Monitoring</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              The analytics layer will use anonymized time-series case counts to identify unusual increases and emerging disease trends.
            </p>
            <div className="mt-3 inline-flex items-center gap-2">
              <StatusBadge status="Prototype" />
              <span className="text-xs text-slate-500">ML analysis module — prototype stage</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
