
import React, { useState } from 'react';
import { PatientChargeItem, ChargeStatus } from '../../../types';
import { useToast } from '../../ToastContext';
import { PlusCircleIcon } from '../../../constants';
import LoadingSpinner from '../../LoadingSpinner';

// Dummy patient data for selection - to be replaced with Supabase query
const dummyPatients = [
  { id: 'patient-1', name: 'Alice Wonderland' },
  { id: 'patient-2', name: 'Bob The Builder' },
  { id: 'patient-3', name: 'Charlie Brown' },
];

const ChargesTab: React.FC = () => {
  const { addToast } = useToast();
  const [charges, setCharges] = useState<PatientChargeItem[]>([]);
  const [showAddChargeForm, setShowAddChargeForm] = useState(false);
  const [newCharge, setNewCharge] = useState<Omit<PatientChargeItem, 'id' | 'status' | 'chargeDate'>>({
    patientId: '',
    patientName: '',
    description: '',
    amount: 0,
    paymentMethod: 'Manual Entry',
    dueDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "patientId") {
      const selectedPatient = dummyPatients.find(p => p.id === value);
      setNewCharge(prev => ({ 
        ...prev, 
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : ''
      }));
    } else {
      setNewCharge(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharge.patientId || !newCharge.description || newCharge.amount <= 0) {
      addToast('Please fill in all required fields for the charge.', 'error');
      return;
    }
    setIsSaving(true);
    const chargeToAdd: PatientChargeItem = {
      ...newCharge,
      id: `charge-${Date.now()}`, // Replace with Supabase generated ID
      status: ChargeStatus.PENDING,
      chargeDate: new Date().toISOString().split('T')[0],
      amount: Number(newCharge.amount) 
    };
    // Simulate API call - Replace with Supabase insert
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCharges(prev => [chargeToAdd, ...prev]); // Update with response from Supabase
    addToast(`Charge for ${chargeToAdd.patientName} added successfully.`, 'success');
    setShowAddChargeForm(false);
    setNewCharge({ patientId: '', patientName: '', description: '', amount: 0, paymentMethod: 'Manual Entry', dueDate: '' });
    setIsSaving(false);
  };
  
  const getStatusClass = (status: ChargeStatus) => {
    switch (status) {
      case ChargeStatus.PAID: return 'bg-green-100 text-green-700';
      case ChargeStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case ChargeStatus.OVERDUE: return 'bg-orange-100 text-orange-700';
      case ChargeStatus.CANCELLED: return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary-dark">Manual Patient Charges</h3>
        <button
          onClick={() => setShowAddChargeForm(!showAddChargeForm)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> {showAddChargeForm ? 'Cancel' : 'Add New Charge'}
        </button>
      </div>

      {showAddChargeForm && (
        <form onSubmit={handleAddCharge} className="p-6 border border-slate-200 rounded-xl mb-6 space-y-4 bg-slate-50 shadow-sm"> {/* Form Card Styling */}
          <h4 className="text-lg font-medium text-secondary">Create New Charge</h4>
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-neutral-dark">Patient</label>
            <select
              id="patientId"
              name="patientId"
              value={newCharge.patientId}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
            >
              <option value="" disabled>Select Patient</option>
              {dummyPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-dark">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newCharge.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., Additional care hours - July"
            />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-dark">Amount</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                    </div>
                    <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newCharge.amount}
                    onChange={handleInputChange}
                    className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-slate-300 rounded-md py-2"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-dark">Due Date (Optional)</label>
                <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newCharge.dueDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                min={new Date().toISOString().split('T')[0]}
                />
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center justify-center">
            {isSaving ? <LoadingSpinner size="sm"/> : 'Add Charge'}
          </button>
        </form>
      )}

      {charges.length > 0 ? (
        <div className="space-y-4">
          {charges.map(charge => (
            <div key={charge.id} className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-slate-50/50"> {/* Charge Item Card Styling */}
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-primary">{charge.patientName} - ${charge.amount.toFixed(2)}</h5>
                  <p className="text-sm text-neutral-dark">{charge.description}</p>
                   <p className="text-xs text-neutral-500">
                    Charged: {new Date(charge.chargeDate).toLocaleDateString()}
                    {charge.dueDate ? ` | Due: ${new Date(charge.dueDate).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(charge.status)}`}>
                  {charge.status}
                </span>
              </div>
              {/* Add actions like Mark as Paid, Send Reminder, Cancel */}
            </div>
          ))}
        </div>
      ) : (
        !showAddChargeForm && <p className="text-neutral-DEFAULT text-center py-6">No manual charges recorded yet. Click "Add New Charge" to create one.</p>
      )}
    </div>
  );
};

export default ChargesTab;
