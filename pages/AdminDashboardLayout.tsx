
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  CogIcon, DocumentTextIcon, CreditCardIcon, BellIcon, ArchiveBoxIcon, 
  LogoutIcon, HeartIcon, MapPinIcon, CalendarIcon as CalendarIconMenu, // Renamed to avoid conflict
  XCircleIcon // Added import
} from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardLayout: React.FC = () => {
  const { user, signOut: contextSignOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await contextSignOut();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner text="Loading Admin Dashboard..." /></div>;
  }

  if (!user) {
    // Should be caught by ProtectedRoute, but as a fallback
    navigate('/login');
    return null;
  }

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-150 group ${
      isActive 
        ? 'bg-primary text-white shadow-md' 
        : 'text-slate-700 hover:bg-primary-light hover:text-primary-dark'
    }`;
  
  const navItems = [
    { to: "bookings", label: "Manage Bookings", icon: <DocumentTextIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
    { to: "archive", label: "Archived Bookings", icon: <ArchiveBoxIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
    { to: "content", label: "Content Management", icon: <DocumentTextIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
    { to: "payments", label: "Payment Settings", icon: <CreditCardIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
    { to: "notifications", label: "Notification Logs", icon: <BellIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
    { to: "settings", label: "App Settings", icon: <CogIcon className="w-5 h-5 mr-3 group-hover:text-primary-dark" /> },
  ];

  const sidebarContent = (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-6">
          <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <HeartIcon className="w-7 h-7" />
            <span>CaringHandsNKY</span>
          </NavLink>
      </div>
      <p className="px-3 text-xs text-slate-500 uppercase font-semibold">Menu</p>
      {navItems.map(item => (
        <NavLink key={item.to} to={item.to} className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          {item.icon}
          {item.label}
        </NavLink>
      ))}
      <div className="pt-4 mt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors duration-150 group"
        >
          <LogoutIcon className="w-5 h-5 mr-3 group-hover:text-red-700" />
          Logout
        </button>
      </div>
       <p className="px-3 mt-6 text-xs text-slate-400">Logged in as: <span className="font-medium block truncate">{user.email}</span></p>
    </div>
  );


  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile Sidebar Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-md shadow-md text-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <XCircleIcon className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        )}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
