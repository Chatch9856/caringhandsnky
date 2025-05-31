import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../ToastContext';
import LoadingSpinner from '../../LoadingSpinner';
import { supabase } from '../../../supabaseClient';
import { 
  NotificationEventSetting, NotificationType, 
  NotificationLog, NotificationLogStatus, NotificationMedium 
} from '../../../types';
import { 
  getNotificationEventSettings, upsertNotificationEventSetting, 
  getNotificationLogs, seedDefaultNotificationSettings 
} from '../../../services/notificationService';
import { BellIcon, ListBulletIcon, RefreshIconSolid } from '../../../constants';

const NotificationSettingsPanel: React.FC = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<NotificationEventSetting[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSavingSetting, setIsSavingSetting] = useState<Record<string, boolean>>({});

  const fetchSettings = useCallback(async () => {
    if (!supabase) {
      addToast("Notification settings unavailable: Database not connected.", "error");
      setIsLoadingSettings(false);
      return;
    }
    setIsLoadingSettings(true);
    try {
      let eventSettings = await getNotificationEventSettings();
      if (eventSettings.length === 0) {
        // Attempt to seed default settings if none exist
        addToast("No notification settings found, attempting to initialize defaults...", "info");
        await seedDefaultNotificationSettings();
        eventSettings = await getNotificationEventSettings();
        if (eventSettings.length > 0) {
          addToast("Default notification settings initialized.", "success");
        } else {
          addToast("Failed to initialize default settings. Please configure manually or check logs.", "error");
        }
      }
      setSettings(eventSettings);
    } catch (error: any) {
      addToast(`Error fetching notification settings: ${error.message}`, 'error');
    } finally {
      setIsLoadingSettings(false);
    }
  }, [addToast]);

  const fetchLogs = useCallback(async () => {
    if (!supabase) {
        // Don't show error for logs if DB not connected, as settings are primary
        setIsLoadingLogs(false);
        return;
    }
    setIsLoadingLogs(true);
    try {
      const logData = await getNotificationLogs({}); // Add filters later
      setLogs(logData);
    } catch (error: any) {
      addToast(`Error fetching notification logs: ${error.message}`, 'error');
    } finally {
      setIsLoadingLogs(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, [fetchSettings, fetchLogs]);

  const handleToggleChange = async (eventType: NotificationType | string, medium: 'email' | 'sms', enabled: boolean) => {
    if (!supabase) {
      addToast("Cannot save setting: Database not connected.", "error");
      return;
    }
    const settingToUpdate = settings.find(s => s.event_type === eventType);
    if (!settingToUpdate) return;

    setIsSavingSetting(prev => ({ ...prev, [eventType + medium]: true }));
    try {
      const updatedSetting: Partial<NotificationEventSetting> = {
        event_type: eventType,
        email_enabled: medium === 'email' ? enabled : settingToUpdate.email_enabled,
        sms_enabled: medium === 'sms' ? enabled : settingToUpdate.sms_enabled,
      };
      // If settingToUpdate has an id, it's an update, otherwise it's an insert (though seed should handle inserts)
      if(settingToUpdate.id) updatedSetting.id = settingToUpdate.id;

      await upsertNotificationEventSetting(updatedSetting as NotificationEventSetting);
      setSettings(prev => prev.map(s => s.event_type === eventType ? { ...s, ...updatedSetting } : s));
      addToast(`${eventType} ${medium.toUpperCase()} notifications ${enabled ? 'enabled' : 'disabled'}.`, 'success');
    } catch (error: any) {
      addToast(`Error updating setting: ${error.message}`, 'error');
    } finally {
      setIsSavingSetting(prev => ({ ...prev, [eventType + medium]: false }));
    }
  };
  
  const getStatusColor = (status: NotificationLogStatus | string) => {
    switch (status) {
      case NotificationLogStatus.SENT:
      case NotificationLogStatus.DELIVERED:
        return 'bg-green-100 text-green-700';
      case NotificationLogStatus.FAILED:
        return 'bg-red-100 text-red-700';
      case NotificationLogStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Event Configuration Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-xl font-semibold text-primary-dark mb-4 flex items-center">
          <BellIcon className="w-6 h-6 mr-2" /> Notification Event Settings
        </h3>
        {isLoadingSettings ? <LoadingSpinner text="Loading settings..." /> : (
          settings.length === 0 && !supabase ? 
          <p className="text-center text-red-500 py-4">Notification settings are unavailable: Database not connected.</p> :
          settings.length === 0 ?
          <p className="text-center text-neutral-500 py-4">No notification types configured. System might need initialization.</p> :
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {settings.map(setting => (
              <div key={setting.event_type} className="p-4 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <h4 className="font-medium text-neutral-700">{setting.description || setting.event_type.replace(/_/g, ' ')}</h4>
                <p className="text-xs text-neutral-500 mb-2">{setting.event_type}</p>
                <div className="flex space-x-6 items-center">
                  <label htmlFor={`email-${setting.event_type}`} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`email-${setting.event_type}`}
                      checked={setting.email_enabled}
                      onChange={(e) => handleToggleChange(setting.event_type, 'email', e.target.checked)}
                      disabled={isSavingSetting[setting.event_type + 'email']}
                      className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                  <label htmlFor={`sms-${setting.event_type}`} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`sms-${setting.event_type}`}
                      checked={setting.sms_enabled}
                      onChange={(e) => handleToggleChange(setting.event_type, 'sms', e.target.checked)}
                      disabled={isSavingSetting[setting.event_type + 'sms']}
                      className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm">SMS</span>
                  </label>
                  {(isSavingSetting[setting.event_type + 'email'] || isSavingSetting[setting.event_type + 'sms']) && <LoadingSpinner size="sm" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Logs Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-primary-dark flex items-center">
              <ListBulletIcon className="w-6 h-6 mr-2" /> Notification Logs
            </h3>
            <button 
                onClick={fetchLogs} 
                disabled={isLoadingLogs || !supabase}
                className="text-sm bg-primary-light hover:bg-primary text-primary-dark hover:text-white font-semibold py-1.5 px-3 rounded-lg transition-colors shadow-sm flex items-center disabled:opacity-50"
                title="Refresh logs"
            >
               <RefreshIconSolid className={`w-4 h-4 mr-1.5 ${isLoadingLogs ? 'animate-spin' : ''}`} /> Sync Logs
            </button>
        </div>
        {isLoadingLogs ? <LoadingSpinner text="Loading logs..." /> : (
          !supabase ? <p className="text-center text-red-500 py-4">Notification logs unavailable: Database not connected.</p> :
          logs.length === 0 ? <p className="text-center text-neutral-500 py-4">No notification logs found.</p> :
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  {["Timestamp", "Type", "Medium", "Recipient", "Status", "Subject/Ref"].map(header => (
                     <th key={header} scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors text-xs">
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-600">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-600">{log.notification_type.replace(/_/g, ' ')}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-600">{log.medium}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-600" title={log.recipient_contact}>{log.recipient_contact.length > 25 ? log.recipient_contact.substring(0,22) + '...' : log.recipient_contact }</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>{log.status}</span>
                    </td>
                    <td className="px-3 py-2 text-neutral-600 max-w-xs truncate" title={log.subject || log.reference_id || undefined}>{log.subject || log.reference_id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPanel;