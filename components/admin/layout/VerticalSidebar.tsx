
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Assuming admin sections will be routes eventually
import { AdminTabType } from '../../../types';
import {
  BookingsIcon, UsersIcon, CreditCardIcon, MessagesIcon, CasesIcon, ReportsIcon, InventoryIcon, ActivityLogIcon, SettingsIcon, HeartIconLucide
} from '../../../constants';
import { ADMIN_SIDEBAR_WIDTH } from '../../../constants';


interface VerticalSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  // Add isCollapsed / setIsCollapsed if implementing collapsible sidebar
}

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({ activeTab, setActiveTab }) => {
  const adminTabsConfig = [
    { id: 'bookings' as AdminTabType, label: "Bookings", icon: <BookingsIcon size={20} /> },
    { id: 'caregivers' as AdminTabType, label: "Caregivers", icon: <UsersIcon size={20} /> },
    { id: 'payments' as AdminTabType, label: "Payments", icon: <CreditCardIcon size={20} /> },
    { id: 'messages' as AdminTabType, label: "Messages", icon: <MessagesIcon size={20} /> },
    { id: 'cases' as AdminTabType, label: "Cases", icon: <CasesIcon size={20} /> },
    { id: 'reports' as AdminTabType, label: "Reports", icon: <ReportsIcon size={20} /> },
    { id: 'inventory' as AdminTabType, label: "Inventory", icon: <InventoryIcon size={20} /> },
    { id: 'activity_log' as AdminTabType, label: "Activity Log", icon: <ActivityLogIcon size={20} /> },
    { id: 'settings' as AdminTabType, label: "Settings", icon: <SettingsIcon size={20} /> },
  ];

  const baseLinkClasses = "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-150 ease-in-out";
  const activeLinkClasses = "bg-primary text-white shadow-md";
  const inactiveLinkClasses = "text-neutral-dark hover:bg-primary-light hover:text-primary-dark";


  return (
    <aside className={`${ADMIN_SIDEBAR_WIDTH} bg-white border-r border-slate-200 flex flex-col shadow-lg`}>
      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-200">
        <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <HeartIconLucide size={28} className="text-primary" />
            <span className="hidden md:inline">CaringHands</span>
        </NavLink>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {adminTabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${baseLinkClasses} w-full ${
              activeTab === tab.id ? activeLinkClasses : inactiveLinkClasses
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        {/* Footer content for sidebar, e.g., user profile quick link or version */}
        <p className="text-xs text-slate-400 text-center">&copy; {new Date().getFullYear()} CaringHandsNKY</p>
      </div>
    </aside>
  );
};

export default VerticalSidebar;
