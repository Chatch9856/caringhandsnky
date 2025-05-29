
import React from 'react';
import { NavLinkItem } from '../types';

const footerLinks: NavLinkItem[] = [
  { id: 'f-home', label: 'Home', href: '#hero' },
  { id: 'f-services', label: 'Services', href: '#services' },
  { id: 'f-book', label: 'Book Now', href: '#book-care' },
  { id: 'f-contact', label: 'Contact Us', href: 'mailto:info@caringhandsnky.com' },
];

const adminLinks: NavLinkItem[] = [
  { id: 'f-admin-bookings', label: 'Admin: View Bookings', href: '#admin/bookings'}
];

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10 10-4.49 10-10S17.5 2.04 12 2.04zm.5 14.45h-2.9v-7.09h-1.99v-2.59h1.99V8.1c0-1.97 1.21-3.05 2.98-3.05.86 0 1.59.06 1.8.09v2.33h-1.38c-.96 0-1.14.46-1.14 1.12v1.45h2.58l-.34 2.59h-2.24v7.09z"></path></svg>
);
const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.42.46-.65.25-1.23.59-1.77 1.14-.54.55-.89 1.12-1.13 1.77-.24.63-.41 1.36-.46 2.42C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.46 2.42.25.65.59 1.23 1.14 1.77.55.54 1.12.89 1.77 1.13.63.24 1.36.41 2.42.46 1.06.05 1.4.06 4.12.06s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.42-.46.65-.25 1.23.59 1.77-1.13.54-.55.89-1.12 1.13-1.77.24-.63.41-1.36.46-2.42.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.46-2.42-.25-.65-.59-1.23-1.13-1.77-.55-.54-1.12-.89-1.77-1.13-.63-.24-1.36-.41-2.42-.46C15.06 2.01 14.72 2 12 2zm0 1.8c2.65 0 2.95.01 4 .06 1.03.05 1.58.21 1.96.37.49.2.82.46 1.18.82.36.36.62.7.82 1.18.16.38.32.93.37 1.96.05 1.05.06 1.35.06 4s-.01 2.95-.06 4c-.05 1.03-.21 1.58-.37 1.96-.2.49-.46.82-.82 1.18-.36.36-.7.62-1.18.82-.38.16-.93.32-1.96.37-1.05.05-1.35.06-4 .06s-2.95-.01-4-.06c-1.03-.05-1.58-.21-1.96-.37-.49-.2-.82-.46-1.18-.82-.36.36-.62-.7-.82-1.18-.16-.38-.32.93-.37-1.96C4.01 14.95 4 14.65 4 12s.01-2.95.06-4c.05-1.03.21-1.58.37-1.96.2-.49.46.82.82-1.18.36.36.7-.62-1.18-.82.38-.16.93-.32 1.96-.37 1.05-.05 1.35-.06 4-.06zm0 3.6c-2.53 0-4.59 2.06-4.59 4.59s2.06 4.59 4.59 4.59 4.59-2.06 4.59-4.59S14.53 7.4 12 7.4zm0 7.38c-1.59 0-2.88-1.29-2.88-2.88S10.41 9.02 12 9.02s2.88 1.29 2.88 2.88-1.29 2.88-2.88 2.88zm4.97-7.27c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"></path></svg>
);

const MainFooter: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-purple-100 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10"> {/* Adjusted to md:grid-cols-4 */}
          {/* Logo & About */}
          <div className="md:col-span-1">
            <a href="#hero" className="text-2xl font-bold text-brand-purple mb-2 inline-block">
              CaringHandsNKY
            </a>
            <p className="text-sm text-gray-400">
              Providing compassionate in-home care across Northern Kentucky.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-brand-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="hover:text-brand-purple transition-colors duration-200 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h5 className="font-semibold text-brand-white mb-4">Get In Touch</h5>
            <p className="text-sm mb-1">
              <a href="mailto:info@caringhandsnky.com" className="hover:text-brand-purple transition-colors">
                info@caringhandsnky.com
              </a>
            </p>
            <p className="text-sm mb-4">
              <a href="tel:+18595551212" className="hover:text-brand-purple transition-colors">
                (859) 555-1212 {/* Updated phone number as per UrgentAssistance */}
              </a>
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-brand-purple transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-brand-purple transition-colors">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Admin Links */}
          <div>
            <h5 className="font-semibold text-brand-white mb-4">Admin Area</h5>
            <ul className="space-y-2">
              {adminLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="hover:text-brand-purple transition-colors duration-200 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
             <p className="text-xs text-gray-500 mt-3">Internal use only.</p>
          </div>

        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CaringHandsNKY. All rights reserved.</p>
          <p className="mt-1">Designed with care in Northern Kentucky.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
