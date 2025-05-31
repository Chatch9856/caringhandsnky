import React, { useState, useEffect, useCallback } from 'react';
import { Service, BookingStatus as AppBookingStatus } from '../types'; // Renamed to avoid conflict with AdminBooking
// Removed BookingRequest since AdminBookingsPanel handles its own types (AdminBooking)
// Removed getBookingRequests, updateBookingStatus as apiUpdateBookingStatus from bookingService.ts
import AdminPaymentsPanel from '../components/admin/AdminPaymentsPanel'; 
import CaregiverPanel from '../components/admin/CaregiverPanel';
import AdminBookingsPanel from '../components/admin/AdminBookingsPanel'; // New panel for bookings
import { useToast } from '../components/ToastContext';
import TabButton from '../components/TabButton';
import { 
  DocumentTextIcon, CreditCardIcon, CogIcon, UsersIcon, 
  SAMPLE_SERVICES
} from '../constants';


type AdminTab = 'bookings' | 'payments' | 'caregivers';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings'); // Default to bookings
  // const { addToast } = useToast(); // addToast might be used by child panels directly

  // Bookings state and functions are now managed within AdminBookingsPanel.tsx

  // Services for PricingTab (can be fetched if dynamic)
  const servicesForPricing: Service[] = SAMPLE_SERVICES;

  // Caregiver state and handlers are managed within CaregiverPanel.tsx

  // Effect for any top-level logic when tabs change, if needed in future.
  // Currently, child panels manage their own data fetching based on their active state.
  useEffect(() => {
    // if (activeTab === 'bookings') {
    //   // AdminBookingsPanel handles its own data
    // } else if (activeTab === 'payments') {
    //   // AdminPaymentsPanel handles its own data (via sub-tabs like GatewaysTab)
    // } else if (activeTab === 'caregivers') {
    //   // CaregiverPanel handles its own data
    // }
  }, [activeTab]);
  

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
        <CogIcon className="w-8 h-8 text-primary" />
      </div>

      <div className="mb-6 border-b border-slate-200">
        <div className="flex space-x-1 -mb-px">
           <TabButton 
            label="Manage Bookings" 
            isActive={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')}
            icon={<DocumentTextIcon className="w-5 h-5" />}
          />
           <TabButton 
            label="Caregivers" 
            isActive={activeTab === 'caregivers'} 
            onClick={() => setActiveTab('caregivers')}
            icon={<UsersIcon className="w-5 h-5" />}
          />
          <TabButton 
            label="Payments" 
            isActive={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')}
            icon={<CreditCardIcon className="w-5 h-5" />}
          />
        </div>
      </div>

      {activeTab === 'bookings' && (
        // AdminBookingsPanel now handles all booking-related display and logic
        <AdminBookingsPanel />
      )}

      {activeTab === 'payments' && (
        <AdminPaymentsPanel services={servicesForPricing} />
      )}

      {activeTab === 'caregivers' && (
        <CaregiverPanel />
      )}
    </div>
  );
};

// BookingSection component is removed from here as AdminBookingsPanel will manage its own internal structure.

export default AdminDashboardPage;