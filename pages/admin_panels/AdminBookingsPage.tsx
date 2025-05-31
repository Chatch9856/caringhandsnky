
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminBooking, BookingStatus, BookingSubTabType } from '../../types';
import { useToast } from '../../components/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonLoader from '../../components/shared/SkeletonLoader';
import AdminBookingCard from '../../components/admin/AdminBookingCard';
import BookingDetailModal from '../../components/admin/BookingDetailModal';
import { getBookings, updateBookingStatus as apiUpdateBookingStatus } from '../../services/bookingSupabaseService';
import { 
  BOOKINGS_SUB_TAB_LIST_VIEW, BOOKINGS_SUB_TAB_CALENDAR_VIEW, 
  BOOKINGS_SUB_TAB_LOGS, BOOKINGS_SUB_TAB_MANUAL_ENTRY,
  ChevronDownIcon
} from '../../constants';
import { 
  ListOrdered as ListBulletIconLucide, CalendarDays as CalendarSolidIconLucide, 
  ClipboardList as ClipboardListIconLucide, SquarePen as PencilSquareIconLucide,
  RefreshCw as RefreshIconSolidLucide, Search as SearchIconLucide
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import SegmentedControl, { SegmentedControlOption } from '../../components/shared/SegmentedControl';

const AdminBookingsPage: React.FC = () => { // Renamed from AdminBookingsPanel
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
      return;
    }

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    try {
      const updatedBooking = await apiUpdateBookingStatus(bookingId, newStatus);
      if (updatedBooking) {
        addToast(`Booking ${updatedBooking.service_name} status updated to ${newStatus}.`, "success");
        setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      } else {
        addToast("Failed to update booking status. Booking not found or error occurred.", "error");
        setBookings(originalBookings);
      }
    } catch (err: any) {
      addToast(`Error updating booking status: ${err.message}`, "error");
      setBookings(originalBookings);
    }
  };

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBookingForDetail(booking);
    setIsDetailModalOpen(true);
  };

  const filteredAndSearchedBookings = useMemo(() => {
    return bookings.filter(booking => {
      const statusMatch = statusFilter === 'ALL' || booking.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const searchMatch = term === '' ||
        booking.patient_display_info.toLowerCase().includes(term) ||
        booking.service_name.toLowerCase().includes(term) ||
        (booking.caregiver_full_name && booking.caregiver_full_name.toLowerCase().includes(term)) ||
        booking.booking_date.includes(term) ||
        booking.id.toLowerCase().includes(term);
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

  const subTabsOptions: SegmentedControlOption<BookingSubTabType>[] = [
    { value: BOOKINGS_SUB_TAB_LIST_VIEW, label: "List View", icon: <ListBulletIconLucide size={16} /> },
    { value: BOOKINGS_SUB_TAB_CALENDAR_VIEW, label: "Calendar", icon: <CalendarSolidIconLucide size={16} /> },
    { value: BOOKINGS_SUB_TAB_LOGS, label: "Logs", icon: <ClipboardListIconLucide size={16} /> },
    { value: BOOKINGS_SUB_TAB_MANUAL_ENTRY, label: "Manual Entry", icon: <PencilSquareIconLucide size={16} /> },
  ];
  
  const subTabsOptionsWithPotentialDisabled: (SegmentedControlOption<BookingSubTabType> & { disabled?: boolean })[] = subTabsOptions.map(opt =>
    opt.value === BOOKINGS_SUB_TAB_LIST_VIEW ? opt : { ...opt, disabled: true }
  );
  const enabledTabsForControl = subTabsOptionsWithPotentialDisabled.filter(opt => !opt.disabled);


  return (
    <div className="space-y-6"> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-primary-dark">Manage Bookings</h2>
          <p className="text-sm text-neutral-DEFAULT">
            Review, approve, and manage client booking requests and appointments.
          </p>
        </div>
        <SegmentedControl
            options={enabledTabsForControl} 
            selectedValue={activeSubTab}
            onChange={(value) => setActiveSubTab(value)}
            size="sm"
        />
      </div>

      {activeSubTab === BOOKINGS_SUB_TAB_LIST_VIEW && (
        <>
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="relative">
                <label htmlFor="searchTerm" className="block text-xs font-medium text-neutral-dark mb-1">Search Bookings</label>
                <input 
                  type="text" 
                  id="searchTerm" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Patient, Service, ID..."
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
                <SearchIconLucide size={18} className="absolute left-3 top-1/2 -translate-y-1/2 mt-2 text-slate-400 pointer-events-none" />
              </div>
              <div>
                <label htmlFor="statusFilter" className="block text-xs font-medium text-neutral-dark mb-1">Filter by Status</label>
                <select 
                  id="statusFilter" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white transition-colors"
                >
                  <option value="ALL">All Statuses</option>
                  {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s === BookingStatus.PENDING ? "Pending Approval" : s === BookingStatus.APPROVED ? "Approved & Upcoming" : s}</option>)}
                </select>
              </div>
              <button 
                  onClick={fetchBookingsFromService} 
                  className="w-full bg-primary-light hover:bg-primary text-primary-dark hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-150 ease-in-out shadow-sm hover:shadow-md flex items-center justify-center text-sm disabled:opacity-60 transform hover:scale-105 focus:scale-105"
                  disabled={isLoadingBookings}
                  title="Refresh bookings list"
              >
                  <RefreshIconSolidLucide size={16} className={`mr-2 ${isLoadingBookings ? 'animate-spin' : ''}`} /> Sync
              </button>
            </div>
          </div>

          {bookingsError && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm" role="alert">{bookingsError}</div>}
          
          {isLoadingBookings && !bookings.length ? ( 
            <div className="space-y-6">
              <SkeletonLoader type="card" lines={4}/>
              <SkeletonLoader type="card" lines={4}/>
            </div>
          ) : (
            <>
              <BookingSection title="Pending Approval" bookings={pendingBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} isLoading={isLoadingBookings} />
              <BookingSection title="Approved & Upcoming" bookings={approvedBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} isLoading={isLoadingBookings} />
              <BookingSection title="Other Bookings" bookings={otherBookings} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} defaultOpen={false} isLoading={isLoadingBookings} />
            </>
          )}
        </>
      )}
      {[BOOKINGS_SUB_TAB_CALENDAR_VIEW, BOOKINGS_SUB_TAB_LOGS, BOOKINGS_SUB_TAB_MANUAL_ENTRY].includes(activeSubTab as any) && (
          <div className="text-center py-10 p-6 border border-slate-200 rounded-2xl bg-white shadow-lg">
              {activeSubTab === BOOKINGS_SUB_TAB_CALENDAR_VIEW && <CalendarSolidIconLucide size={48} className="text-slate-400 mx-auto mb-4" />}
              {activeSubTab === BOOKINGS_SUB_TAB_LOGS && <ClipboardListIconLucide size={48} className="text-slate-400 mx-auto mb-4" />}
              {activeSubTab === BOOKINGS_SUB_TAB_MANUAL_ENTRY && <PencilSquareIconLucide size={48} className="text-slate-400 mx-auto mb-4" />}
              <h3 className="text-xl font-semibold text-primary-dark mb-2">
              {activeSubTab === BOOKINGS_SUB_TAB_CALENDAR_VIEW ? "Calendar View" : activeSubTab === BOOKINGS_SUB_TAB_LOGS ? "Booking Logs" : "Manual Booking Entry"}
              </h3>
              <p className="text-neutral-DEFAULT">This feature is currently under development.</p>
              <p className="text-sm text-slate-400 mt-2">(Coming Soon)</p>
          </div>
      )}
      
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
  isLoading: boolean;
}

const BookingSection: React.FC<BookingSectionProps> = ({ title, bookings, onUpdateStatus, onViewDetails, defaultOpen = true, isLoading }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => { // Ensure sections like "Pending" are open by default if they have items, or if explicitly set.
    setIsOpen(defaultOpen || (title.toLowerCase().includes("pending approval") && bookings.length > 0));
  }, [defaultOpen, bookings, title]);


  if (isLoading && !bookings.length && title.toLowerCase().includes("pending approval")) { 
    return (
      <div className="mb-6">
        <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="bg-slate-200 h-8 w-1/2 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_,i) => <SkeletonLoader key={i} type="card" lines={3} />)}
            </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0 && !title.toLowerCase().includes("pending approval")) {
     return null;
  }

  return (
    <div className="mb-6">
        <div className="p-4 bg-white rounded-t-2xl shadow-lg border border-slate-200 border-b-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full text-left flex justify-between items-center py-2 text-lg font-semibold text-secondary hover:text-secondary-dark transition-colors"
                title={`Toggle ${title} section visibility`}
                aria-expanded={isOpen}
            >
                <span>{title} ({bookings.length})</span>
                <ChevronDownIcon size={20} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
        </div>
        {isOpen && (
          <div className="p-4 bg-white rounded-b-2xl shadow-lg border border-slate-200 border-t-0">
            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map(booking => (
                    <AdminBookingCard key={booking.id} booking={booking} onUpdateStatus={onUpdateStatus} onViewDetails={onViewDetails} />
                ))}
                </div>
            ) : (
                <p className="text-neutral-DEFAULT text-center py-4">No bookings in this category matching your filters.</p>
            )}
          </div>
        )}
    </div>
  );
};

export default AdminBookingsPage; // Added default export
