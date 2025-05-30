
import React, { useState, useEffect, useCallback } from 'react';
import { PaymentMethod } from '../../types';
import { getPaymentSettings, savePaymentSettings } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CreditCardIcon, PAYMENT_METHOD_LOGOS } from '../../constants';

const AdminPaymentsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const settings = await getPaymentSettings();
      setPaymentMethods(settings);
    } catch (err: any) {
      setError(`Failed to load payment settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handlePaymentMethodChange = (id: string, field: keyof PaymentMethod, value: string | boolean) => {
    setPaymentMethods(prev =>
      prev.map(pm => (pm.id === id ? { ...pm, [field]: value } : pm))
    );
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await savePaymentSettings(paymentMethods);
      alert('Payment settings saved successfully!');
    } catch (err: any) {
      setError(`Failed to save payment settings: ${err.message}`);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
        <CreditCardIcon className="w-8 h-8 mr-3 text-primary" />
        Payment Gateway Settings
      </h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p>{error}</p></div>}

      {isLoading ? (
        <LoadingSpinner text="Loading payment settings..." />
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-6">
          {paymentMethods.map(pm => {
            const LogoComponent = PAYMENT_METHOD_LOGOS[pm.id] || null;
            return (
              <div key={pm.id} className="p-4 sm:p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                  <div className="flex items-center mb-2 sm:mb-0">
                    {LogoComponent && <LogoComponent className="w-10 h-auto mr-3 text-slate-700" />}
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-700">{pm.name}</h3>
                  </div>
                  <label htmlFor={`${pm.id}-enabled`} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`${pm.id}-enabled`}
                      checked={pm.isEnabled}
                      onChange={e => handlePaymentMethodChange(pm.id, 'isEnabled', e.target.checked)}
                      className="h-5 w-5 text-primary border-slate-300 rounded focus:ring-primary focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-slate-600">{pm.isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                {pm.isEnabled && (
                  <div className="space-y-3 sm:space-y-4 pl-0 sm:pl-4 mt-2 sm:mt-0 border-l-0 sm:border-l-2 border-slate-100 sm:ml-2">
                    <div>
                      <label htmlFor={`${pm.id}-identifier`} className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                        {pm.name === 'Square' || pm.name === 'Stripe' || pm.name === 'PayPal' ? 'Payment Link / Client ID / Key' : `${pm.name} ID / Handle / Email`}
                      </label>
                      <input
                        type="text"
                        id={`${pm.id}-identifier`}
                        value={pm.identifier}
                        onChange={e => handlePaymentMethodChange(pm.id, 'identifier', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-xs"
                        placeholder={pm.name === 'Square' ? 'https://squareup.com/...' : (pm.name === 'CashApp' ? '$YourCashTag' : (pm.name === 'Venmo' ? '@YourVenmo' : 'your.email@example.com'))}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${pm.id}-instructions`} className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                        Display Instructions (Optional)
                      </label>
                      <textarea
                        id={`${pm.id}-instructions`}
                        value={pm.instructions || ''}
                        onChange={e => handlePaymentMethodChange(pm.id, 'instructions', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-xs"
                        placeholder={`e.g., Include booking ID in payment note.`}
                      />
                    </div>
                     <div>
                      <label htmlFor={`${pm.id}-logoUrl`} className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                        Custom Logo URL (Optional - overrides default)
                      </label>
                      <input
                        type="url"
                        id={`${pm.id}-logoUrl`}
                        value={pm.logoUrl || ''}
                        onChange={e => handlePaymentMethodChange(pm.id, 'logoUrl', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-xs"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-70"
          >
            {isSaving ? <LoadingSpinner size="sm" /> : 'Save All Payment Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
