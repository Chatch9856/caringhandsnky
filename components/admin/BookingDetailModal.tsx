
import React from 'react';
import Modal from '../Modal'; 
import { AdminBooking, BookingStatus } from '../../types';
import { CalendarDays, User, Clock4, Settings2 } from 'lucide-react';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AdminBooking | null;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'text-yellow-700';
      case BookingStatus.APPROVED: return 'text-green-700';
      case BookingStatus.REJECTED: return 'text-red-700';
      case BookingStatus.COMPLETED: return 'text-blue-700';
      case BookingStatus.CANCELLED: return 'text-slate-700';
      default: return 'text-gray-700';
    }
  };
  
  const getStatusDisplay = (status: BookingStatus) => {
    if (status === BookingStatus.PENDING) return "Pending Approval";
    if (status === BookingStatus.APPROVED) return "Approved & Upcoming";
    return status;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking Details: ${booking.service_name}`}>
      <div className="space-y-3 text-sm text-neutral-dark max-h-[70vh] overflow-y-auto pr-2">
        <p><strong>Booking ID:</strong> {booking.id}</p>
        <p><strong>Status:</strong> <span className={`font-semibold ${getStatusColor(booking.status)}`}>{getStatusDisplay(booking.status)}</span></p>
        
        <div className="pt-2 mt-2 border-t border-slate-200">
            <h5 className="font-semibold text-primary mb-1">Patient Information:</h5>
            <p><User size={16} className="mr-1 inline-block text-primary-light"/> {booking.patient_display_info}</p>
            {booking.patient_id && <p className="text-xs text-slate-500 ml-5">Patient System ID: {booking.patient_id}</p>}
        </div>

        {booking.caregiver_full_name && (
            <div className="pt-2 mt-2 border-t border-slate-200">
                <h5 className="font-semibold text-primary mb-1">Assigned Caregiver:</h5>
                <p><User size={16} className="mr-1 inline-block text-secondary-light"/> {booking.caregiver_full_name}</p>
                {booking.caregiver_id && <p className="text-xs text-slate-500 ml-5">Caregiver System ID: {booking.caregiver_id}</p>}
            </div>
        )}

        <div className="pt-2 mt-2 border-t border-slate-200">
            <h5 className="font-semibold text-primary mb-1">Service & Schedule:</h5>
            <p><Settings2 size={16} className="mr-1 inline-block"/> Service: {booking.service_name}</p>
            <p><CalendarDays size={16} className="mr-1 inline-block"/> Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
            <p><Clock4 size={16} className="mr-1 inline-block"/> Time: {booking.start_time} {booking.end_time ? ` - ${booking.end_time}` : ''}</p>
            {booking.location && <p><strong>Location:</strong> {booking.location}</p>}
        </div>
        
        {booking.notes && (
            <div className="pt-2 mt-2 border-t border-slate-200">
                <h5 className="font-semibold text-primary mb-1">Notes:</h5>
                <p className="whitespace-pre-wrap bg-slate-50 p-2 rounded-md border border-slate-200">{booking.notes}</p>
            </div>
        )}
        
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-200"><em>Record Created: {new Date(booking.created_at).toLocaleString()}</em></p>
      </div>
      <button 
        onClick={onClose} 
        className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md transition-colors transform hover:scale-105 focus:scale-105"
      >
        Close
      </button>
    </Modal>
  );
};

export default BookingDetailModal;
