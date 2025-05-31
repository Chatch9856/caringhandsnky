
import React, { useState } from 'react';
import { RefundItem, RefundRequestStatus as RefundStatusEnum, TransactionItem, TransactionType, TransactionStatus } from '../../../types';
import { useToast } from '../../ToastContext';
import { PlusCircleIcon } from '../../../constants';
import LoadingSpinner from '../../LoadingSpinner';

// Sample transactions - to be replaced with Supabase query
const sampleRefundableTransactions: TransactionItem[] = [
  { id: 'txn-1', date: '2024-07-28', type: TransactionType.CHARGE, description: 'Personal Care - J. Doe (July)', amount: 250.00, status: TransactionStatus.COMPLETED, patientName: 'John Doe', referenceId: 'BKG-123' },
  { id: 'txn-2', date: '2024-07-27', type: TransactionType.SUBSCRIPTION, description: 'Premium Plan - A. Smith', amount: 599.00, status: TransactionStatus.COMPLETED, patientName: 'Alice Smith' },
];


const RefundsTab: React.FC = () => {
  const { addToast } = useToast();
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [showAddRefundForm, setShowAddRefundForm] = useState(false);
  const [newRefund, setNewRefund] = useState<Omit<RefundItem, 'id' | 'status' | 'requestedDate' | 'proofUrl'>>({
    transactionId: '',
    patientName: '', 
    amount: 0,
    reason: '',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleTransactionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTxnId = e.target.value;
    const selectedTxn = sampleRefundableTransactions.find(txn => txn.id === selectedTxnId);
    if (selectedTxn) {
      setNewRefund(prev => ({
        ...prev,
        transactionId: selectedTxn.id,
        patientName: selectedTxn.patientName || 'N/A',
        amount: selectedTxn.amount 
      }));
    } else {
       setNewRefund(prev => ({
        ...prev,
        transactionId: '',
        patientName: '',
        amount: 0
      }));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRefund(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // TODO: Validate file type and size for refund proofs
      setProofFile(e.target.files[0]);
    } else {
      setProofFile(null);
    }
  };

  const handleAddRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefund.transactionId || newRefund.amount <= 0 || !newRefund.reason) {
      addToast('Please select a transaction, enter a valid amount, and provide a reason.', 'error');
      return;
    }
    const originalTransaction = sampleRefundableTransactions.find(t => t.id === newRefund.transactionId);
    if (originalTransaction && newRefund.amount > originalTransaction.amount) {
        addToast('Refund amount cannot exceed the original transaction amount.', 'error');
        return;
    }

    setIsSaving(true);
    const refundToAdd: RefundItem = {
      ...newRefund,
      id: `refund-${Date.now()}`, // Replace with Supabase generated ID
      status: RefundStatusEnum.REQUESTED, 
      requestedDate: new Date().toISOString().split('T')[0],
      // proofUrl: proofFile ? URL.createObjectURL(proofFile) : null, // For Supabase, upload file & get URL
      proofUrl: proofFile ? `/temp_proofs/${proofFile.name}` : null, // Placeholder for actual upload URL after Supabase integration
      amount: Number(newRefund.amount)
    };
    // Simulate API call - Replace with Supabase insert & file upload
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setRefunds(prev => [refundToAdd, ...prev]); // Update with response from Supabase
    addToast(`Refund request for ${refundToAdd.patientName} submitted.`, 'success');
    setShowAddRefundForm(false);
    setNewRefund({ transactionId: '', patientName: '', amount: 0, reason: '' });
    setProofFile(null);
    setIsSaving(false);
  };
  
  const getStatusClass = (status: RefundStatusEnum) => {
    switch (status) {
      case RefundStatusEnum.APPROVED:
      case RefundStatusEnum.COMPLETED: return 'bg-green-100 text-green-700';
      case RefundStatusEnum.REQUESTED:
      case RefundStatusEnum.PROCESSING: return 'bg-yellow-100 text-yellow-700';
      case RefundStatusEnum.REJECTED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary-dark">Process Refunds</h3>
        <button
          onClick={() => setShowAddRefundForm(!showAddRefundForm)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> {showAddRefundForm ? 'Cancel' : 'New Refund Request'}
        </button>
      </div>

      {showAddRefundForm && (
        <form onSubmit={handleAddRefund} className="p-6 border border-slate-200 rounded-xl mb-6 space-y-4 bg-slate-50 shadow-sm"> {/* Form Card Styling */}
          <h4 className="text-lg font-medium text-secondary">Create Refund Request</h4>
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-neutral-dark">Original Transaction</label>
            <select id="transactionId" name="transactionId" value={newRefund.transactionId} onChange={handleTransactionSelect} className="mt-1 block w-full input-style bg-white">
              <option value="" disabled>Select Transaction to Refund</option>
              {sampleRefundableTransactions
                .filter(txn => txn.status === TransactionStatus.COMPLETED && txn.amount > 0) 
                .map(txn => <option key={txn.id} value={txn.id}>{txn.description} (${txn.amount.toFixed(2)}) - {txn.patientName}</option>)}
            </select>
          </div>
          {newRefund.transactionId && (
            <p className="text-sm text-neutral-600">Refunding for: <span className="font-semibold">{newRefund.patientName}</span></p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-dark">Refund Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                    </div>
                    <input type="number" id="amount" name="amount" value={newRefund.amount} onChange={handleInputChange} className="input-style pl-7 pr-12 block w-full" placeholder="0.00" step="0.01" min="0.01"/>
                </div>
            </div>
            <div>
                <label htmlFor="proofFile" className="block text-sm font-medium text-neutral-dark">Proof/Document (Optional)</label>
                <input type="file" id="proofFile" onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/30"/>
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-neutral-dark">Reason for Refund</label>
            <textarea id="reason" name="reason" value={newRefund.reason} onChange={handleInputChange} rows={3} className="mt-1 block w-full input-style" placeholder="e.g., Service cancellation, Overcharge adjustment"></textarea>
          </div>
          <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center justify-center">
            {isSaving ? <LoadingSpinner size="sm"/> : 'Submit Refund Request'}
          </button>
        </form>
      )}

      {refunds.length > 0 ? (
        <div className="space-y-4">
          {refunds.map(refund => (
            <div key={refund.id} className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-slate-50/50"> {/* Refund Item Card Styling */}
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-primary">{refund.patientName} - Amount: ${refund.amount.toFixed(2)}</h5>
                  <p className="text-sm text-neutral-dark">Reason: {refund.reason}</p>
                  <p className="text-xs text-neutral-500">Requested: {new Date(refund.requestedDate).toLocaleDateString()} | Original Txn ID: {refund.transactionId}</p>
                  {refund.proofUrl && <a href={refund.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View Proof</a>}
                </div>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(refund.status)}`}>
                    {refund.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showAddRefundForm && <p className="text-neutral-DEFAULT text-center py-6">No refund requests processed yet. Click "New Refund Request" to create one.</p>
      )}
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

export default RefundsTab;
