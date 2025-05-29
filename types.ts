
import React from 'react';

export enum ServiceCategory {
  PERSONAL_CARE = "Personal Care",
  COMPANIONSHIP = "Companionship",
  HOUSEHOLD_HELP = "Household Help",
  SPECIALIZED_CARE = "Specialized Care",
  RESPITE_CARE = "Respite Care",
  TRANSPORTATION = "Transportation Services"
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Changed from React.ReactElement
  pricePerHour?: number; 
  details?: string[];
}

export enum BookingStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string; 
  serviceName: string;
  requestedDate: string; 
  requestedTime: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  submittedAt: string; 
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number; // 1-5 stars
  date: string; 
}

export interface PaymentMethod {
  id: string;
  name: string; 
  identifier: string; 
  instructions?: string;
  isEnabled: boolean;
}