import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';
import { NotificationLog, NotificationEventSetting, NotificationType, NotificationMedium, NotificationLogStatus } from '../types';

type DbNotificationLog = Database['public']['Tables']['notification_logs']['Row'];
type DbNotificationLogInsert = Database['public']['Tables']['notification_logs']['Insert'];
type DbNotificationEventSetting = Database['public']['Tables']['notification_event_settings']['Row'];
type DbNotificationEventSettingInsert = Database['public']['Tables']['notification_event_settings']['Insert'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";


// --- Notification Event Settings ---

export const getNotificationEventSettings = async (): Promise<NotificationEventSetting[]> => {
  if (!supabase) {
    console.warn("getNotificationEventSettings: Supabase client not initialized. Returning empty list.");
    return [];
  }
  const { data, error } = await supabase
    .from('notification_event_settings')
    .select('*')
    .order('event_type', { ascending: true });

  if (error) {
    console.error('Error fetching notification event settings:', error);
    throw new Error(`Failed to fetch settings: ${error.message}`);
  }
  return data.map(s => ({...s, event_type: s.event_type as NotificationType })) || [];
};

export const upsertNotificationEventSetting = async (setting: Partial<NotificationEventSetting>): Promise<NotificationEventSetting> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

  const payload: DbNotificationEventSettingInsert = {
    event_type: setting.event_type!, // Assume event_type is always present
    email_enabled: setting.email_enabled === undefined ? false : setting.email_enabled,
    sms_enabled: setting.sms_enabled === undefined ? false : setting.sms_enabled,
    description: setting.description,
    // id and updated_at will be handled by DB or are part of the full setting object for updates
  };
  
  if(setting.id) payload.id = setting.id; // include ID for upsert if it's an update

  const { data, error } = await supabase
    .from('notification_event_settings')
    .upsert(payload)
    .select()
    .single();

  if (error || !data) {
    console.error('Error upserting notification event setting:', error);
    throw new Error(`Failed to save setting: ${error?.message || 'No data returned'}`);
  }
  return { ...data, event_type: data.event_type as NotificationType };
};

// Seed default settings if the table is empty
export const seedDefaultNotificationSettings = async (): Promise<void> => {
    if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

    const defaultSettings: NotificationEventSetting[] = Object.values(NotificationType).map(type => ({
        id: '', // DB will generate
        event_type: type,
        email_enabled: true, // Default to email enabled for most
        sms_enabled: false, // Default to SMS disabled
        description: `${type.replace(/_/g, ' ')} Notifications`,
        updated_at: new Date().toISOString(),
    }));
    
    const { error } = await supabase.from('notification_event_settings').upsert(
      defaultSettings.map(s => ({ // Map to DbNotificationEventSettingInsert
        event_type: s.event_type,
        email_enabled: s.email_enabled,
        sms_enabled: s.sms_enabled,
        description: s.description,
      }))
    );

    if (error) {
        console.error("Error seeding default notification settings:", error);
        // Don't throw, allow app to continue, admin can configure manually
    } else {
        console.log("Default notification settings seeded successfully (or already existed).");
    }
};


// --- Notification Logs ---

export const getNotificationLogs = async (filters: any = {}): Promise<NotificationLog[]> => {
  if (!supabase) {
    console.warn("getNotificationLogs: Supabase client not initialized. Returning empty list.");
    return [];
  }
  // TODO: Implement filters (date range, type, medium, status)
  const { data, error } = await supabase
    .from('notification_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100); // Basic limit for now

  if (error) {
    console.error('Error fetching notification logs:', error);
    throw new Error(`Failed to fetch logs: ${error.message}`);
  }
  return data.map(l => ({
    ...l,
    notification_type: l.notification_type as NotificationType,
    medium: l.medium as NotificationMedium,
    status: l.status as NotificationLogStatus,
  })) || [];
};

// --- Send Notification (Simulated - Logs only) ---

interface SendNotificationPayload {
  userId?: string; // patient_id, caregiver_id, or admin_user_id (can be conceptual)
  email?: string;
  phone?: string;
  data?: Record<string, any>; // Data for template population (e.g., booking_id, patient_name)
  referenceId?: string; // e.g., booking_id, case_id to link the log
}

export const sendNotification = async (
  eventType: NotificationType,
  recipientInfo: SendNotificationPayload
): Promise<void> => {
  if (!supabase) {
    console.warn(`sendNotification (${eventType}): Supabase not initialized. Notification not logged or sent.`);
    return;
  }

  const settings = await getNotificationEventSettings();
  const eventSetting = settings.find(s => s.event_type === eventType);

  if (!eventSetting) {
    console.warn(`No setting found for event type: ${eventType}. Notification not sent.`);
    return;
  }

  const commonLogData = {
    user_id: recipientInfo.userId || null,
    notification_type: eventType,
    reference_id: recipientInfo.referenceId || recipientInfo.data?.bookingId || recipientInfo.data?.caseId || null,
    subject: `Notification: ${eventType.replace(/_/g, ' ')}`, // Generic subject
    body: `Details: ${JSON.stringify(recipientInfo.data || {})}`, // Generic body
  };

  // Simulate Email
  if (eventSetting.email_enabled && recipientInfo.email) {
    // In a real app, this is where you'd call your email service (e.g., Supabase Edge Function, Resend, SendGrid)
    // For now, we just log it.
    console.log(`SIMULATING SEND EMAIL for ${eventType} to ${recipientInfo.email}`);
    await supabase.from('notification_logs').insert({
      ...commonLogData,
      medium: NotificationMedium.EMAIL,
      recipient_contact: recipientInfo.email,
      status: NotificationLogStatus.SENT, // Assume sent for simulation
    } as DbNotificationLogInsert);
  }

  // Simulate SMS
  if (eventSetting.sms_enabled && recipientInfo.phone) {
    // In a real app, call Twilio, etc.
    console.log(`SIMULATING SEND SMS for ${eventType} to ${recipientInfo.phone}`);
     await supabase.from('notification_logs').insert({
      ...commonLogData,
      medium: NotificationMedium.SMS,
      recipient_contact: recipientInfo.phone,
      status: NotificationLogStatus.SENT, // Assume sent for simulation
    } as DbNotificationLogInsert);
  }

  if (!eventSetting.email_enabled && !eventSetting.sms_enabled) {
    console.log(`Notification for ${eventType} is configured but both Email and SMS are disabled.`);
  }
  if (eventSetting.email_enabled && !recipientInfo.email) {
    console.warn(`Email enabled for ${eventType}, but no email provided for recipient.`);
  }
  if (eventSetting.sms_enabled && !recipientInfo.phone) {
    console.warn(`SMS enabled for ${eventType}, but no phone provided for recipient.`);
  }
};
