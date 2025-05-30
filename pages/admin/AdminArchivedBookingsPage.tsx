
import React, { useState, useEffect, useCallback } from 'react';
import { BookingRequest, BookingStatus } from '../../types';
import { supabase as supabaseClient } from '../../services/supabaseClient'; 
import BookingRequestCard from '../../components/BookingRequestCard'; // Can reuse or make a simplified version
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { ArchiveBoxIcon } from '../../constants';

// mapSupabaseBookingToLocal can be imported if it's moved to a shared util
const mapSupabaseBookingToLocal = (sbBooking: any): BookingRequest => ({
  id: String(sbBooking.id), 
  clientName: sbBooking.full_name,
  clientEmail: sbBooking.email,
  clientPhone: sbBooking.phone_number,
  serviceId: sbBooking.service_id,
  serviceName: sbBooking.service_name || sbBooking.selected_service,
  requestedDate: sbBooking.requested_date,
  requestedTime: sbBooking.requested_time,
  address: sbBooking.address,
  notes: sbBooking.additional_notes || undefined,
  status: sbBooking.status as BookingStatus, 
  submittedAt: sbBooking.created_at, 
});


const AdminArchivedBookingsPage: React.FC = () => {
  const [archivedBookings, setArchivedBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToManage, setBookingToManage] = useState<BookingRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const fetchArchivedBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseClient
        .from('booking_requests')
        .select('*')
        .eq('status', BookingStatus.ARCHIVED)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setArchivedBookings(data ? data.map(mapSupabaseBookingToLocal) : []);
    } catch (err: any) {
      console.error("Failed to fetch archived bookings:", err);
      setError(`Failed to load archived bookings: ${err.message}.`);
      setArchivedBookings([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedBookings();
  }, [fetchArchivedBookings]);

  const handleUnarchiveBooking = async (bookingId: string) => {
    setIsProcessing(true);
    try {
      // Typically unarchive to 'Pending' or a previous non-terminal status
      const { error: updateError } = await supabaseClient
        .from('booking_requests')
        .update({ status: BookingStatus.PENDING }) // Or another appropriate status
        .eq('id', bookingId);

      if (updateError) throw updateError;
      setArchivedBookings(prev => prev.filter(b => b.id !== bookingId));
      alert('Booking unarchived and moved to Pending.');
    } catch (err: any) {
      alert(`Error unarchiving booking: ${err.message}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRequest = (booking: BookingRequest) => {
    setBookingToManage(booking);
    setShowDeleteModal(true);
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToManage) return;
    setIsProcessing(true);
    try {
      const { error: deleteError } = await supabaseClient
        .from('booking_requests')
        .delete()
        .eq('id', bookingToManage.id);
      
      if (deleteError) throw deleteError;
      
      setArchivedBookings(prev => prev.filter(b => b.id !== bookingToManage.id));
      alert(`Archived booking for ${bookingToManage.clientName} permanently deleted.`);
    } catch (err: any) {
      alert(`Error deleting archived booking: ${err.message}.`);
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setBookingToManage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
          <ArchiveBoxIcon className="w-8 h-8 mr-3 text-primary" />
          Archived Bookings
        </h1>
         <button 
            onClick={fetchArchivedBookings} 
            className="px-4 py-2 text-xs font-medium text-primary bg-primary-light hover:bg-primary/20 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Archive'}
          </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>}

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        {isLoading ? (
          <LoadingSpinner text="Loading archived bookings..." />
        ) : archivedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {archivedBookings.map(booking => (
              <div key={booking.id} className="bg-slate-50 p-4 rounded-lg shadow-md border border-slate-200">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-semibold text-slate-700">{booking.serviceName}</h4>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-700">
                        {booking.status}
                    </span>
                </div>
                <p className="text-xs text-slate-600">Client: {booking.clientName}</p>
                <p className="text-xs text-slate-500">Date: {new Date(booking.requestedDate).toLocaleDateString()} at {booking.requestedTime}</p>
                <p className="text-xs text-slate-400">Archived: {new Date(booking.submittedAt).toLocaleString()}</p> {/* This is created_at, should be updated_at if archive has own timestamp */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex space-x-2">
                    <button
                        onClick={() => handleUnarchiveBooking(booking.id)}
                        disabled={isProcessing}
                        className="flex-1 text-xs bg-sky-500 hover:bg-sky-600 text-white font-medium py-1 px-2 rounded-md transition-colors"
                    >
                        Unarchive
                    </button>
                    <button
                        onClick={() => handleDeleteRequest(booking)}
                        disabled={isProcessing}
                        className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md transition-colors"
                    >
                        Delete Permanently
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">No archived bookings found.</p>
        )}
      </div>
      
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => { if (!isProcessing) { setShowDeleteModal(false); setBookingToManage(null); }}}
        title="Confirm Permanent Deletion"
        size="sm"
      >
        <p className="text-slate-600 mb-4">
          Are you sure you want to permanently delete the archived booking for <strong className="text-slate-800">{bookingToManage?.clientName}</strong>?
        </p>
        <p className="text-xs text-red-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => { setShowDeleteModal(false); setBookingToManage(null); }}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteBooking}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 'Delete Permanently'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminArchivedBookingsPage;

