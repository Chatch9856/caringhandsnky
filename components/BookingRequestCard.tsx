
import React from 'react';
import { BookingRequest, BookingStatus } from '../types';
import { CalendarIcon, PersonIcon, CheckCircleIcon, XCircleIcon } from '../constants';

interface BookingRequestCardProps {
  booking: BookingRequest;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({ booking, onUpdateStatus }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.APPROVED: return 'bg-green-100 text-green-700';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-700';
      case BookingStatus.COMPLETED: return 'bg-blue-100 text-blue-700';
      case BookingStatus.CANCELLED: return 'bg-gray-100 text-gray-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"> {/* Standardized card styling */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-primary">{booking.serviceName}</h4>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className="text-sm text-neutral-DEFAULT space-y-1 mb-3">
        <p className="flex items-center"><PersonIcon className="w-4 h-4 mr-2 text-primary-light" /> {booking.clientName} ({booking.clientEmail}, {booking.clientPhone})</p>
        <p className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-primary-light" /> {new Date(booking.requestedDate).toLocaleDateString()} at {booking.requestedTime}</p>
        <p><strong>Address:</strong> {booking.address}</p>
        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
        <p className="text-xs text-slate-400">Submitted: {new Date(booking.submittedAt).toLocaleString()}</p>
      </div>
      
      {booking.status === BookingStatus.PENDING && (
        <div className="flex space-x-2 mt-4">
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
        </div>
      )}
       {(booking.status === BookingStatus.APPROVED) && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onUpdateStatus(booking.id, BookingStatus.COMPLETED)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
          >
            Mark Completed
          </button>
           <button
            onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
            className="flex items-center bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingRequestCard;