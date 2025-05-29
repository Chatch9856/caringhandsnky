import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US, ROUTE_LOGIN,
  HeartIcon, LogoutIcon, LoginIcon // Added LoginIcon
} from '../constants';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const { user, signOut: contextSignOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
    }`;

  const handleLogout = async () => {
    try {
      await contextSignOut();
      navigate(ROUTE_HOME);
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to={ROUTE_HOME} className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <HeartIcon className="w-8 h-8" />
            <span>CaringHandsNKY</span>
          </NavLink>
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to={ROUTE_HOME} className={navLinkClass}>Home</NavLink>
            <NavLink to={ROUTE_SERVICES} className={navLinkClass}>Services</NavLink>
            <NavLink to={ROUTE_WHY_US} className={navLinkClass}>Why Us</NavLink>
            <NavLink to={ROUTE_TESTIMONIALS} className={navLinkClass}>Testimonials</NavLink>
            <NavLink to={ROUTE_PAY_ONLINE} className={navLinkClass}>Pay Online</NavLink>
            <NavLink to={ROUTE_URGENT_HELP} className={navLinkClass}>Urgent Help</NavLink>
            
            {!isLoading && user && (
              <NavLink to={ROUTE_ADMIN_DASHBOARD} className={navLinkClass}>Admin</NavLink>
            )}

            <NavLink 
              to={ROUTE_BOOK_CARE} 
              className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-dark transition-colors duration-150"
            >
              Book Care
            </NavLink>

            {!isLoading && user ? (
              <button
                onClick={handleLogout}
                className="ml-3 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:bg-red-100 hover:text-red-700 transition-colors duration-150"
                title="Logout"
              >
                <LogoutIcon className="w-5 h-5 mr-1" /> Logout
              </button>
            ) : !isLoading && (
              <NavLink 
                to={ROUTE_LOGIN} 
                className="ml-3 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:bg-primary-light hover:text-primary-dark transition-colors duration-150"
                title="Admin Login"
              >
                 <LoginIcon className="w-5 h-5 mr-1" /> Login
              </NavLink>
            )}
          </div>
          {/* Mobile menu button can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
