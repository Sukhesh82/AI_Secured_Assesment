import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Shield, Search, Filter, AlertTriangle, Monitor, LogIn, FileText, CheckCircle } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/admin/audit-logs');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load audit logs", err);
      setError('Failed to load security audit logs');
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('MALPRACTICE')) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return <LogIn className="w-5 h-5 text-blue-500" />;
    if (action.includes('EXAM') && !action.includes('SUBMIT')) return <FileText className="w-5 h-5 text-purple-500" />;
    if (action.includes('SUBMIT')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Monitor className="w-5 h-5 text-gray-400" />;
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('MALPRACTICE')) return 'bg-red-100 text-red-800 border-red-500/20';
    if (action.includes('SUBMIT')) return 'bg-green-100 text-green-800 border-green-500/20';
    if (action.includes('START')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (action.includes('LOGIN')) return 'bg-gray-800 text-gray-200 border-gray-800';
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAction === 'ALL') return matchesSearch;
    if (filterAction === 'MALPRACTICE') return matchesSearch && log.action.includes('MALPRACTICE');
    if (filterAction === 'EXAM_ACTIVITY') return matchesSearch && (log.action.includes('START') || log.action.includes('SUBMIT'));
    if (filterAction === 'SYSTEM') return matchesSearch && !log.action.includes('MALPRACTICE') && !log.action.includes('START') && !log.action.includes('SUBMIT');
    
    return matchesSearch;
  });

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Shield className="w-6 h-6 mr-2 text-gray-300" />
            Security Audit Logs
          </h1>
          <p className="text-gray-400 mt-1">Immutable record of all system activities and security events.</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select 
              className="pl-9 pr-8 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none bg-[#131316]"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="MALPRACTICE">Malpractice Only</option>
              <option value="EXAM_ACTIVITY">Exam Activity</option>
              <option value="SYSTEM">System/Auth</option>
            </select>
          </div>
          <button onClick={fetchLogs} className="px-4 py-2 bg-[#131316] border shadow-sm rounded-lg text-sm font-medium hover:bg-gray-800/30">
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 dark-card overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex-1 flex items-center justify-center">
            Loading secure audit trail...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 flex-1 flex items-center justify-center">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800/30 sticky top-0 z-10">
                <tr className="border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 w-48">Timestamp</th>
                  <th className="p-4 w-48">Action Type</th>
                  <th className="p-4 w-32">Username</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 w-32">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-400">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded border ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-medium text-white">
                        {log.username || `User #${log.userId}`}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {log.description}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
