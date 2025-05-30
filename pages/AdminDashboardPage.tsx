import React, { useState, useEffect, useCallback } from 'react';
import { BookingRequest, BookingStatus, PaymentMethod } from '../types';
import { supabase as supabaseClient } from '../services/supabaseClient'; 
import { getPaymentSettings, savePaymentSettings } from '../services/adminService';
import BookingRequestCard from '../components/BookingRequestCard';
import TabButton from '../components/TabButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { DocumentTextIcon, CreditCardIcon, CogIcon } from '../constants';
import { useAuth } from '../auth/AuthContext'; // Import useAuth

type AdminTab = 'bookings' | 'payments';

const mapSupabaseBookingToLocal = (sbBooking: any): BookingRequest => ({
  id: String(sbBooking.id), 
  clientName: sbBooking.full_name,
  clientEmail: sbBooking.email,
  clientPhone: sbBooking.phone_number,
  serviceId: sbBooking.service_id,
  serviceName: sbBooking.service_name || sbBooking.selected_service,
  requestedDate: sbBooking.requested_date,
  requestedTime: sbBooking.requested_time,
  address: sbBooking.address, // This will be null/undefined if not in Supabase or not selected
  notes: sbBooking.additional_notes || undefined,  // This will be null/undefined if not in Supabase or not selected
  status: sbBooking.status as BookingStatus, 
  submittedAt: sbBooking.created_at, 
});

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseClient
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error("Supabase fetch bookings error:", supabaseError);
        throw new Error(supabaseError.message);
      }

      if (data) {
        const mappedBookings = data.map(mapSupabaseBookingToLocal);
        setBookings(mappedBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Failed to load booking requests: ${errorMessage}. Please try again later.`);
      setBookings([]); 
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  const fetchPaymentSettings = useCallback(() => {
    setIsLoadingSettings(true);
    setPaymentMethods(getPaymentSettings());
    setIsLoadingSettings(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'payments') {
      fetchPaymentSettings();
    }
  }, [activeTab, fetchBookings, fetchPaymentSettings]);

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const originalBookings = [...bookings];
    setBookings(prevBookings => 
      prevBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );

    try {
      const { data: updatedData, error: updateError } = await supabaseClient
        .from('booking_requests')
        .update({ status: newStatus })
        .eq('id', bookingId) 
        .select();

      if (updateError) {
        console.error("Supabase update status error:", updateError);
        throw new Error(updateError.message); 
      }

      if (!updatedData || updatedData.length === 0) {
        console.warn(`Booking with ID ${bookingId} not found during Supabase update, or no data returned.`);
        alert("Failed to update booking status: Booking not found or update failed to return data.");
        setBookings(originalBookings); 
        return; 
      }
      
      alert(`Booking ${bookingId} status updated to ${newStatus} successfully.`);
      await fetchBookings(); 

    } catch (err) {
      console.error("Failed to update booking status:", err);
      setBookings(originalBookings); 
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(`An error occurred while updating booking status: ${errorMessage}.`);
      throw err;
    }
  };

  const handlePaymentMethodChange = (id: string, field: keyof PaymentMethod, value: string | boolean) => {
    setPaymentMethods(prev => 
      prev.map(pm => pm.id === id ? { ...pm, [field]: value } : pm)
    );
  };

  const handleSavePaymentSettings = () => {
    savePaymentSettings(paymentMethods);
    alert('Payment settings saved!');
  };
  
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
  const approvedBookings = bookings.filter(b => b.status === BookingStatus.APPROVED);
  const otherBookings = bookings.filter(b => b.status !== BookingStatus.PENDING && b.status !== BookingStatus.APPROVED);


  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
        <CogIcon className="w-8 h-8 text-primary" />
      </div>
      {user && (
        <p className="text-sm text-neutral-DEFAULT mb-6">
          Logged in as: <span className="font-semibold text-primary">{user.email}</span>
        </p>
      )}

      <div className="mb-6 border-b border-slate-200">
        <div className="flex space-x-1 -mb-px">
          <TabButton 
            label="Manage Bookings" 
            isActive={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')}
            icon={<DocumentTextIcon className="w-5 h-5" />}
          />
          <TabButton 
            label="Payment Settings" 
            isActive={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')}
            icon={<CreditCardIcon className="w-5 h-5" />}
          />
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      {activeTab === 'bookings' && (
        <div>
          {isLoadingBookings ? <LoadingSpinner text="Loading bookings..." /> : (
            <>
              <BookingSection title="Pending Approval" bookings={pendingBookings} onUpdateStatus={handleUpdateBookingStatus} />
              <BookingSection title="Approved & Upcoming" bookings={approvedBookings} onUpdateStatus={handleUpdateBookingStatus} />
              <BookingSection title="Other Bookings (Completed, Rejected, Cancelled)" bookings={otherBookings} onUpdateStatus={handleUpdateBookingStatus} defaultOpen={false} />
            </>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-primary-dark mb-6">Configure Payment Methods</h2>
          {isLoadingSettings ? <LoadingSpinner text="Loading settings..." /> : (
            <div className="space-y-6">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="p-4 border border-slate-200 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-secondary mb-2">{pm.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`${pm.id}-identifier`} className="block text-sm font-medium text-neutral-dark">
                        {pm.name === 'Square' ? 'Payment Link' : `${pm.name} ID / Handle`}
                      </label>
                      <input
                        type="text"
                        id={`${pm.id}-identifier`}
                        value={pm.identifier}
                        onChange={e => handlePaymentMethodChange(pm.id, 'identifier', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder={pm.name === 'Square' ? 'https://squareup.com/...' : (pm.name === 'CashApp' ? '$YourCashTag' : (pm.name === 'Venmo' ? '@YourVenmo' : 'your.email@example.com'))}
                      />
                    </div>
                     <div>
                      <label htmlFor={`${pm.id}-instructions`} className="block text-sm font-medium text-neutral-dark">
                        Payment Instructions (Optional)
                      </label>
                      <textarea
                        id={`${pm.id}-instructions`}
                        value={pm.instructions || ''}
                        onChange={e => handlePaymentMethodChange(pm.id, 'instructions', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder={`e.g., Please include booking ID in the payment note.`}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${pm.id}-enabled`}
                        checked={pm.isEnabled}
                        onChange={e => handlePaymentMethodChange(pm.id, 'isEnabled', e.target.checked)}
                        className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                      <label htmlFor={`${pm.id}-enabled`} className="ml-2 block text-sm text-neutral-dark">
                        Enable this payment method
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleSavePaymentSettings}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-md transition-colors mt-6"
              >
                Save Payment Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


