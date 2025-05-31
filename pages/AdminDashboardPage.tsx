
import React, { useState, useEffect } from 'react';
import { AdminTabType, Service } from '../types'; 
import { useAdminLayout } from '../components/AdminLayoutContext';
import ModernAdminLayout from '../components/admin/layout/ModernAdminLayout';
import TabButton from '../components/TabButton'; // Used only for Classic layout

// Panels for Classic Layout
import AdminPaymentsPanelClassic from '../components/admin/AdminPaymentsPanel'; 
import CaregiverPanelClassic from '../components/admin/CaregiverPanel';
import AdminBookingsPanelClassic from '../components/admin/AdminBookingsPanel'; 
import AdminSettingsPanelClassic from '../components/admin/settings/AdminSettingsPanel';
import AdminReportsPanelClassic from '../components/admin/AdminReportsPanel';
import AdminInventoryPanelClassic from '../components/admin/AdminInventoryPanel';
import AdminActivityLogPanelClassic from '../components/admin/AdminActivityLogPanel';
import AdminMessagesPanelClassic from '../components/admin/AdminMessagesPanel';
import AdminCasesPanelClassic from '../components/admin/AdminCasesPanel';

import { 
  BookingsIcon, CreditCardIcon, SettingsIcon, UsersIcon, ReportsIcon, InventoryIcon, ActivityLogIcon, MessagesIcon, CasesIcon, PlusCircleIcon
} from '../constants';
import { SAMPLE_SERVICES, ADMIN_TAB_BOOKINGS, ADMIN_TAB_PAYMENTS, ADMIN_TAB_CAREGIVERS, ADMIN_TAB_SETTINGS,
  ADMIN_TAB_REPORTS, ADMIN_TAB_INVENTORY, ADMIN_TAB_ACTIVITY_LOG, ADMIN_TAB_MESSAGES, ADMIN_TAB_CASES
} from '../constants';

const AdminDashboardPage: React.FC = () => {
  const { layoutPreference } = useAdminLayout();
  const [activeTab, setActiveTab] = useState<AdminTabType>(ADMIN_TAB_BOOKINGS);
  const servicesForPricing: Service[] = SAMPLE_SERVICES;

  // FAB related state and logic - This would become more complex for real modals
  const [isFabModalOpen, setIsFabModalOpen] = useState(false); 

  const handleFabClick = () => {
    // This is a placeholder. In a real app, this would open a specific modal
    // based on the activeTab, e.g., an "Add Booking" modal, "Add Caregiver" modal.
    console.log(`FAB clicked for tab: ${activeTab}`);
    // Example:
    // if (activeTab === ADMIN_TAB_CARECAREGIVERS) handleOpenAddCaregiverModal();
    // if (activeTab === ADMIN_TAB_BOOKINGS) handleOpenAddBookingModal();
    setIsFabModalOpen(true); // Generic toggle for a placeholder modal
    alert(`Quick Add action for ${activeTab}`);
    setIsFabModalOpen(false);
  };
  
  const getFabConfig = () => {
    switch(activeTab) {
        case ADMIN_TAB_BOOKINGS: return { icon: <BookingsIcon size={24}/>, label: "New Booking"};
        case ADMIN_TAB_CAREGIVERS: return { icon: <UsersIcon size={24}/>, label: "Add Caregiver"};
        case ADMIN_TAB_PAYMENTS: return { icon: <CreditCardIcon size={24}/>, label: "New Charge"}; // Example
        case ADMIN_TAB_INVENTORY: return { icon: <InventoryIcon size={24}/>, label: "Add Item"};
        case ADMIN_TAB_CASES: return { icon: <CasesIcon size={24}/>, label: "New Case"};
        default: return { icon: <PlusCircleIcon size={24}/>, label: "Quick Add"};
    }
  };

  const fabConfig = getFabConfig();


  const classicAdminTabs = [
    { id: ADMIN_TAB_BOOKINGS, label: "Bookings", icon: <BookingsIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_CAREGIVERS, label: "Caregivers", icon: <UsersIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_PAYMENTS, label: "Payments", icon: <CreditCardIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_MESSAGES, label: "Messages", icon: <MessagesIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_CASES, label: "Cases", icon: <CasesIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_REPORTS, label: "Reports", icon: <ReportsIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_INVENTORY, label: "Inventory", icon: <InventoryIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_ACTIVITY_LOG, label: "Activity Log", icon: <ActivityLogIcon className="w-5 h-5" /> },
    { id: ADMIN_TAB_SETTINGS, label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const renderClassicPanel = () => {
    switch (activeTab) {
      case ADMIN_TAB_BOOKINGS: return <AdminBookingsPanelClassic />;
      case ADMIN_TAB_CAREGIVERS: return <CaregiverPanelClassic />;
      case ADMIN_TAB_PAYMENTS: return <AdminPaymentsPanelClassic services={servicesForPricing} />;
      case ADMIN_TAB_SETTINGS: return <AdminSettingsPanelClassic />;
      case ADMIN_TAB_REPORTS: return <AdminReportsPanelClassic />;
      case ADMIN_TAB_INVENTORY: return <AdminInventoryPanelClassic />;
      case ADMIN_TAB_ACTIVITY_LOG: return <AdminActivityLogPanelClassic />;
      case ADMIN_TAB_MESSAGES: return <AdminMessagesPanelClassic />;
      case ADMIN_TAB_CASES: return <AdminCasesPanelClassic />;
      default: return <div className="p-6">Select a tab</div>;
    }
  };

  if (layoutPreference === 'modern') {
    return <ModernAdminLayout 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onFabClick={handleFabClick}
              fabIcon={fabConfig.icon}
              fabLabel={fabConfig.label}
            />;
  }

  // Classic Layout
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard (Classic View)</h1>
      </div>

      <div className="mb-0 border-b border-slate-200">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-1">
          {classicAdminTabs.map(tab => (
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

      <div className="mt-0">
        {renderClassicPanel()}
      </div>
    </div>
  );
};

export default AdminDashboardPage;