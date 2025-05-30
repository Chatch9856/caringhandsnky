
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookingRequest, BookingStatus, NotificationType, NotificationStatus } from '../../types'; // Added NotificationStatus
import { supabase as supabaseClient } from '../../services/supabaseClient'; 
import BookingRequestCard from '../../components/BookingRequestCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal'; // For delete confirmation
import { DocumentTextIcon } from '../../constants';

const mapSupabaseBookingToLocal = (sbBooking: any): BookingRequest => ({
  id: String(sbBooking.id), 
  clientName: sbBooking.full_name,
  clientEmail: sbBooking.email,
  clientPhone: sbBooking.phone_number,
  serviceId: sbBooking.service_id,
  serviceName: sbBooking.service_name || sbBooking.selected_service, // Use selected_service as primary
  requestedDate: sbBooking.requested_date,
  requestedTime: sbBooking.requested_time,
  address: sbBooking.address,
  notes: sbBooking.additional_notes || undefined,
  status: sbBooking.status as BookingStatus, 
  submittedAt: sbBooking.created_at, 
});

type FilterStatus = BookingStatus | 'All';

const AdminBookingsPage: React.FC = () => {
  const [allBookings, setAllBookings] = useState<BookingRequest[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<BookingRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseClient
        .from('booking_requests')
        .select('*')
        .not('status', 'eq', BookingStatus.ARCHIVED) // Exclude archived bookings
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setAllBookings(data ? data.map(mapSupabaseBookingToLocal) : []);
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err);
      setError(`Failed to load bookings: ${err.message}. Please try again.`);
      setAllBookings([]); 
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const triggerStatusUpdateNotification = async (booking: BookingRequest, newStatus: BookingStatus) => {
    if (newStatus === BookingStatus.APPROVED || newStatus === BookingStatus.REJECTED) {
        const patientNotification = {
            recipientEmail: booking.clientEmail,
            type: NotificationType.BOOKING_STATUS_UPDATE_PATIENT,
            title: `Booking ${newStatus} - CaringHandsNKY`,
            message: `Dear ${booking.clientName},\n\nYour booking request for ${booking.serviceName} on ${booking.requestedDate} at ${booking.requestedTime} has been ${newStatus.toLowerCase()}.\n\n${newStatus === BookingStatus.APPROVED ? 'We look forward to serving you!' : 'Please contact us if you have any questions.'}\n\nSincerely,\nThe CaringHandsNKY Team`,
            data: { bookingId: booking.id, newStatus: newStatus },
            status: NotificationStatus.UNREAD,
            createdAt: new Date().toISOString(),
        };
        // Placeholder for actual email sending logic
        console.log("Placeholder: Send patient status update email:", patientNotification);
        const { error: patientNotifError } = await supabaseClient.from('notifications').insert([{
          ...patientNotification, 
          title: `(Patient Email) ${patientNotification.title}`,
          message: `Email to ${patientNotification.recipientEmail}: ${patientNotification.message.substring(0,100)}...`
        }]);
        if (patientNotifError) console.error("Error logging patient status update notification:", patientNotifError);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const bookingToUpdate = allBookings.find(b => b.id === bookingId);
    if (!bookingToUpdate) return;

    const originalBookings = [...allBookings];
    setAllBookings(prevBookings => 
      prevBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );

    try {
      const { error: updateError } = await supabaseClient
        .from('booking_requests')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (updateError) throw updateError;
      
      // Trigger notification for specific status changes
      await triggerStatusUpdateNotification(bookingToUpdate, newStatus);
      
      // If status is ARCHIVED, remove it from this view after successful update
      if (newStatus === BookingStatus.ARCHIVED) {
        setAllBookings(prev => prev.filter(b => b.id !== bookingId));
      }
      // No full re-fetch needed unless it's archived, just local state update is fine for other status changes
      // Or, optionally re-fetch for absolute consistency: await fetchBookings();
      
    } catch (err: any) {
      console.error("Failed to update booking status:", err);
      setAllBookings(originalBookings); 
      alert(`Error updating status: ${err.message}.`);
      throw err; // Re-throw for BookingRequestCard to handle its loading state
    }
  };

  const handleDeleteRequest = async (bookingId: string): Promise<void> => {
    const booking = allBookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingToDelete(booking);
      setShowDeleteModal(true);
    } else {
      console.warn(`Booking with ID ${bookingId} not found for deletion request.`);
      // Optionally, show an error to the user or handle as appropriate
      alert(`Error: Booking with ID ${bookingId} not found.`);
    }
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabaseClient
        .from('booking_requests')
        .delete()
        .eq('id', bookingToDelete.id);
      
      if (deleteError) throw deleteError;
      
      setAllBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
      alert(`Booking for ${bookingToDelete.clientName} deleted successfully.`);
    } catch (err: any) {
      console.error("Failed to delete booking:", err);
      alert(`Error deleting booking: ${err.message}.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };
  
  const filteredBookings = useMemo(() => {
    if (activeFilter === 'All') return allBookings;
    return allBookings.filter(b => b.status === activeFilter);
  }, [allBookings, activeFilter]);

  const filterTabs: { label: string, status: FilterStatus, count: number }[] = [
    { label: "All Active", status: 'All', count: allBookings.length },
    { label: "Pending", status: BookingStatus.PENDING, count: allBookings.filter(b => b.status === BookingStatus.PENDING).length },
    { label: "Approved", status: BookingStatus.APPROVED, count: allBookings.filter(b => b.status === BookingStatus.APPROVED).length },
    { label: "Completed", status: BookingStatus.COMPLETED, count: allBookings.filter(b => b.status === BookingStatus.COMPLETED).length },
    { label: "Cancelled", status: BookingStatus.CANCELLED, count: allBookings.filter(b => b.status === BookingStatus.CANCELLED).length },
    { label: "Rejected", status: BookingStatus.REJECTED, count: allBookings.filter(b => b.status === BookingStatus.REJECTED).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
          <DocumentTextIcon className="w-8 h-8 mr-3 text-primary" />
          Manage Bookings
        </h1>
         <button 
            onClick={fetchBookings} 
            className="px-4 py-2 text-xs font-medium text-primary bg-primary-light hover:bg-primary/20 rounded-lg transition-colors"
            disabled={isLoadingBookings}
          >
            {isLoadingBookings ? 'Refreshing...' : 'Refresh Bookings'}
          </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>}

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="mb-4 sm:mb-6 border-b border-slate-200">
          <nav className="flex flex-wrap -mb-px" aria-label="Filter bookings">
            {filterTabs.map(tab => (
              <button
                key={tab.status}
                onClick={() => setActiveFilter(tab.status)}
                className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm focus:outline-none transition-colors
                  ${activeFilter === tab.status
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeFilter === tab.status ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {isLoadingBookings ? (
          <LoadingSpinner text="Loading bookings..." />
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredBookings.map(booking => (
              <BookingRequestCard 
                key={booking.id} 
                booking={booking} 
                onUpdateStatus={handleUpdateBookingStatus}
                onDeleteBooking={handleDeleteRequest} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">No bookings found for the selected filter.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => { if (!isDeleting) { setShowDeleteModal(false); setBookingToDelete(null); }}}
        title="Confirm Deletion"
        size="sm"
      >
        <p className="text-slate-600 mb-4">
          Are you sure you want to delete the booking for <strong className="text-slate-800">{bookingToDelete?.clientName}</strong> for the service <strong className="text-slate-800">{bookingToDelete?.serviceName}</strong>?
        </p>
        <p className="text-xs text-red-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => { setShowDeleteModal(false); setBookingToDelete(null); }}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteBooking}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? <LoadingSpinner size="sm" /> : 'Delete Booking'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookingsPage;
