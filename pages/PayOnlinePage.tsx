
import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
// adminService will be updated to fetch from Supabase
import { getPaymentSettings } from '../services/adminService'; 
import LoadingSpinner from '../components/LoadingSpinner';
import { CreditCardIcon, PAYMENT_METHOD_LOGOS } from '../constants';


const PayOnlinePage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState({ intro: '', footer: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // This will be updated to fetch from Supabase in adminService
        const methods = await getPaymentSettings(); 
        setPaymentMethods(methods.filter(pm => pm.isEnabled && pm.identifier));

        // Fetch editable content (placeholders for now, to be implemented with Supabase)
        // const introContent = await fetchSiteContent('pay_online_intro');
        // const footerContent = await fetchSiteContent('pay_online_footer');
        // setPageContent({ intro: introContent, footer: footerContent });

      } catch (error) {
        console.error("Error fetching payment settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Placeholder for fetching site content, to be replaced with Supabase call
  // const fetchSiteContent = async (key: string): Promise<string> => {
  //   // In a real app, fetch from Supabase 'site_content' table
  //   if (key === 'pay_online_intro') return "Thank you for choosing CaringHandsNKY! Please find our available online payment methods below. Ensure you include your Booking ID or Client Name in the payment reference/note.";
  //   if (key === 'pay_online_footer') return "If you have any questions regarding payment, please don't hesitate to contact us.";
  //   return "";
  // };


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-primary-dark mb-8 text-center">Pay Online</h1>
      
      {isLoading ? (
        <LoadingSpinner text="Loading payment options..." />
      ) : (
        <div className="max-w-3xl mx-auto">
          {pageContent.intro && (
            <p className="text-neutral-DEFAULT mb-8 text-center prose lg:prose-lg" dangerouslySetInnerHTML={{ __html: pageContent.intro }} />
          )}
          {!pageContent.intro && (
             <p className="text-neutral-DEFAULT mb-8 text-center">
                Thank you for choosing CaringHandsNKY! Please find our available online payment methods below. 
                Ensure you include your Booking ID or Client Name in the payment reference/note.
            </p>
          )}

          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map(method => {
                const LogoComponent = PAYMENT_METHOD_LOGOS[method.id] || CreditCardIcon;
                const paymentLink = method.officialLink || (method.identifier.startsWith('http') ? method.identifier : undefined);

                return (
                  <div key={method.id} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
                    <LogoComponent className="w-24 h-16 sm:w-32 sm:h-20 object-contain mb-4 text-primary"/>
                    <h2 className="text-xl font-semibold text-primary-dark mb-2">{method.name}</h2>
                    
                    {paymentLink ? (
                       <a 
                        href={paymentLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-dark underline break-all font-medium text-sm mb-2"
                        title={`Pay with ${method.name}`}
                      >
                        {method.identifier || `Go to ${method.name}`}
                      </a>
                    ) : (
                       <p className="font-mono text-neutral-dark break-all font-medium text-sm mb-2">{method.identifier}</p>
                    )}

                    {method.instructions && (
                        <p className="text-xs text-neutral-DEFAULT mt-1">
                            <em>{method.instructions}</em>
                        </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <CreditCardIcon className="w-16 h-16 text-primary-light mx-auto mb-4"/>
                <p className="text-xl text-neutral-DEFAULT">
                    Online payment options are not currently configured.
                </p>
                <p className="text-neutral-DEFAULT mt-2">
                    Please contact us directly for payment arrangements.
                </p>
            </div>
          )}

          {pageContent.footer && (
            <p className="text-sm text-neutral-DEFAULT mt-10 text-center prose" dangerouslySetInnerHTML={{ __html: pageContent.footer }} />
          )}
          {!pageContent.footer && paymentMethods.length > 0 && (
            <p className="text-sm text-neutral-DEFAULT mt-10 text-center">
                If you have any questions regarding payment, please don't hesitate to contact us.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PayOnlinePage;
