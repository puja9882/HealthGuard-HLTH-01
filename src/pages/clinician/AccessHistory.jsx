import { useState, useEffect } from 'react';
import { getClinicianAccessHistory } from '../../services/api';
import { History, Search, ShieldCheck, AlertTriangle, ShieldX, XCircle, Calendar, Filter } from 'lucide-react';

export default function AccessHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await getClinicianAccessHistory();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    // Search
    const searchMatch =
      !searchTerm.trim() ||
      [log.patientName, log.patientId, log.action, log.accessMethod]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = statusFilter === 'All' || log.status === statusFilter;

    // Date filter
    let dateMatch = true;
    if (dateFilter !== 'All') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      if (dateFilter === 'Today') {
        dateMatch = logDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'This week') {
        dateMatch = now - logDate <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'This month') {
        dateMatch = now - logDate <= 30 * 24 * 60 * 60 * 1000;
      }
    }

    return searchMatch && statusMatch && dateMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" /> Security Access Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of patient records accessed during your clinical session
          </p>
        </div>

        <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 font-medium">
          Total Recorded Actions: <strong className="text-slate-900">{logs.length}</strong>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, ID, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Authorized">Authorized</option>
              <option value="Denied">Denied</option>
              <option value="Expired">Expired</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This week">This week</option>
              <option value="This month">This month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-4 sm:px-6">Patient Reference</th>
                <th className="py-3.5 px-4 sm:px-6">Action Performed</th>
                <th className="py-3.5 px-4 sm:px-6">Access Method</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Loading audit history...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">No access logs match your criteria.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                      {log.patientName} <span className="font-mono text-slate-400 text-[11px]">({log.patientId})</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-700 font-semibold">{log.action}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">{log.accessMethod}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Authorized'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : log.status === 'Expired'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {log.status === 'Authorized' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        {log.status === 'Expired' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {log.status === 'Revoked' && <ShieldX className="w-3 h-3 text-purple-600" />}
                        {log.status === 'Denied' && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
