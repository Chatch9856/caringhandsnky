
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_HOME, ROUTE_SERVICES, ROUTE_URGENT_HELP } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-8 mt-auto"> {/* Changed mt-12 to mt-auto for sticky footer effect with flex-grow */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center md:text-left">
          <div>
            <h5 className="font-bold text-lg mb-2 text-primary-light">CaringHandsNKY</h5>
            <p className="text-sm text-slate-300">Providing compassionate home care services in Northern Kentucky.</p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-2 text-primary-light">Quick Links</h5>
            <ul className="space-y-1">
              <li><Link to={ROUTE_HOME} className="hover:text-primary-light transition-colors">Home</Link></li>
              <li><Link to={ROUTE_SERVICES} className="hover:text-primary-light transition-colors">Our Services</Link></li>
              <li><Link to={ROUTE_URGENT_HELP} className="hover:text-primary-light transition-colors">Urgent Help</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-2 text-primary-light">Contact Us</h5>
            <p className="text-sm text-slate-300">Phone: (555) 123-4567</p>
            <p className="text-sm text-slate-300">Email: contact@caringhandsnky.com</p>
            <p className="text-sm text-slate-300">Serving NKY and surrounding areas.</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 text-center">&copy; {new Date().getFullYear()} CaringHandsNKY. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
