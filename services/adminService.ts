
import { PaymentMethod, SiteContent, AdminSetting, AdminSettingKey, SiteContentType } from '../types';
import { INITIAL_PAYMENT_METHODS } from '../constants';
import { supabase } from './supabaseClient'; // Assuming supabase client is configured

const PAYMENT_SETTINGS_DB_KEY = AdminSettingKey.PAYMENT_METHODS_CONFIG; // Specific key for payment methods in admin_settings
const SITE_CONTENT_TABLE = 'site_content';
const ADMIN_SETTINGS_TABLE = 'admin_settings';

// --- Payment Settings ---
export const getPaymentSettings = async (): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from(ADMIN_SETTINGS_TABLE)
      .select('value')
      .eq('settingKey', PAYMENT_SETTINGS_DB_KEY)
      .single();

    if (error) {
      // PGRST116: single row not found (no setting saved yet) - this is fine.
      // 42P01: table not found (admin_settings table doesn't exist) - also fine for initial setup, use defaults.
      if (error.code !== 'PGRST116' && error.code !== '42P01') {
        console.error(`Supabase error fetching payment settings (code: ${error.code}):`, JSON.stringify(error, null, 2));
        // For other unexpected errors, proceed to return defaults.
      }
      // If the error is PGRST116 or 42P01, data will be null.
      // We proceed to the logic that handles null data and returns defaults.
      // No specific console.error for these cases to keep console clean during setup.
    }

    if (data && data.value) {
      const parsedSettings = data.value as PaymentMethod[];
      // Merge with INITIAL_PAYMENT_METHODS to ensure all gateways are present and new ones get defaults
      const mergedSettings = INITIAL_PAYMENT_METHODS.map(initialMethod => {
        const storedVersion = parsedSettings.find(p => p.id === initialMethod.id);
        return storedVersion ? { ...initialMethod, ...storedVersion } : initialMethod; // Ensure all initial props + stored ones
      });
      return mergedSettings;
    }
  } catch (processError: any) { // This outer catch is for other unexpected errors during processing, not Supabase client errors handled above.
    console.error("Error processing payment settings (e.g., parsing):", JSON.stringify(processError, null, 2));
  }
  // Return a deep copy of initial settings if nothing stored or error
  return INITIAL_PAYMENT_METHODS.map(p => ({ ...p }));
};

export const savePaymentSettings = async (settings: PaymentMethod[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from(ADMIN_SETTINGS_TABLE)
      .upsert({ settingKey: PAYMENT_SETTINGS_DB_KEY, value: settings }, { onConflict: 'settingKey' });

    if (error) {
      if (error.code === '42P01') {
        console.error(`Cannot save payment settings: The '${ADMIN_SETTINGS_TABLE}' table does not exist in Supabase. Please create it. Details: ${JSON.stringify(error, null, 2)}`);
      } else {
        console.error(`Supabase error saving payment settings (code: ${error.code}):`, JSON.stringify(error, null, 2));
      }
      throw error;
    }
    console.log("Payment settings saved to Supabase.");
  } catch (error) { // Catching errors re-thrown from above or other processing errors
    // console.error("Error in savePaymentSettings:", JSON.stringify(error, null, 2)); // Already logged above or redundant
    throw error; // Re-throw to allow UI to handle it
  }
};


// --- Site Content ---
export const getSiteContent = async (sectionKey: SiteContentType | string): Promise<SiteContent | null> => {
  try {
    const { data, error } = await supabase
      .from(SITE_CONTENT_TABLE)
      .select('*')
      .eq('sectionKey', sectionKey)
      .single();

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        console.error(`Supabase error fetching site content for ${sectionKey} (code: ${error.code}):`, JSON.stringify(error, null, 2));
        return null;
    }
    return data;
  } catch (err: any) { 
    console.error(`Generic error in getSiteContent for ${sectionKey}:`, JSON.stringify(err, null, 2));
    return null;
  }
};

export const getAllSiteContent = async (): Promise<SiteContent[]> => {
  try {
    const { data, error } = await supabase
      .from(SITE_CONTENT_TABLE)
      .select('*');

    if (error && error.code !== '42P01') {
        console.error(`Supabase error fetching all site content (code: ${error.code}):`, JSON.stringify(error, null, 2));
        return [];
    }
    return data || []; 
  } catch (err: any) { 
    console.error(`Generic error in getAllSiteContent:`, JSON.stringify(err, null, 2));
    return [];
  }
};

export const saveSiteContent = async (content: SiteContent): Promise<void> => {
  try {
    const { error } = await supabase
      .from(SITE_CONTENT_TABLE)
      .upsert({ ...content, updatedAt: new Date().toISOString() }, { onConflict: 'sectionKey' });
    if (error) {
        if (error.code === '42P01') {
            console.error(`Cannot save site content for '${content.sectionKey}': The '${SITE_CONTENT_TABLE}' table does not exist in Supabase. Please create it. Details: ${JSON.stringify(error, null, 2)}`);
        } else {
            console.error(`Supabase error saving site content for ${content.sectionKey} (code: ${error.code}):`, JSON.stringify(error, null, 2));
        }
        throw error;
    }
  } catch (error) {
    // console.error(`Error saving site content for ${content.sectionKey}:`, JSON.stringify(error, null, 2)); // Already logged
    throw error;
  }
};


// --- General Admin Settings ---
export const getAdminSetting = async (settingKey: AdminSettingKey | string): Promise<AdminSetting | null> => {
    try {
        const { data, error } = await supabase
            .from(ADMIN_SETTINGS_TABLE)
            .select('*')
            .eq('settingKey', settingKey)
            .single();
        // PGRST116: Row not found (setting not yet created) - this is fine, returns null.
        // 42P01: Table not found - also fine for reads, returns null.
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') { 
            console.error(`Error fetching admin setting ${settingKey} (code: ${error.code}):`, JSON.stringify(error, null, 2));
            // Fall through to return data (which would be null)
        }
        return data; // Will be null if row not found, table not found, or other handled error
    } catch (err: any) {
        console.error(`Exception fetching admin setting ${settingKey}:`, JSON.stringify(err, null, 2));
        return null;
    }
};

export const getAllAdminSettings = async (): Promise<AdminSetting[]> => {
  try {
    const { data, error } = await supabase
      .from(ADMIN_SETTINGS_TABLE)
      .select('*');
    // 42P01: Table not found - fine for reads, returns empty array.
    if (error && error.code !== '42P01') { 
        console.error(`Error fetching all admin settings (code: ${error.code}):`, JSON.stringify(error, null, 2));
        // Fall through to return data (which would be null) or empty array
    }
    return data || []; // Ensure an array is returned
  } catch (error: any) {
    console.error(`Error fetching all admin settings (unexpected):`, JSON.stringify(error, null, 2));
    return [];
  }
};

export const saveAdminSetting = async (setting: AdminSetting): Promise<void> => {
    try {
        const { error } = await supabase
            .from(ADMIN_SETTINGS_TABLE)
            .upsert(setting, { onConflict: 'settingKey' });

        if (error) {
            if (error.code === '42P01') {
                console.error(`Cannot save admin setting '${setting.settingKey}': The '${ADMIN_SETTINGS_TABLE}' table does not exist in Supabase. Please create it. Details: ${JSON.stringify(error, null, 2)}`);
            } else {
                console.error(`Supabase error saving admin setting '${setting.settingKey}' (code: ${error.code}):`, JSON.stringify(error, null, 2));
            }
            throw error;
        }
    } catch (err) {
        // console.error(`Exception saving admin setting ${setting.settingKey}:`, JSON.stringify(err, null, 2)); // Already logged
        throw err; // Re-throw to allow UI to handle it
    }
};
