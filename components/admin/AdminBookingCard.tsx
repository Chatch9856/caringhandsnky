import React from 'react';
import { AdminBooking, BookingStatus } from '../../types';
import { CalendarIcon, PersonIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CogIcon } from '../../constants';

interface AdminBookingCardProps {
  booking: AdminBooking;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onViewDetails: (booking: AdminBooking) => void;
}

const AdminBookingCard: React.FC<AdminBookingCardProps> = ({ booking, onUpdateStatus, onViewDetails }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.APPROVED: return 'bg-green-100 text-green-700';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-700';
      case BookingStatus.COMPLETED: return 'bg-blue-100 text-blue-700';
      case BookingStatus.CANCELLED: return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status: BookingStatus) => {
    if (status === BookingStatus.PENDING) return "Pending Approval";
    if (status === BookingStatus.APPROVED) return "Approved & Upcoming";
    return status;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-primary">{booking.service_name}</h4>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {getStatusDisplay(booking.status)}
        </span>
      </div>
      <div className="text-sm text-neutral-DEFAULT space-y-1 mb-3">
        <p className="flex items-center"><PersonIcon className="w-4 h-4 mr-2 text-primary-light" /> {booking.patient_display_info}</p>
        {booking.caregiver_full_name && <p className="flex items-center"><PersonIcon className="w-4 h-4 mr-2 text-secondary-light" /> Caregiver: {booking.caregiver_full_name}</p>}
        <p className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-primary-light" /> {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}{booking.end_time ? ` - ${booking.end_time}` : ''}</p>
        {booking.location && <p><strong>Location:</strong> {booking.location}</p>}
        {booking.notes && <p className="text-xs italic"><strong>Notes Summary:</strong> {booking.notes.substring(0, 50)}{booking.notes.length > 50 ? '...' : ''}</p>}
        <p className="text-xs text-slate-400">Created: {new Date(booking.created_at).toLocaleString()}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button
            onClick={() => onViewDetails(booking)}
            className="flex items-center bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
            title="View full booking details"
        >
            <CogIcon className="w-4 h-4 mr-1"/> Details
        </button>
        {booking.status === BookingStatus.PENDING && (
          <>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.APPROVED)}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve
            </button>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.REJECTED)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
            >
              <XCircleIcon className="w-4 h-4 mr-1" /> Reject
            </button>
          </>
        )}
       {booking.status === BookingStatus.APPROVED && (
          <>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.COMPLETED)}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
            >
              <ClockIcon className="w-4 h-4 mr-1"/> Mark Completed
            </button>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
            >
               <XCircleIcon className="w-4 h-4 mr-1" /> Cancel Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookingCard;