import React, { useState } from 'react';
import { BookingRequest, BookingStatus } from '../types';
import { CalendarIcon, PersonIcon } from '../constants';

interface BookingRequestCardProps {
  booking: BookingRequest;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>; // Make onUpdateStatus return a Promise
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({ booking, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as BookingStatus);
  };

  const handleUpdateClick = async () => {
    if (selectedStatus === booking.status) return; // No change
    setIsUpdating(true);
    try {
      await onUpdateStatus(booking.id, selectedStatus);
      // If onUpdateStatus is successful, the parent will re-fetch and re-render.
      // The selectedStatus in this component will be updated via props when booking.status changes.
    } catch (error) {
      // Error is handled by parent, selectedStatus remains as is for user to retry or change.
      console.error("Update failed on card:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update local selectedStatus if booking.status prop changes from parent (after successful fetch)
  React.useEffect(() => {
    setSelectedStatus(booking.status);
  }, [booking.status]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
      <div>
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
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="block w-full py-1.5 px-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs bg-white disabled:bg-slate-50"
          disabled={isUpdating}
          aria-label={`Update status for booking ${booking.id}`}
        >
          {Object.values(BookingStatus).map(statusValue => (
            <option key={statusValue} value={statusValue}>
              {statusValue}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateClick}
          disabled={selectedStatus === booking.status || isUpdating}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default BookingRequestCard;