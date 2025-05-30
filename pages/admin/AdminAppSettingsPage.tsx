
import React, { useState, useEffect, useCallback } from 'react';
import { AdminSetting, AdminSettingKey } from '../../types';
import { getAllAdminSettings, saveAdminSetting } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CogIcon, EnvelopeIcon, MapPinIcon, CalendarIcon as CalendarIconMenu } from '../../constants';

interface AppSettingsState {
  [AdminSettingKey.SMTP_HOST]?: string;
  [AdminSettingKey.SMTP_PORT]?: number;
  [AdminSettingKey.SMTP_USER]?: string;
  [AdminSettingKey.SMTP_PASS]?: string;
  [AdminSettingKey.SMTP_FROM_EMAIL]?: string;
  [AdminSettingKey.GOOGLE_MAPS_API_KEY]?: string;
  [AdminSettingKey.ENABLE_MAP_PREVIEW]?: boolean;
  [AdminSettingKey.ENABLE_CALENDAR_INTEGRATION]?: boolean;
  [AdminSettingKey.CALENDAR_EMBED_URL]?: string;
}

const AdminAppSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettingsState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allDbSettings = await getAllAdminSettings();
      const newSettingsState: AppSettingsState = {};
      allDbSettings.forEach(s => {
        // Type assertion needed as s.settingKey is string, but we want to use enum keys
        const key = s.settingKey as AdminSettingKey;
        if (key === AdminSettingKey.SMTP_PORT) {
            newSettingsState[key] = Number(s.value);
        } else if (key === AdminSettingKey.ENABLE_MAP_PREVIEW || key === AdminSettingKey.ENABLE_CALENDAR_INTEGRATION) {
            newSettingsState[key] = s.value === true || s.value === 'true';
        } 
        else {
            newSettingsState[key] = String(s.value);
        }
      });
      setSettings(newSettingsState);
    } catch (err: any) {
      setError(`Failed to load app settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: AdminSettingKey, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const promises = Object.entries(settings).map(([key, value]) => {
        if (value !== undefined) { // Only save if it has a value in state
          return saveAdminSetting({ settingKey: key as AdminSettingKey, value });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      alert('App settings saved successfully!');
    } catch (err: any) {
      setError(`Failed to save app settings: ${err.message}`);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderInputField = (key: AdminSettingKey, label: string, type: string = 'text', placeholder?: string) => (
    <div>
      <label htmlFor={key} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        id={key}
        value={settings[key] === undefined ? '' : String(settings[key])}
        onChange={e => handleChange(key, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-xs"
      />
    </div>
  );

  const renderTextareaField = (key: AdminSettingKey, label: string, placeholder?: string) => (
    <div>
      <label htmlFor={key} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <textarea
        id={key}
        value={settings[key] === undefined ? '' : String(settings[key])}
        onChange={e => handleChange(key, e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-xs"
      />
    </div>
  );
  
  const renderToggleField = (key: AdminSettingKey, label: string) => (
     <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <label htmlFor={key} className="flex items-center space-x-2 cursor-pointer">
            <input
            type="checkbox"
            id={key}
            checked={!!settings[key]}
            onChange={e => handleChange(key, e.target.checked)}
            className="h-5 w-5 text-primary border-slate-300 rounded focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-xs font-medium text-slate-500">{settings[key] ? 'Enabled' : 'Disabled'}</span>
        </label>
    </div>
  );


  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
        <CogIcon className="w-8 h-8 mr-3 text-primary" />
        Application Settings
      </h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p>{error}</p></div>}

      {isLoading ? (
        <LoadingSpinner text="Loading app settings..." />
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-8">
          
          {/* SMTP Settings */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200 flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2 text-primary-light" /> SMTP Configuration (for Email Notifications)
            </h2>
            <p className="text-xs text-slate-500 mb-4 italic">Note: Actual email sending requires backend/serverless function integration. These settings are stored for such functions to use.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {renderInputField(AdminSettingKey.SMTP_HOST, 'SMTP Host', 'text', 'e.g., smtp.example.com')}
              {renderInputField(AdminSettingKey.SMTP_PORT, 'SMTP Port', 'number', 'e.g., 587')}
              {renderInputField(AdminSettingKey.SMTP_USER, 'SMTP Username', 'text', 'e.g., user@example.com')}
              {renderInputField(AdminSettingKey.SMTP_PASS, 'SMTP Password', 'password', 'Enter password')}
              {renderInputField(AdminSettingKey.SMTP_FROM_EMAIL, 'Send Emails From', 'email', 'e.g., no-reply@caringhandsnky.com')}
            </div>
          </section>

          {/* Google Maps Settings */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-light" /> Google Maps Integration
            </h2>
            <div className="space-y-4">
              {renderInputField(AdminSettingKey.GOOGLE_MAPS_API_KEY, 'Google Maps API Key (Embed API or JS API)', 'text', 'Enter Google Maps API Key')}
              {renderToggleField(AdminSettingKey.ENABLE_MAP_PREVIEW, 'Enable Address Preview on Booking Form')}
            </div>
          </section>
          
          {/* Calendar Settings */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200 flex items-center">
              <CalendarIconMenu className="w-5 h-5 mr-2 text-primary-light" /> Calendar Integration
            </h2>
            <div className="space-y-4">
              {renderToggleField(AdminSettingKey.ENABLE_CALENDAR_INTEGRATION, 'Enable External Calendar Embed (e.g., Calendly)')}
              {settings[AdminSettingKey.ENABLE_CALENDAR_INTEGRATION] && renderTextareaField(AdminSettingKey.CALENDAR_EMBED_URL, 'Calendar Embed URL or HTML Snippet', 'Paste full URL or embed code')}
            </div>
          </section>

          <div className="pt-6 border-t border-slate-200">
            <button
                onClick={handleSaveSettings}
                disabled={isSaving || isLoading}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-70"
            >
                {isSaving ? <LoadingSpinner size="sm" /> : 'Save All Application Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppSettingsPage;
