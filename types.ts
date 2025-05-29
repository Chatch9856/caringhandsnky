import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location?: string;
}

export interface TrustFeature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  careType: string;
  preferredDate: string;
  preferredTime: string;
  referral?: string;
  notes?: string;
}

export interface AdminBookingEntry extends BookingFormData {
  datetimePreferred: string; // Combined date and time string
  submittedAt: string; // ISO date string
}
