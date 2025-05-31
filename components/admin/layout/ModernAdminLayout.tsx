
import React from 'react';
import VerticalSidebar from './VerticalSidebar';
import TopBar from './TopBar';
import { AdminTabType } from '../../../types';
import AdminPaymentsPanel from '../AdminPaymentsPanel';
import CaregiverPanel from '../CaregiverPanel';
import AdminBookingsPanel from '../AdminBookingsPanel';
import AdminSettingsPanel from '../settings/AdminSettingsPanel';
import AdminReportsPanel from '../AdminReportsPanel';
import AdminInventoryPanel from '../AdminInventoryPanel';
import AdminActivityLogPanel from '../AdminActivityLogPanel';
import AdminMessagesPanel from '../AdminMessagesPanel';
import AdminCasesPanel from '../AdminCasesPanel';
import { SAMPLE_SERVICES, ADMIN_SIDEBAR_WIDTH, ADMIN_TOP_BAR_HEIGHT } from '../../../constants'; // Ensure these are correctly defined for width/height
import FloatingActionButton from '../../shared/FloatingActionButton'; // FAB component

interface ModernAdminLayoutProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  // Props for FAB:
  onFabClick: () => void; 
  fabIcon: React.ReactNode;
  fabLabel: string;
}

const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ activeTab, setActiveTab, onFabClick, fabIcon, fabLabel }) => {
  const servicesForPricing = SAMPLE_SERVICES; // Assuming this is still relevant

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'bookings': return <AdminBookingsPanel />;
      case 'caregivers': return <CaregiverPanel />;
      case 'payments': return <AdminPaymentsPanel services={servicesForPricing} />;
      case 'settings': return <AdminSettingsPanel />;
      case 'reports': return <AdminReportsPanel />;
      case 'inventory': return <AdminInventoryPanel />;
      case 'activity_log': return <AdminActivityLogPanel />;
      case 'messages': return <AdminMessagesPanel />;
      case 'cases': return <AdminCasesPanel />;
      default: return <div className="p-6">Select a tab</div>;
    }
  };

  return (
    <div className={`grid grid-cols-[var(--sidebar-width),1fr] min-h-screen bg-neutral-light`} style={{ '--sidebar-width': '240px' } as React.CSSProperties}>
      <VerticalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeTab={activeTab} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-slate-100"> {/* Added bg-slate-100 for content area */}
          {renderActivePanel()}
        </main>
      </div>
      <FloatingActionButton onClick={onFabClick} icon={fabIcon} label={fabLabel} />
    </div>
  );
};

export default ModernAdminLayout;
