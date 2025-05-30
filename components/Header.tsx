
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US, ROUTE_LOGIN,
  HeartIcon, LogoutIcon, LoginIcon 
} from '../constants';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const { user, signOut: contextSignOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block md:inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
    }`;

  const handleLogout = async () => {
    try {
      await contextSignOut();
      setIsMobileMenuOpen(false);
      navigate(ROUTE_HOME);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to={ROUTE_HOME} className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-primary">
              <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              <span>CaringHandsNKY</span>
            </NavLink>
          </div>
          
          {/* Desktop Menu */}
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
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-dark transition-colors duration-150"
            >
              Book Care
            </NavLink>

            {!isLoading && user ? (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:bg-red-100 hover:text-red-700 transition-colors duration-150"
                title="Logout"
              >
                <LogoutIcon className="w-5 h-5 mr-1" /> Logout
              </button>
            ) : !isLoading && (
              <NavLink 
                to={ROUTE_LOGIN} 
                className="ml-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:bg-primary-light hover:text-primary-dark transition-colors duration-150"
                title="Admin Login"
              >
                 <LoginIcon className="w-5 h-5 mr-1" /> Login
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-40 transform origin-top-right transition ease-out duration-200" id="mobile-menu">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-slate-100">
            <div className="pt-2 pb-3 space-y-1 px-2">
              <NavLink to={ROUTE_HOME} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Home</NavLink>
              <NavLink to={ROUTE_SERVICES} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Services</NavLink>
              <NavLink to={ROUTE_WHY_US} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Why Us</NavLink>
              <NavLink to={ROUTE_TESTIMONIALS} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Testimonials</NavLink>
              <NavLink to={ROUTE_PAY_ONLINE} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Pay Online</NavLink>
              <NavLink to={ROUTE_URGENT_HELP} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Urgent Help</NavLink>
              
              {!isLoading && user && (
                <NavLink to={ROUTE_ADMIN_DASHBOARD} className={mobileNavLinkClass} onClick={toggleMobileMenu}>Admin</NavLink>
              )}
              
              <NavLink 
                to={ROUTE_BOOK_CARE} 
                className="block w-full text-left mt-1 px-3 py-2 rounded-md text-base font-medium text-white bg-accent hover:bg-accent-dark transition-colors duration-150"
                onClick={toggleMobileMenu}
              >
                Book Care
              </NavLink>
            </div>
            <div className="pt-2 pb-3 space-y-1 px-2">
              {!isLoading && user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-red-100 hover:text-red-700 transition-colors duration-150"
                >
                  <LogoutIcon className="w-5 h-5 mr-2 inline-block" /> Logout
                </button>
              ) : !isLoading && (
                <NavLink 
                  to={ROUTE_LOGIN} 
                  className={mobileNavLinkClass}
                  onClick={toggleMobileMenu}
                >
                   <LoginIcon className="w-5 h-5 mr-2 inline-block" /> Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
