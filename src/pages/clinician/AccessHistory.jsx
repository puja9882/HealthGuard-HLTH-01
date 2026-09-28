import { useState, useEffect } from 'react';
import { getClinicianAccessHistory } from '../../services/api';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { History, Search } from 'lucide-react';

const inputClass = 'border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600';

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

  const filtersActive = searchTerm || statusFilter !== 'All' || dateFilter !== 'All';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <History size={20} className="text-cyan-700" /> Access History
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Immutable log of patient records accessed during your clinical session
          </p>
        </div>

        <div className="text-sm bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
          Total Recorded Actions: <strong className="text-slate-900">{logs.length}</strong>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, ID, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Authorized">Authorized</option>
            <option value="Denied">Denied</option>
            <option value="Expired">Expired</option>
            <option value="Revoked">Revoked</option>
          </select>

          <select className={inputClass} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This week">This week</option>
            <option value="This month">This month</option>
          </select>

          {filtersActive && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); setDateFilter('All'); }}
              className="text-sm text-cyan-700 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs">
                <th className="py-3 px-4 sm:px-5">Timestamp</th>
                <th className="py-3 px-4 sm:px-5">Patient Reference</th>
                <th className="py-3 px-4 sm:px-5">Action Performed</th>
                <th className="py-3 px-4 sm:px-5">Access Method</th>
                <th className="py-3 px-4 sm:px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">Loading audit history...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">No access logs match your criteria.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 sm:px-5 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 sm:px-5 font-medium text-slate-800">
                      {log.patientName} <span className="font-mono text-slate-400 text-xs">({log.patientId})</span>
                    </td>
                    <td className="py-3 px-4 sm:px-5 text-slate-700">{log.action}</td>
                    <td className="py-3 px-4 sm:px-5 text-slate-500 text-xs">{log.accessMethod}</td>
                    <td className="py-3 px-4 sm:px-5 text-right">
                      <StatusBadge status={log.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
