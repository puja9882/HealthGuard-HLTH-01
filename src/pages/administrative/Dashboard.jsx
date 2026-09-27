import {
Activity,
AlertTriangle,
BarChart3,
MapPin,
ShieldCheck,
TrendingUp,
Users,
} from 'lucide-react';

export default function Dashboard() {
const stats = [
{
title: 'Total Cases',
value: '186',
change: '+12 this month',
icon: Users,
iconBg: 'bg-purple-50',
iconColor: 'text-purple-600',
},
{
title: 'Active Regions',
value: '8',
change: 'Across monitored areas',
icon: MapPin,
iconBg: 'bg-blue-50',
iconColor: 'text-blue-600',
},
{
title: 'Disease Categories',
value: '6',
change: 'Currently monitored',
icon: Activity,
iconBg: 'bg-emerald-50',
iconColor: 'text-emerald-600',
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

return ( <div className="space-y-8 animate-in fade-in duration-200">
{/* Header */} <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"> <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10"> <BarChart3 className="w-64 h-64 text-purple-400" /> </div>

```
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
          Administrative Workspace
        </span>

        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

        <span className="text-xs text-slate-300">
          Aggregate Analytics
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Public Health Dashboard
      </h1>

      <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-2">
        Monitor anonymized disease trends and regional case patterns
        without exposing individual patient records.
      </p>
    </div>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {stats.map((stat, index) => {
      const Icon = stat.icon;

      return (
        <div
          key={index}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {stat.title}
            </span>

            <div
              className={`p-2 rounded-xl ${stat.iconBg} ${stat.iconColor}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stat.value}
            </p>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {stat.change}
            </p>
          </div>
        </div>
      );
    })}
  </div>

  {/* Privacy Notice */}
  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
      <ShieldCheck className="w-5 h-5" />
    </div>

    <div>
      <h3 className="font-bold text-sm text-emerald-900">
        Privacy-Protected Analytics
      </h3>

      <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
        Administrative users receive only anonymized aggregate statistics.
        Individual patient names, IDs, contact details and medical records
        are not displayed in this dashboard.
      </p>
    </div>
  </div>

  {/* Analytics Sections */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Disease Trends */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Disease Distribution
            </h3>

            <p className="text-slate-500 text-xs mt-1">
              Aggregate cases by condition category
            </p>
          </div>

          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {diseaseData.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                {item.name}
              </span>

              <span className="text-xs font-bold text-slate-900">
                {item.cases}
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${Math.min((item.cases / 60) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Regional Statistics */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Regional Case Distribution
            </h3>

            <p className="text-slate-500 text-xs mt-1">
              Aggregate cases across monitored regions
            </p>
          </div>

          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {regionalData.map((item) => (
          <div key={item.region}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                {item.region}
              </span>

              <span className="text-xs font-bold text-slate-900">
                {item.cases}
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min((item.cases / 50) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Privacy Threshold */}
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />

        <div>
          <h3 className="font-bold text-sm text-slate-900">
            Minimum Group-Size Privacy Rule
          </h3>

          <p className="text-slate-500 text-xs mt-1">
            Small groups are suppressed to reduce re-identification risk.
          </p>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">
            Current minimum group size
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-1">
            k = 5
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-amber-800">
            Groups below 5 cases are hidden
          </p>

          <p className="text-[11px] text-amber-700 mt-1">
            Individual-level information is never shown in this view.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* AI/ML Placeholder */}
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
        <Activity className="w-5 h-5" />
      </div>

      <div>
        <h3 className="font-bold text-sm text-slate-900">
          AI-Assisted Disease Trend Monitoring
        </h3>

        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          The analytics layer will use anonymized time-series case counts
          to identify unusual increases and emerging disease trends.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-100 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-semibold text-slate-700">
            ML analysis module — prototype stage
          </span>
        </div>
      </div>
    </div>
  </div>
</div>


);
}
