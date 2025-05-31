
import React from 'react';
import { useAdminLayout } from '../../AdminLayoutContext';
import Breadcrumb from './Breadcrumb';
import { AdminTabType } from '../../../types';
import { Bell, UserCircle, Rows, Columns } from 'lucide-react'; // Rows for Classic, Columns for Modern

interface TopBarProps {
  activeTab: AdminTabType;
  adminName?: string; // Optional admin name
}

const TopBar: React.FC<TopBarProps> = ({ activeTab, adminName = "Admin User" }) => {
  const { layoutPreference, toggleLayoutPreference } = useAdminLayout();

  const breadcrumbPaths = [
    { name: "Admin", href: "/admin", current: false },
    { name: activeTab.charAt(0).toUpperCase() + activeTab.slice(1), href: `/admin?tab=${activeTab}`, current: true }
  ];
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <Breadcrumb paths={breadcrumbPaths} />
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleLayoutPreference} 
          className="p-2 rounded-md text-neutral-500 hover:text-primary hover:bg-primary-light/30 transition-colors"
          title={layoutPreference === 'classic' ? "Switch to Modern Layout" : "Switch to Classic Layout"}
        >
          {layoutPreference === 'classic' ? <Columns size={20} /> : <Rows size={20} />}
        </button>
        <button className="p-2 rounded-md text-neutral-500 hover:text-primary hover:bg-primary-light/30 transition-colors" title="Notifications">
          <Bell size={20} />
          {/* Add notification badge here if needed */}
        </button>
        <div className="flex items-center space-x-2">
          <UserCircle size={24} className="text-neutral-500" />
          <span className="text-sm font-medium text-neutral-dark hidden md:inline">{adminName}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
