
import React, { useState, useMemo } from 'react';
import { TransactionItem, TransactionType, TransactionStatus } from '../../../types';
import { ListBulletIcon, ArrowDownTrayIcon } from '../../../constants';
import LoadingSpinner from '../../LoadingSpinner';

// Sample data - to be replaced with Supabase query
const sampleTransactions: TransactionItem[] = [
  { id: 'txn-1', date: '2024-07-28', type: TransactionType.CHARGE, description: 'Personal Care - J. Doe (July)', amount: 250.00, status: TransactionStatus.COMPLETED, patientName: 'John Doe', referenceId: 'BKG-123' },
  { id: 'txn-2', date: '2024-07-27', type: TransactionType.SUBSCRIPTION, description: 'Premium Plan - A. Smith', amount: 599.00, status: TransactionStatus.COMPLETED, patientName: 'Alice Smith' },
  { id: 'txn-3', date: '2024-07-26', type: TransactionType.REFUND, description: 'Refund for overcharge - B. Jones', amount: -50.00, status: TransactionStatus.COMPLETED, patientName: 'Bob Jones', referenceId: 'txn-0' },
  { id: 'txn-4', date: '2024-07-25', type: TransactionType.CHARGE, description: 'Companionship - M. Brown', amount: 120.00, status: TransactionStatus.FAILED, patientName: 'Mary Brown', referenceId: 'BKG-124' },
  { id: 'txn-5', date: '2024-07-30', type: TransactionType.CHARGE, description: 'Transportation - S. Lee', amount: 75.00, status: TransactionStatus.PENDING, patientName: 'Sam Lee', referenceId: 'BKG-125' },
];

const TransactionsTab: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>(sampleTransactions);
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  // const [isLoading, setIsLoading] = useState(true); // Add for Supabase integration

  // useEffect(() => {
  //   fetch transactions from Supabase
  //   setIsLoading(false);
  // }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const typeMatch = filterType === 'ALL' || txn.type === filterType;
      const statusMatch = filterStatus === 'ALL' || txn.status === filterStatus;
      const searchMatch = searchTerm === '' || 
                          txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (txn.patientName && txn.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (txn.referenceId && txn.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
      return typeMatch && statusMatch && searchMatch;
    });
  }, [transactions, filterType, filterStatus, searchTerm]);

  const handleExport = () => {
    const headers = ["ID", "Date", "Type", "Description", "Patient", "Amount", "Status", "Reference ID"];
    const rows = filteredTransactions.map(txn => [
      txn.id,
      txn.date,
      txn.type,
      `"${txn.description.replace(/"/g, '""')}"`, 
      txn.patientName || '',
      txn.amount.toFixed(2),
      txn.status,
      txn.referenceId || ''
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getStatusClass = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case TransactionStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case TransactionStatus.FAILED: return 'bg-red-100 text-red-700';
      case TransactionStatus.REFUNDED: return 'bg-blue-100 text-blue-700'; 
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // if (isLoading) return <div className="p-6 rounded-xl shadow-sm bg-white mt-0"><LoadingSpinner text="Loading transactions..." /></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-primary-dark flex items-center"><ListBulletIcon className="w-6 h-6 mr-2"/>Transaction History</h3>
        <button
          onClick={handleExport}
          className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center text-sm"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Export Visible
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm"> {/* Filters Card Styling */}
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-dark">Search</label>
          <input type="text" id="searchTerm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Description, Patient, Ref ID..." className="mt-1 input-style"/>
        </div>
        <div>
          <label htmlFor="filterType" className="block text-sm font-medium text-neutral-dark">Type</label>
          <select id="filterType" value={filterType} onChange={e => setFilterType(e.target.value as TransactionType | 'ALL')} className="mt-1 input-style bg-white">
            <option value="ALL">All Types</option>
            {Object.values(TransactionType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-neutral-dark">Status</label>
          <select id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TransactionStatus | 'ALL')} className="mt-1 input-style bg-white">
            <option value="ALL">All Statuses</option>
            {Object.values(TransactionStatus).map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              {["Date", "Type", "Description", "Patient", "Amount", "Status", "Ref ID"].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredTransactions.length > 0 ? filteredTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{txn.type}</td>
                <td className="px-4 py-3 text-sm text-neutral-dark max-w-xs truncate" title={txn.description}>{txn.description}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-dark">{txn.patientName || 'N/A'}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${txn.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {txn.amount < 0 ? `-$${Math.abs(txn.amount).toFixed(2)}` : `$${txn.amount.toFixed(2)}`}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(txn.status)}`}>
                        {txn.status}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">{txn.referenceId || 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-DEFAULT">No transactions match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem; /* py-2 px-3 */
          border-radius: 0.375rem; /* rounded-md */
          border: 1px solid #cbd5e1; /* slate-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
        }
        .input-style:focus {
          outline: none;
          border-color: #0891b2; /* primary-DEFAULT */
          box-shadow: 0 0 0 0.2rem rgba(8, 145, 178, 0.25); /* focus:ring-primary */
        }
      `}</style>
    </div>
  );
};

export default TransactionsTab;
