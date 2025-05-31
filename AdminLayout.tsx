import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { User, Settings, ClipboardList, Users, CalendarClock, MessageSquare, LayoutDashboard, Rows, Columns, Heart } from 'lucide-react'; // Added Heart, Rows, Columns

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' }, // Changed route
  { label: 'Caregivers', icon: Users, route: '/admin/caregivers' },
  { label: 'Bookings', icon: CalendarClock, route: '/admin/bookings' },
  { label: 'Payments', icon: ClipboardList, route: '/admin/payments' },
  { label: 'Messages', icon: MessageSquare, route: '/admin/messages' },
  { label: 'Cases', icon: ClipboardList, route: '/admin/cases' }, // Added Cases nav item based on existing panels
  { label: 'Reports', icon: LayoutDashboard, route: '/admin/reports' }, // Added Reports
  { label: 'Inventory', icon: ClipboardList, route: '/admin/inventory' }, // Added Inventory
  { label: 'Activity Log', icon: ClipboardList, route: '/admin/activity' }, // Added Activity
  { label: 'Settings', icon: Settings, route: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [classic, setClassic] = useState(false);
  const location = useLocation(); // Get current location

  useEffect(() => {
    const saved = localStorage.getItem('adminLayoutPreference');
    if (saved === 'classic') setClassic(true);
  }, []);

  const toggleLayout = () => {
    const next = !classic;
    setClassic(next);
    localStorage.setItem('adminLayoutPreference', next ? 'classic' : 'modern');
  };

  // This is the "Modern" layout defined in this file
  const ModernLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-[260px_1fr] h-screen bg-slate-100 text-slate-800">
      <aside className="bg-white shadow-lg p-4 flex flex-col border-r border-slate-200">
        <div className="h-16 flex items-center justify-center px-2 mb-4 border-b border-slate-200">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
              <Heart size={28} className="text-primary" />
              <span>CaringHands</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, icon: Icon, route }) => {
            const isActive = location.pathname === route || (route === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={label}
                to={route}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 ease-in-out
                  ${isActive ? 'bg-primary text-white shadow-sm' : 'text-neutral-600 hover:bg-primary-light hover:text-primary-dark'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={toggleLayout}
          className="mt-auto text-xs text-slate-500 hover:text-slate-800 py-3 px-2 flex items-center justify-center gap-2 border-t border-slate-200 hover:bg-slate-100 rounded-b-lg"
        >
          {classic ? <Columns size={14}/> : <Rows size={14} />}
          Switch to {classic ? "Modern" : "Classic"} Layout
        </button>
      </aside>
      <main className="p-6 overflow-y-auto bg-slate-100">{children}</main>
    </div>
  );

  // For "Classic" layout, we render children directly but they might need their own classic wrapper/styling
  // The original AdminDashboardPage had its own classic tab structure.
  // We need a simple shell for classic, or let AdminDashboardPage (as a panel) handle its classic view.
  // For now, if `classic` is true, AdminDashboardPage will be responsible for rendering its classic view including tabs.
  if (classic) {
    // In classic mode, AdminDashboardPage will handle its own tabbing.
    // The button in the classic view to switch back to modern would need to call toggleLayout.
    // This might require passing toggleLayout down or using a context if AdminDashboardPage is deeply nested.
    // For simplicity, the toggle button is only in the modern sidebar here.
    // Children here would be the specific panel for the current route.
    // To make the "Switch to Modern" button available in classic, it might need to be part of a minimal classic header.
    return (
      <div>
        <div className="bg-white p-2 text-right shadow">
           <button
            onClick={toggleLayout}
            className="text-xs text-slate-500 hover:text-slate-800 py-2 px-3 flex items-center ml-auto gap-1 border border-slate-300 rounded-md hover:bg-slate-100"
          >
            {classic ? <Columns size={14}/> : <Rows size={14} />}
            Switch to {classic ? "Modern" : "Classic"} Layout
          </button>
        </div>
        {children}
      </div>
    );
  }

  return <ModernLayout>{children}</ModernLayout>;
}
