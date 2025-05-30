
import React, { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationStatus, NotificationType } from '../../types';
import { supabase as supabaseClient } from '../../services/supabaseClient'; 
import LoadingSpinner from '../../components/LoadingSpinner';
import { BellIcon, CheckCircleIcon, ArchiveBoxIcon } from '../../constants';

const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationStatus | 'All'>('All');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabaseClient.from('notifications').select('*').order('createdAt', { ascending: false });
      if (filter !== 'All') {
        query = query.eq('status', filter);
      }
      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setNotifications(data || []);
    } catch (err: any) {
      setError(`Failed to load notifications: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const updateNotificationStatus = async (id: string, newStatus: NotificationStatus) => {
    try {
      const { error: updateError } = await supabaseClient
        .from('notifications')
        .update({ status: newStatus })
        .eq('id', id);
      if (updateError) throw updateError;
      // Refresh list or update local state
      setNotifications(prev => prev.map(n => n.id === id ? {...n, status: newStatus} : n).filter(n => filter === 'All' || n.status === filter || (filter === NotificationStatus.UNREAD && newStatus !== NotificationStatus.UNREAD && n.id === id ? false: true) ) );
       if(filter !== 'All' && newStatus !== filter) { // if we changed status and current filter doesn't match new status, remove it from list
           setNotifications(prev => prev.filter(n => n.id !== id));
       }


    } catch (err: any) {
      alert(`Error updating notification: ${err.message}`);
    }
  };
  
  const getNotificationTypeStyle = (type: NotificationType) => {
    switch(type) {
      case NotificationType.NEW_BOOKING_ADMIN: return "bg-blue-50 border-blue-300";
      case NotificationType.NEW_USER_ADMIN: return "bg-green-50 border-green-300";
      case NotificationType.BOOKING_CONFIRMATION_PATIENT: return "bg-sky-50 border-sky-300";
      case NotificationType.BOOKING_STATUS_UPDATE_PATIENT: return "bg-indigo-50 border-indigo-300";
      default: return "bg-slate-50 border-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
        <BellIcon className="w-8 h-8 mr-3 text-primary" />
        Notification Logs
      </h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p>{error}</p></div>}

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-2 mb-4">
            {(['All', ...Object.values(NotificationStatus)] as (NotificationStatus | 'All')[]).map(statusFilter => (
                 <button 
                    key={statusFilter}
                    onClick={() => setFilter(statusFilter)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors
                        ${filter === statusFilter ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </button>
            ))}
        </div>

        {isLoading ? (
          <LoadingSpinner text="Loading notifications..." />
        ) : notifications.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-3 sm:p-4 border-l-4 rounded-r-lg shadow-sm ${getNotificationTypeStyle(notif.type)}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800">{notif.title}</h3>
                  <span className="text-xs text-slate-500 mt-1 sm:mt-0">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-2 whitespace-pre-wrap break-words">{notif.message}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${notif.status === NotificationStatus.UNREAD ? 'bg-yellow-400 text-yellow-800' : 'bg-slate-200 text-slate-600'}`}>{notif.status}</span>
                  <span className="text-slate-400">Type: {notif.type}</span>
                  {notif.recipientEmail && <span className="text-slate-400">To: {notif.recipientEmail}</span>}
                  {notif.data?.bookingId && <span className="text-slate-400">Booking ID: {notif.data.bookingId}</span>}
                  
                  <div className="sm:ml-auto flex gap-2 mt-2 sm:mt-0">
                  {notif.status === NotificationStatus.UNREAD && (
                    <button onClick={() => updateNotificationStatus(notif.id, NotificationStatus.READ)} className="text-green-600 hover:text-green-800" title="Mark as Read">
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  {notif.status !== NotificationStatus.ARCHIVED && (
                     <button onClick={() => updateNotificationStatus(notif.id, NotificationStatus.ARCHIVED)} className="text-slate-500 hover:text-slate-700" title="Archive">
                        <ArchiveBoxIcon className="w-4 h-4" />
                    </button>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">No notifications found for the selected filter.</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
