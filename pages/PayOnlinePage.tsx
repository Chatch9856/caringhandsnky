
import React, { useState, useEffect } from 'react';
import { AppPaymentGateway } from '../types'; // Use AppPaymentGateway
import { getPaymentGateways } from '../services/paymentGatewayService'; // Use new service
import LoadingSpinner from '../components/LoadingSpinner';
import { CreditCardIcon } from '../constants';


const PayOnlinePage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<AppPaymentGateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMethods = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const methodsFromDb = await getPaymentGateways();
        setPaymentMethods(methodsFromDb.filter(pm => pm.isEnabled && pm.identifier));
      } catch (err: any) {
        console.error("Error fetching payment methods for PayOnlinePage:", err);
        setError("Could not load payment methods. Please try again later.");
        setPaymentMethods([]); // Clear any potentially stale data
      } finally {
        setIsLoading(false);
      }
    };
    fetchMethods();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Pay Online</h1>
      
      {isLoading ? (
        <LoadingSpinner text="Loading payment options..." />
      ) : error ? (
         <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm text-center">
            <CreditCardIcon className="w-16 h-16 text-red-400 mx-auto mb-4"/>
            <p className="text-xl text-red-600">{error}</p>
         </div>
      ) : paymentMethods.length > 0 ? (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl">
          <p className="text-neutral-DEFAULT mb-6 text-center">
            Thank you for choosing CaringHandsNKY! Please find our available online payment methods below. 
            Ensure you include your Booking ID or Client Name in the payment reference/note.
          </p>
          <div className="space-y-6">
            {paymentMethods.map(method => (
              <div key={method.dbId || method.type} className="p-6 border border-primary-light rounded-xl shadow-sm bg-primary-light/10 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <CreditCardIcon className="w-8 h-8 text-primary mr-3"/>
                  <h2 className="text-2xl font-semibold text-primary">{method.type}</h2> {/* 'type' is like 'name' */}
                </div>
                
                {method.identifier && (
                    <p className="text-lg text-neutral-dark mb-2 break-words">
                    <strong>
                        {method.type === 'Square' || (method.type === 'PayPal' && method.identifier.startsWith('http')) ? 'Payment Link:' : `${method.type} ID/Handle:`}
                    </strong> 
                    {method.type === 'Square' || (method.type === 'PayPal' && method.identifier.startsWith('http')) ? (
                        <a href={method.identifier.startsWith('http') ? method.identifier : `https://${method.identifier}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark underline">
                        {method.identifier}
                        </a>
                    ) : (
                        <span className="font-mono text-accent">{method.identifier}</span>
                    )}
                    </p>
                )}

                {method.qrCodeUrl && (
                  <div className="my-3">
                    <strong className="block text-sm font-medium text-neutral-dark mb-1">Scan QR Code:</strong>
                    <img src={method.qrCodeUrl} alt={`${method.type} QR Code`} className="w-32 h-32 border p-1 rounded-md object-contain bg-white shadow-sm"/>
                  </div>
                )}
                
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
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm text-center">
            <CreditCardIcon className="w-16 h-16 text-primary-light mx-auto mb-4"/>
            <p className="text-xl text-neutral-DEFAULT">
                Online payment options are not currently configured or available.
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
