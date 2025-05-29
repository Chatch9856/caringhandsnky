import React, { useState } from 'react';
import { NavLinkItem } from '../types';

const navLinks: NavLinkItem[] = [
  { id: 'home', label: 'Home', href: '#hero' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'why-us', label: 'Why Us', href: '#why-us' },
  { id: 'testimonials', label: 'Testimonials', href: '#testimonials' },
  { id: 'contact', label: 'Book Care', href: '#book-care' }, // Updated to point to the booking form
];

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-brand-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="text-2xl font-bold text-brand-purple">
            CaringHandsNKY
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-brand-charcoal-light hover:text-brand-purple transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="text-brand-charcoal hover:text-brand-purple p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              {isMobileMenuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-brand-white shadow-lg z-40 animate-fade-in">
          <nav className="flex flex-col items-center space-y-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-lg text-brand-charcoal-light hover:text-brand-purple transition-colors duration-200 py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
