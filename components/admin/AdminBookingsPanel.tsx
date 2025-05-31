
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminBooking, BookingStatus, BookingSubTabType } from '../../types';
import { useToast } from '../ToastContext';
import TabButton from '../TabButton';
import LoadingSpinner from '../LoadingSpinner';
import AdminBookingCard from './AdminBookingCard';
import BookingDetailModal from './BookingDetailModal';
import { getBookings, updateBookingStatus as apiUpdateBookingStatus } from '../../services/bookingSupabaseService';
import { 
  BOOKINGS_SUB_TAB_LIST_VIEW, BOOKINGS_SUB_TAB_CALENDAR_VIEW, 
  BOOKINGS_SUB_TAB_LOGS, BOOKINGS_SUB_TAB_MANUAL_ENTRY,
  ListBulletIcon, CalendarSolidIcon, ClipboardListIcon, PencilSquareIcon,
  RefreshIconSolid, CheckCircleIcon, XCircleIcon, ClockIcon
} from '../../constants';
import { supabase } from '../../supabaseClient'; // Import supabase

const AdminBookingsPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BookingSubTabType>(BOOKINGS_SUB_TAB_LIST_VIEW);
  const { addToast } = useToast();

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<AdminBooking | null>(null);

  const fetchBookingsFromService = useCallback(async () => {
    setIsLoadingBookings(true);
    setBookingsError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err: any) {
      setBookingsError(`Failed to load bookings: ${err.message}`);
      addToast(`Failed to load bookings: ${err.message}`, "error");
    } finally {
      setIsLoadingBookings(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (activeSubTab === BOOKINGS_SUB_TAB_LIST_VIEW) {
      fetchBookingsFromService();
    }
  }, [activeSubTab, fetchBookingsFromService]);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const originalBookings = [...bookings];
    if (!supabase) {
      addToast("Cannot update booking status: Database connection is not configured. Please contact support.", "error");
      // No need to setBookings(originalBookings) here as optimistic update hasn't happened yet.
      return;
    }

    // Optimistic update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    try {
      const updatedBooking = await apiUpdateBookingStatus(bookingId, newStatus);
      if (updatedBooking) {
        addToast(`Booking ${updatedBooking.service_name} status updated to ${newStatus}.`, "success");
        // Refresh with data from server
        setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      } else {
        addToast("Failed to update booking status. Booking not found or error occurred.", "error");
        setBookings(originalBookings); // Revert
      }
    } catch (err: any) {
      addToast(`Error updating booking status: ${err.message}`, "error");
      setBookings(originalBookings); // Revert
    }
  };

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBookingForDetail(booking);
    setIsDetailModalOpen(true);
  };

  const filteredAndSearchedBookings = useMemo(() => {
    return bookings.filter(booking => {
      const statusMatch = statusFilter === 'ALL' || booking.status === statusFilter;
      const searchMatch = searchTerm === '' ||
        booking.patient_display_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.caregiver_full_name && booking.caregiver_full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        booking.booking_date.includes(searchTerm); // Simple date search (YYYY-MM-DD)
      return statusMatch && searchMatch;
    });
  }, [bookings, statusFilter, searchTerm]);

  const pendingBookings = filteredAndSearchedBookings.filter(b => b.status === BookingStatus.PENDING);
  const approvedBookings = filteredAndSearchedBookings.filter(b => b.status === BookingStatus.APPROVED);
  const otherBookings = filteredAndSearchedBookings.filter(b => 
    b.status === BookingStatus.COMPLETED || 
    b.status === BookingStatus.REJECTED || 
    b.status === BookingStatus.CANCELLED
  );

  const subTabs = [
    { id: BOOKINGS_SUB_TAB_LIST_VIEW, label: "List View", icon: <ListBulletIcon className="w-5 h-5" /> },
    { id: BOOKINGS_SUB_TAB_CALENDAR_VIEW, label: "Calendar View", icon: <CalendarSolidIcon className="w-5 h-5" />, disabled: true },
    { id: BOOKINGS_SUB_TAB_LOGS, label: "Booking Logs", icon: <ClipboardListIcon className="w-5 h-5" />, disabled: true },
    { id: BOOKINGS_SUB_TAB_MANUAL_ENTRY, label: "Manual Entry", icon: <PencilSquareIcon className="w-5 h-5" />, disabled: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-primary-dark mb-1">Manage Bookings</h2>
        <p className="text-sm text-neutral-DEFAULT mb-4">
          Review, approve, and manage client booking requests and appointments.
        </p>
      </div>

      <div className="mb-0 border-b border-slate-200 px-2 md:px-4">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-0">
          {subTabs.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeSubTab === tab.id}
              onClick={() => setActiveSubTab(tab.id as BookingSubTabType)}
              icon={tab.icon}
              disabled={tab.disabled}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === BOOKINGS_SUB_TAB_LIST_VIEW && (
          <>
            <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-neutral-dark">Filter by Status</label>
                  <select 
                    id="statusFilter" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s === BookingStatus.PENDING ? "Pending Approval" : s === BookingStatus.APPROVED ? "Approved & Upcoming" : s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-dark">Search</label>
                  <input 
                    type="text" 
                    id="searchTerm" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Patient, Service, Caregiver, Date..."
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div className="md:self-end">
                    <button 
                        onClick={fetchBookingsFromService} 
                        className="w-full bg-primary-light hover:bg-primary text-primary-dark hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center text-sm"
                        disabled={isLoadingBookings}
                        title="Refresh bookings list"
                    >
                        <RefreshIconSolid className={`w-4 h-4 mr-2 ${isLoadingBookings ? 'animate-spin' : ''}`} /> Sync Bookings
                    </button>
                </div>
              </div>
            </div>

            {bookingsError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-4" role="alert">{bookingsError}</div>}
            {isLoadingBookings ? <LoadingSpinner text="Loading bookings..." /> : (
              <>
                <BookingSection title="Pending Approval" bookings={pendingBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} />
                <BookingSection title="Approved & Upcoming" bookings={approvedBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} />
                <BookingSection title="Other Bookings (Completed, Rejected, Cancelled)" bookings={otherBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} defaultOpen={false} />
              </>
            )}
          </>
        )}
        {[BOOKINGS_SUB_TAB_CALENDAR_VIEW, BOOKINGS_SUB_TAB_LOGS, BOOKINGS_SUB_TAB_MANUAL_ENTRY].includes(activeSubTab as any) && (
            <div className="text-center py-10 p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
                {activeSubTab === BOOKINGS_SUB_TAB_CALENDAR_VIEW && <CalendarSolidIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
                {activeSubTab === BOOKINGS_SUB_TAB_LOGS && <ClipboardListIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
                {activeSubTab === BOOKINGS_SUB_TAB_MANUAL_ENTRY && <PencilSquareIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                {activeSubTab === BOOKINGS_SUB_TAB_CALENDAR_VIEW ? "Calendar View" : activeSubTab === BOOKINGS_SUB_TAB_LOGS ? "Booking Logs" : "Manual Booking Entry"}
                </h3>
                <p className="text-neutral-DEFAULT">
                This feature is currently under development.
                </p>
                <p className="text-sm text-slate-400 mt-2">(Coming Soon)</p>
            </div>
        )}
      </div>
      {selectedBookingForDetail && (
        <BookingDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          booking={selectedBookingForDetail}
        />
      )}
    </div>
  );
};

interface BookingSectionProps {
  title: string;
  bookings: AdminBooking[];
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onViewDetails: (booking: AdminBooking) => void;
  defaultOpen?: boolean;
}

const BookingSection: React.FC<BookingSectionProps> = ({ title, bookings, onUpdateStatus, onViewDetails, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (bookings.length === 0 && !title.toLowerCase().includes("pending")) {
     return null; // Don't show empty sections unless it's pending
  }

  return (
    <div className="mb-8 bg-white p-0 md:p-4 rounded-xl shadow-sm border border-slate-100">
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full text-left flex justify-between items-center py-3 px-2 md:px-4 text-lg font-semibold text-secondary hover:text-secondary-dark transition-colors"
            title={`Toggle ${title} section visibility`}
            aria-expanded={isOpen}
        >
            <span>{title} ({bookings.length})</span>
            <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true">▼</span>
        </button>
        {isOpen && (
          bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 px-2 md:px-0 pb-2">
              {bookings.map(booking => (
                <AdminBookingCard key={booking.id} booking={booking} onUpdateStatus={onUpdateStatus} onViewDetails={onViewDetails} />
              ))}
            </div>
          ) : (
             <p className="text-neutral-DEFAULT p-4 text-center mt-2">No bookings in this category matching your filters.</p>
          )
        )}
    </div>
  );
};


export default AdminBookingsPanel;
