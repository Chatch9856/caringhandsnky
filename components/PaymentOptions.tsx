
import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const PlaceholderQR: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full aspect-square bg-gray-200 flex items-center justify-center mt-4 rounded-lg border border-gray-300">
    <p className="text-gray-500 text-xs sm:text-sm text-center p-2">{text}</p>
  </div>
);

const PaymentOptions: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLElement>({ animationClass: 'animate-fade-in-up' });

  return (
    <section id="payment-options" ref={sectionRef} className="bg-brand-slate-light py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-blue-dark mb-3">
            How Would You Like to Pay?
          </h2>
          <p className="text-lg text-brand-charcoal-light max-w-xl mx-auto">
            Select your preferred payment method below. We aim to make it convenient for you.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-8">
          {/* CashApp Card */}
          <div className="w-full sm:w-80 md:w-72 bg-brand-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col text-center">
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2">CashApp</h3>
            <p className="text-brand-charcoal-light mb-1 text-lg">$CaringHandsNKY</p>
            <p className="text-sm text-gray-500 mb-3">Scan the QR code with your CashApp.</p>
            <PlaceholderQR text="Your CashApp QR Code (Replace with actual image: /assets/cashapp-qr.png)" />
            <p className="text-xs text-gray-400 mt-auto pt-3">
              Easy and instant payments.
            </p>
          </div>

          {/* Venmo Card */}
          <div className="w-full sm:w-80 md:w-72 bg-brand-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col text-center">
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2">Venmo</h3>
            <p className="text-brand-charcoal-light mb-1 text-lg">@CaringHandsNKY</p>
            <p className="text-sm text-gray-500 mb-3">Scan to pay with Venmo.</p>
            <PlaceholderQR text="Your Venmo QR Code (Replace with actual image: /assets/venmo-qr.png)" />
             <p className="text-xs text-gray-400 mt-auto pt-3">
              Quick and secure mobile payments.
            </p>
          </div>

          {/* Shopify Card */}
          <div className="w-full sm:w-80 md:w-72 bg-brand-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col text-center items-center justify-center">
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2">Secure Online Payment</h3>
            <p className="text-brand-charcoal-light mb-4">
              Use our secure portal for credit/debit card payments.
            </p>
            <a 
              href="https://your-shopify-url.com/checkout" // Replace with your actual Shopify checkout URL
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-brand-purple text-brand-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-purple-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
            >
              Pay Online Securely
            </a>
            <p className="text-xs text-gray-400 mt-4">
              Powered by Shopify for trusted transactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;