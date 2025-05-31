import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import { AuditLogEntry } from '../../types';
import { DocumentMagnifyingGlassIcon, RefreshIconSolid } from '../../constants';
// import { getAuditLogs } from '../../services/adminActivityLogService'; // Uncomment when service implemented
// import { useToast } from '../ToastContext';

const AdminActivityLogPanel: React.FC = () => {
  // const { addToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching
  const [filters, setFilters] = useState({ module: '', user_info: '', date_from: '', date_to: '' });

  // const fetchLogs = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     // const data = await getAuditLogs(filters);
  //     // setLogs(data);
  //     setLogs([ // Placeholder Data
  //       { id: 'log1', module: 'Bookings', action: 'Status Updated', user_info: 'Admin User', target_id: 'BKG-123', target_type: 'Booking', notes: 'Status changed to Approved', timestamp: new Date().toISOString() },
  //       { id: 'log2', module: 'Caregivers', action: 'Created', user_info: 'Admin User', target_id: 'CG-456', target_type: 'Caregiver', notes: 'New caregiver profile added', timestamp: new Date(Date.now() - 3600000).toISOString() },
  //       { id: 'log3', module: 'Payments', action: 'Gateway Updated', user_info: 'System', target_id: 'CashApp', target_type: 'PaymentGateway', notes: 'CashApp enabled', timestamp: new Date(Date.now() - 7200000).toISOString() },
  //     ]);
  //   } catch (error) {
  //     console.error("Error fetching audit logs:", error);
  //     // addToast("Failed to load activity logs.", "error");
  //   }
  //   setIsLoading(false);
  // }, [filters, addToast]);

  // useEffect(() => {
  //   fetchLogs();
  // }, [fetchLogs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // const handleApplyFilters = () => {
  //   fetchLogs();
  // };

  if (isLoading) {
    return <LoadingSpinner text="Loading activity logs..." />;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h3 className="text-xl font-semibold text-primary-dark flex items-center">
          <DocumentMagnifyingGlassIcon className="w-6 h-6 mr-2" /> Daily Activity Log
        </h3>
        <button 
            // onClick={fetchLogs} 
            disabled={isLoading}
            className="text-sm bg-primary-light hover:bg-primary text-primary-dark hover:text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center disabled:opacity-50"
        >
            <RefreshIconSolid className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync Logs
        </button>
      </div>
      
      {/* Filter Section - Placeholder */}
      <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
        <p className="text-sm text-neutral-600">Filtering options will be available here. (Coming Soon)</p>
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" name="module" placeholder="Filter by Module..." onChange={handleFilterChange} className="input-style-sm" />
          <input type="text" name="user_info" placeholder="Filter by User..." onChange={handleFilterChange} className="input-style-sm" />
          <input type="date" name="date_from" onChange={handleFilterChange} className="input-style-sm" />
          <input type="date" name="date_to" onChange={handleFilterChange} className="input-style-sm" />
        </div>
        <button onClick={handleApplyFilters} className="mt-3 bg-secondary hover:bg-secondary-dark text-white text-sm py-1.5 px-3 rounded-md">Apply Filters</button>
        */}
      </div>


      {logs.length === 0 ? (
        <p className="text-neutral-500 text-center py-8">No activity logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">User/System</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Target</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{log.module}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{log.action}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{log.user_info}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600" title={log.target_id || undefined}>
                    {log.target_type ? `${log.target_type}: ` : ''}{log.target_id ? `...${log.target_id.slice(-6)}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 max-w-md truncate" title={log.notes || undefined}>{log.notes || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <style>{`
        .input-style-sm {
          padding: 0.4rem 0.6rem; 
          border-radius: 0.375rem; 
          border: 1px solid #cbd5e1; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
        }
        .input-style-sm:focus {
          outline: none;
          border-color: #0891b2; 
          box-shadow: 0 0 0 0.2rem rgba(8, 145, 178, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AdminActivityLogPanel;