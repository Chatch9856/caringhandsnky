import React, { useState } from 'react';
import TabButton from '../../TabButton';
import NotificationSettingsPanel from './NotificationSettingsPanel';
import { BellIcon, CogIcon } from '../../../constants'; // Assuming CogIcon is also relevant for general settings

type SettingsSubTab = 'notifications' | 'general'; // Example other tabs

const AdminSettingsPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('notifications');

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-primary-dark mb-1">Application Settings</h2>
        <p className="text-sm text-neutral-DEFAULT mb-4">
          Manage general settings and notification preferences for the application.
        </p>
      </div>

      <div className="mb-0 border-b border-slate-200 px-2 md:px-4">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-0">
          <TabButton
            label="Notifications"
            isActive={activeSubTab === 'notifications'}
            onClick={() => setActiveSubTab('notifications')}
            icon={<BellIcon className="w-5 h-5" />}
          />
          {/* Example of another settings tab - can be expanded later */}
          <TabButton
            label="General"
            isActive={activeSubTab === 'general'}
            onClick={() => setActiveSubTab('general')}
            icon={<CogIcon className="w-5 h-5" />}
            disabled // Placeholder - enable when implemented
          />
        </div>
      </div>
      
      <div className="p-0"> {/* Sub-tabs will apply their own p-6 */}
        {activeSubTab === 'notifications' && <NotificationSettingsPanel />}
        {activeSubTab === 'general' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-primary-dark">General Settings</h3>
            <p className="text-neutral-DEFAULT mt-2">General application settings will be managed here. (Coming Soon)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPanel;