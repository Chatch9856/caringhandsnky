
import React, { useState, useEffect } from 'react';
import { BookingRequest, BookingStatus } from '../types';
import { CalendarIcon, PersonIcon, CheckCircleIcon, ArchiveBoxIcon, TrashIcon } from '../constants';

interface BookingRequestCardProps {
  booking: BookingRequest;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>; // New prop for delete
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({ booking, onUpdateStatus, onDeleteBooking }) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Delete confirmation handled by parent page

  useEffect(() => {
    setSelectedStatus(booking.status);
  }, [booking.status]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.APPROVED: return 'bg-green-100 text-green-800';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case BookingStatus.CANCELLED: return 'bg-gray-200 text-gray-800';
      case BookingStatus.ARCHIVED: return 'bg-slate-200 text-slate-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as BookingStatus);
  };

  const handleUpdateStatusAction = async (newStatus: BookingStatus) => {
    if (newStatus === booking.status && newStatus !== selectedStatus) {
        // if selectedStatus is different but we are directly clicking a button
        // like "Complete", then force update.
    } else if (newStatus === booking.status) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(booking.id, newStatus);
      setSelectedStatus(newStatus); // Optimistically update local select if direct action button
    } catch (error) {
      console.error("Update failed on card for status:", newStatus, error);
      // Error handled by parent, local selectedStatus might revert via prop update or stay for retry
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleMainStatusUpdateClick = async () => {
    if (selectedStatus === booking.status) return; // No change from dropdown
    await handleUpdateStatusAction(selectedStatus);
  };


  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-slate-200 flex flex-col justify-between transition-shadow hover:shadow-2xl">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
          <h4 className="text-lg font-semibold text-primary mb-1 sm:mb-0">{booking.serviceName}</h4>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(booking.status)} whitespace-nowrap`}>
            {booking.status}
          </span>
        </div>
        <div className="text-sm text-neutral-DEFAULT space-y-1.5 mb-3">
          <p className="flex items-center"><PersonIcon className="w-4 h-4 mr-2 text-primary-light flex-shrink-0" /> <span className="truncate" title={`${booking.clientName} (${booking.clientEmail}, ${booking.clientPhone})`}>{booking.clientName} ({booking.clientEmail})</span></p>
          <p className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-primary-light flex-shrink-0" /> {new Date(booking.requestedDate).toLocaleDateString()} at {booking.requestedTime}</p>
          <p><strong>Address:</strong> <span className="text-slate-600">{booking.address}</span></p>
          {booking.notes && <p className="text-xs"><strong>Notes:</strong> <span className="text-slate-500 italic">{booking.notes}</span></p>}
          <p className="text-xs text-slate-400 pt-1">Submitted: {new Date(booking.submittedAt).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-3 space-y-2">
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="block w-full py-1.5 px-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-xs bg-white disabled:bg-slate-50"
            disabled={isUpdating || booking.status === BookingStatus.ARCHIVED}
            aria-label={`Update status for booking ${booking.id}`}
          >
            {Object.values(BookingStatus).filter(s => s !== BookingStatus.ARCHIVED).map(statusValue => ( // Don't allow direct change to Archived via dropdown
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
             {booking.status === BookingStatus.ARCHIVED && <option value={BookingStatus.ARCHIVED}>Archived</option> }
          </select>
          <button
            onClick={handleMainStatusUpdateClick}
            disabled={selectedStatus === booking.status || isUpdating || booking.status === BookingStatus.ARCHIVED}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? '...' : 'Set'}
          </button>
        </div>
        {booking.status !== BookingStatus.ARCHIVED && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            { ![BookingStatus.COMPLETED, BookingStatus.REJECTED, BookingStatus.CANCELLED].includes(booking.status) && (
                 <button
                    onClick={() => handleUpdateStatusAction(BookingStatus.COMPLETED)}
                    disabled={isUpdating}
                    className="flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-2 rounded-md transition-colors disabled:opacity-50"
                    title="Mark as Completed"
                >
                    <CheckCircleIcon className="w-3.5 h-3.5"/> <span>Complete</span>
                </button>
            )}
            <button
              onClick={() => handleUpdateStatusAction(BookingStatus.ARCHIVED)}
              disabled={isUpdating}
              className="flex items-center justify-center space-x-1 bg-slate-500 hover:bg-slate-600 text-white font-semibold py-1.5 px-2 rounded-md transition-colors disabled:opacity-50"
              title="Archive Booking"
            >
              <ArchiveBoxIcon className="w-3.5 h-3.5"/> <span>Archive</span>
            </button>
            <button
              onClick={() => onDeleteBooking(booking.id)} // Parent handles confirmation
              disabled={isUpdating}
              className="flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-2 rounded-md transition-colors disabled:opacity-50"
              title="Delete Booking"
            >
              <TrashIcon className="w-3.5 h-3.5"/> <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequestCard;
