import React, { useState, useEffect } from 'react';
import { Service, AdminTabType } from '../types'; 
import AdminPaymentsPanel from '../components/admin/AdminPaymentsPanel'; 
import CaregiverPanel from '../components/admin/CaregiverPanel';
import AdminBookingsPanel from '../components/admin/AdminBookingsPanel'; 
import AdminSettingsPanel from '../components/admin/settings/AdminSettingsPanel'; // Ensured relative path
import AdminReportsPanel from '../components/admin/AdminReportsPanel';
import AdminInventoryPanel from '../components/admin/AdminInventoryPanel';
import AdminActivityLogPanel from '../components/admin/AdminActivityLogPanel';
import AdminMessagesPanel from '../components/admin/AdminMessagesPanel';
import AdminCasesPanel from '../components/admin/AdminCasesPanel';

import TabButton from '../components/TabButton';
import { 
  DocumentTextIcon, CreditCardIcon, CogIcon, UsersIcon, 
  ChartBarIcon, ArchiveBoxIcon, DocumentMagnifyingGlassIcon,
  MessageSquareIcon, BriefcaseIcon, // New Icons
  SAMPLE_SERVICES,
  ADMIN_TAB_BOOKINGS, ADMIN_TAB_PAYMENTS, ADMIN_TAB_CAREGIVERS, ADMIN_TAB_SETTINGS,
  ADMIN_TAB_REPORTS, ADMIN_TAB_INVENTORY, ADMIN_TAB_ACTIVITY_LOG,
  ADMIN_TAB_MESSAGES, ADMIN_TAB_CASES // New Tab constants
} from '../constants';


const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>(ADMIN_TAB_BOOKINGS); 

  const servicesForPricing: Service[] = SAMPLE_SERVICES;


  useEffect(() => {
    // Future logic for tab changes if needed, e.g., specific data fetching or cleanup
  }, [activeTab]);
  
  const adminTabs = [
    { id: ADMIN_TAB_BOOKINGS, label: "Bookings", icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_CAREGIVERS, label: "Caregivers", icon: <UsersIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_PAYMENTS, label: "Payments", icon: <CreditCardIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_MESSAGES, label: "Messages", icon: <MessageSquareIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_CASES, label: "Cases", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_REPORTS, label: "Reports", icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_INVENTORY, label: "Inventory", icon: <ArchiveBoxIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_ACTIVITY_LOG, label: "Activity Log", icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_SETTINGS, label: "Settings", icon: <CogIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
      </div>

      <div className="mb-0 border-b border-slate-200">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-1"> {/* Added pb-1 for scrollbar visibility */}
          {adminTabs.map(tab => (
             <TabButton 
              key={tab.id}
              label={tab.label} 
              isActive={activeTab === tab.id} 
              onClick={() => setActiveTab(tab.id as AdminTabType)}
              icon={tab.icon}
            />
          ))}
        </div>
      </div>

      <div className="mt-0"> {/* Removed top margin, panels apply their own padding */}
        {activeTab === ADMIN_TAB_BOOKINGS && <AdminBookingsPanel />}
        {activeTab === ADMIN_TAB_CAREGIVERS && <CaregiverPanel />}
        {activeTab === ADMIN_TAB_PAYMENTS && <AdminPaymentsPanel services={servicesForPricing} />}
        {activeTab === ADMIN_TAB_SETTINGS && <AdminSettingsPanel />}
        {activeTab === ADMIN_TAB_REPORTS && <AdminReportsPanel />}
        {activeTab === ADMIN_TAB_INVENTORY && <AdminInventoryPanel />}
        {activeTab === ADMIN_TAB_ACTIVITY_LOG && <AdminActivityLogPanel />}
        {activeTab === ADMIN_TAB_MESSAGES && <AdminMessagesPanel />}
        {activeTab === ADMIN_TAB_CASES && <AdminCasesPanel />}
      </div>
    </div>
  );
};

export default AdminDashboardPage;