
import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ServiceHighlights from './components/ServiceHighlights';
import WhyChooseUs from './components/WhyChooseUs';
import TestimonialSection from './components/TestimonialSection';
import CallToActionFooter from './components/CallToActionFooter';
import MainFooter from './components/MainFooter';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import PaymentOptions from './components/PaymentOptions';
import UrgentAssistance from './components/UrgentAssistance';
import AdminBookingsView from './components/AdminBookingsView'; // Import AdminBookingsView

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'adminBookings'>('main');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin/bookings') {
        setCurrentView('adminBookings');
      } else {
        setCurrentView('main');
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderMainContent = () => (
    <>
      <HeroSection />
      <ServiceHighlights />
      <WhyChooseUs />
      <TestimonialSection />
      <CallToActionFooter />
      <BookingForm />
      <PaymentOptions />
      <UrgentAssistance />
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      <Header />
      <main className="flex-grow">
        {currentView === 'adminBookings' ? <AdminBookingsView /> : renderMainContent()}
      </main>
      <MainFooter />
    </div>
  );
};

export default App;
