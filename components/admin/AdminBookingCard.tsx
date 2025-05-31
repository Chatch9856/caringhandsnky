
import React from 'react';
import { AdminBooking, BookingStatus } from '../../types';
import { CalendarDays, User, CheckCircle2, XCircle, Clock4, Settings2 } from 'lucide-react'; // Lucide icons

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
      case BookingStatus.CANCELLED: return 'bg-slate-200 text-slate-700'; // Using slate for cancelled
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status: BookingStatus) => {
    if (status === BookingStatus.PENDING) return "Pending Approval";
    if (status === BookingStatus.APPROVED) return "Approved"; // Simplified for card display
    return status;
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between min-h-[260px]">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-md font-semibold text-primary leading-tight">{booking.service_name}</h4>
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getStatusColor(booking.status)}`}>
            {getStatusDisplay(booking.status)}
          </span>
        </div>
        <div className="text-xs text-neutral-DEFAULT space-y-1.5 mb-3">
          <p className="flex items-center"><User size={14} className="mr-2 text-primary-light flex-shrink-0" /> {booking.patient_display_info}</p>
          {booking.caregiver_full_name && <p className="flex items-center"><User size={14} className="mr-2 text-secondary-light flex-shrink-0" /> CG: {booking.caregiver_full_name}</p>}
          <p className="flex items-center"><CalendarDays size={14} className="mr-2 text-primary-light flex-shrink-0" /> {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}{booking.end_time ? ` - ${booking.end_time}` : ''}</p>
          {booking.location && <p className="text-xs"><strong>Loc:</strong> {booking.location}</p>}
          {booking.notes && <p className="text-xs italic text-slate-500 truncate" title={booking.notes}><strong>Notes:</strong> {booking.notes}</p>}
          <p className="text-xs text-slate-400 pt-1">Created: {new Date(booking.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-100">
        <button
            onClick={() => onViewDetails(booking)}
            className="flex items-center bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium py-1.5 px-2.5 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105"
            title="View full booking details"
        >
            <Settings2 size={14} className="mr-1"/> Details
        </button>
        {booking.status === BookingStatus.PENDING && (
          <>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.APPROVED)}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1.5 px-2.5 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105"
            >
              <CheckCircle2 size={14} className="mr-1" /> Approve
            </button>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.REJECTED)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 px-2.5 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105"
            >
              <XCircle size={14} className="mr-1" /> Reject
            </button>
          </>
        )}
       {booking.status === BookingStatus.APPROVED && (
          <>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.COMPLETED)}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-2.5 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105"
            >
              <Clock4 size={14} className="mr-1"/> Complete
            </button>
            <button
              onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
              className="flex items-center bg-slate-500 hover:bg-slate-600 text-white text-xs font-medium py-1.5 px-2.5 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105"
            >
               <XCircle size={14} className="mr-1" /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookingCard;
