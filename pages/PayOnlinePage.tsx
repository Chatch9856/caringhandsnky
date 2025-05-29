
import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
import { getPaymentSettings } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CreditCardIcon } from '../constants';


const PayOnlinePage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const methods = getPaymentSettings();
    setPaymentMethods(methods.filter(pm => pm.isEnabled && pm.identifier));
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Pay Online</h1>
      
      {isLoading ? (
        <LoadingSpinner text="Loading payment options..." />
      ) : paymentMethods.length > 0 ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <p className="text-neutral-DEFAULT mb-6 text-center">
            Thank you for choosing CaringHandsNKY! Please find our available online payment methods below. 
            Ensure you include your Booking ID or Client Name in the payment reference/note.
          </p>
          <div className="space-y-6">
            {paymentMethods.map(method => (
              <div key={method.id} className="p-6 border border-primary-light rounded-lg shadow-sm bg-primary-light/10">
                <div className="flex items-center mb-3">
                  <CreditCardIcon className="w-8 h-8 text-primary mr-3"/>
                  <h2 className="text-2xl font-semibold text-primary">{method.name}</h2>
                </div>
                <p className="text-lg text-neutral-dark mb-2">
                  <strong>
                    {method.name === 'Square' ? 'Payment Link:' : `${method.name} ${method.name === 'CashApp' ? 'Tag' : method.name === 'Venmo' ? 'Handle' : 'ID'}: `}
                  </strong> 
                  {method.name === 'Square' ? (
                    <a href={method.identifier.startsWith('http') ? method.identifier : `https://${method.identifier}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark underline break-all">
                      {method.identifier}
                    </a>
                  ) : (
                    <span className="font-mono text-accent">{method.identifier}</span>
                  )}
                </p>
                {method.instructions && (
                    <p className="text-sm text-neutral-DEFAULT mt-1">
                        <em>Instructions: {method.instructions}</em>
                    </p>
                )}
              </div>
            ))}
          </div>
           <p className="text-sm text-neutral-DEFAULT mt-8 text-center">
            If you have any questions regarding payment, please don't hesitate to contact us.
          </p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
            <CreditCardIcon className="w-16 h-16 text-primary-light mx-auto mb-4"/>
            <p className="text-xl text-neutral-DEFAULT">
                Online payment options are not currently configured.
            </p>
            <p className="text-neutral-DEFAULT mt-2">
                Please contact us directly for payment arrangements.
            </p>
        </div>
      )}
    </div>
  );
};

export default PayOnlinePage;
