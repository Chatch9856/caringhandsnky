
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOKING_PUBLIC, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US, ROUTE_BLOG 
} from '../constants';
import { HeartIconLucide } from '../constants'; // Updated to Lucide version

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to={ROUTE_HOME} className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <HeartIconLucide className="w-8 h-8" /> {/* Updated Icon */}
            <span>CaringHandsNKY</span>
          </NavLink>
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to={ROUTE_HOME} className={navLinkClass}>Home</NavLink>
            <NavLink to={ROUTE_SERVICES} className={navLinkClass}>Services</NavLink>
            <NavLink to={ROUTE_WHY_US} className={navLinkClass}>Why Us</NavLink>
            <NavLink to={ROUTE_TESTIMONIALS} className={navLinkClass}>Testimonials</NavLink>
            <NavLink to={ROUTE_BLOG} className={navLinkClass}>Blog</NavLink>
            <NavLink to={ROUTE_PAY_ONLINE} className={navLinkClass}>Pay Online</NavLink>
            <NavLink to={ROUTE_URGENT_HELP} className={navLinkClass}>Urgent Help</NavLink>
            <NavLink to={ROUTE_ADMIN_DASHBOARD} className={navLinkClass}>Admin</NavLink>
            <NavLink 
              to={ROUTE_BOOKING_PUBLIC} 
              className="ml-2 lg:ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-dark transition-colors duration-150"
            >
              Book Care
            </NavLink>
          </div>
          {/* Mobile menu button can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
