
import React, { useState } from 'react';
import { SubscriptionPlanInfo, SubscriptionStatus } from '../../../types';
import { useToast } from '../../ToastContext';
import { PlusCircleIcon } from '../../../constants';
import LoadingSpinner from '../../LoadingSpinner';

// Sample data - to be replaced with Supabase
const samplePlans: SubscriptionPlanInfo[] = [
    { id: 'plan-basic-monthly', planName: 'Basic Care Plan', price: 299, duration: 'monthly', features: ['20 hours/month companion care', 'Weekly wellness check-in'], status: SubscriptionStatus.ACTIVE },
    { id: 'plan-premium-monthly', planName: 'Premium Support Plan', price: 599, duration: 'monthly', features: ['40 hours/month personal care', 'Daily medication reminders', '24/7 on-call support'], status: SubscriptionStatus.ACTIVE },
];

const SubscriptionsTab: React.FC = () => {
  const { addToast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlanInfo[]>(samplePlans);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<SubscriptionPlanInfo, 'id' | 'status'>>({
    planName: '',
    price: 0,
    duration: 'monthly',
    features: [],
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setNewPlan(prev => ({ ...prev, features: [...prev.features, currentFeature.trim()] }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlan(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.planName || newPlan.price <= 0 || newPlan.features.length === 0) {
      addToast('Please fill in all plan details, including at least one feature.', 'error');
      return;
    }
    setIsSaving(true);
    const planToAdd: SubscriptionPlanInfo = {
      ...newPlan,
      id: `plan-${Date.now()}`, // Replace with Supabase generated ID
      status: SubscriptionStatus.ACTIVE, 
    };
    // Simulate API call - Replace with Supabase insert
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPlans(prev => [planToAdd, ...prev]); // Update with response from Supabase
    addToast(`Subscription plan "${planToAdd.planName}" added successfully.`, 'success');
    setShowAddPlanForm(false);
    setNewPlan({ planName: '', price: 0, duration: 'monthly', features: [] });
    setIsSaving(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-0"> {/* Standardized Card Styling */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary-dark">Subscription Plans</h3>
        <button
          onClick={() => setShowAddPlanForm(!showAddPlanForm)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> {showAddPlanForm ? 'Cancel' : 'Add New Plan'}
        </button>
      </div>

      {showAddPlanForm && (
        <form onSubmit={handleAddPlan} className="p-6 border border-slate-200 rounded-xl mb-6 space-y-4 bg-slate-50 shadow-sm"> {/* Form Card Styling */}
          <h4 className="text-lg font-medium text-secondary">Create New Subscription Plan</h4>
          <div>
            <label htmlFor="planName" className="block text-sm font-medium text-neutral-dark">Plan Name</label>
            <input type="text" id="planName" name="planName" value={newPlan.planName} onChange={handleInputChange} className="mt-1 block w-full input-style" placeholder="e.g., Gold Tier Weekly"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-dark">Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                    </div>
                    <input type="number" id="price" name="price" value={newPlan.price} onChange={handleInputChange} className="input-style pl-7 pr-12 block w-full py-2" placeholder="0.00" step="0.01" min="0"/>
                </div>
            </div>
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-dark">Duration</label>
                <select id="duration" name="duration" value={newPlan.duration} onChange={handleInputChange} className="mt-1 block w-full input-style bg-white py-2">
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
                <option value="weekly">Weekly</option>
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="feature" className="block text-sm font-medium text-neutral-dark">Features</label>
            <div className="flex mt-1">
              <input type="text" id="feature" value={currentFeature} onChange={e => setCurrentFeature(e.target.value)} className="input-style flex-grow" placeholder="e.g., 10 hours of service"/>
              <button type="button" onClick={handleAddFeature} className="ml-2 bg-secondary hover:bg-secondary-dark text-white px-3 py-2 rounded-md text-sm">Add</button>
            </div>
            <ul className="mt-2 space-y-1 list-disc list-inside pl-1">
              {newPlan.features.map((feature, index) => (
                <li key={index} className="text-sm text-neutral-dark flex justify-between items-center">
                  <span>{feature}</span>
                  <button type="button" onClick={() => handleRemoveFeature(index)} className="text-red-500 hover:text-red-700 text-xs">&times; Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center justify-center">
            {isSaving ? <LoadingSpinner size="sm"/> : 'Add Plan'}
          </button>
        </form>
      )}

      {plans.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-gradient-to-br from-primary-light/10 to-secondary-light/10"> {/* Plan Card Styling */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold text-primary">{plan.planName}</h4>
                <span className="text-2xl font-extrabold text-accent">${plan.price}<span className="text-sm font-normal text-neutral-500">/{plan.duration}</span></span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Features:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-dark pl-2 mb-4">
                {plan.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
              <div className="text-right">
                <button className="text-xs text-blue-600 hover:underline mr-2">Edit Plan</button>
                <button className="text-xs text-red-600 hover:underline">Deactivate Plan</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
         !showAddPlanForm && <p className="text-neutral-DEFAULT text-center py-6">No subscription plans configured yet. Click "Add New Plan" to create one.</p>
      )}
       <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
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

export default SubscriptionsTab;