interface BookingSectionProps {
  title: string;
  bookings: BookingRequest[];
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  defaultOpen?: boolean;
}

const BookingSection: React.FC<BookingSectionProps> = ({ title, bookings, onUpdateStatus, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (bookings.length === 0 && title === "Pending Approval") { 
     return (
        <div className="mb-8">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full text-left flex justify-between items-center py-2 px-1 text-xl font-semibold text-secondary mb-1"
                aria-expanded={isOpen}
                aria-controls={`booking-section-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
                {title} (0)
                <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && <div id={`booking-section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-neutral-DEFAULT p-4 bg-white rounded-md shadow">No pending bookings at this time.</div>}
        </div>
     );
  }
  
  if (bookings.length === 0 && !defaultOpen && title !== "Pending Approval" && !isOpen ) return null;


  return (
    <div className="mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left flex justify-between items-center py-2 px-1 text-xl font-semibold text-secondary mb-1"
        aria-expanded={isOpen}
        aria-controls={`booking-section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {title} ({bookings.length})
        <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div id={`booking-section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map(booking => (
                <BookingRequestCard key={booking.id} booking={booking} onUpdateStatus={onUpdateStatus} />
            ))}
            </div>
        ) : (
            <p className="text-neutral-DEFAULT p-4 bg-white rounded-md shadow">No bookings in this category.</p>
        )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;