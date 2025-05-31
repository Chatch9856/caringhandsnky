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
  id: string; // Could be slug for SAMPLE_SERVICES, or UUID for Supabase fetched services
  name: string;
  description: string;
  category: ServiceCategory; // For SAMPLE_SERVICES
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // For SAMPLE_SERVICES
  pricePerHour?: number; 
  details?: string[]; // For SAMPLE_SERVICES
  // Fields from Supabase 'services' table might differ, e.g. no icon, category stored differently
}

export interface PublicService { // For fetching services for the public booking page dropdown
  id: string; // UUID from Supabase
  name: string;
}


export enum BookingStatus {
  PENDING = "Pending", // Maps to "Pending Approval" for display
  APPROVED = "Approved", // Maps to "Approved & Upcoming" for display
  REJECTED = "Rejected",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
  // Note: Supabase `bookings` table `status` default is 'Confirmed'.
  // We'll use these enum values when updating status via admin panel.
}

// Old BookingRequest from JSON, keep for BookCarePage if it still uses bookingService.ts
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

// New type for Admin Panel, based on Supabase `bookings` table
export interface AdminBooking {
  id: string; // from bookings.id
  patient_id: string | null; // from bookings.patient_id
  patient_display_info: string; // Generated string like "Patient ID: <uuid>" or "Name (from notes)"
  caregiver_id: string | null; // from bookings.caregiver_id
  caregiver_full_name?: string | null; // Joined from caregivers.full_name
  service_name: string; // from bookings.service
  location: string | null; // from bookings.location
  booking_date: string; // from bookings.booking_date
  start_time: string; // from bookings.start_time
  end_time: string | null; // from bookings.end_time
  notes: string | null; // from bookings.notes
  status: BookingStatus; // from bookings.status (maps to BookingStatus enum)
  created_at: string; // from bookings.created_at
}


export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number; // 1-5 stars
  date: string; 
}

// This type is for UI state in GatewaysTab, derived from Supabase payment_gateways table
export interface AppPaymentGateway {
  dbId?: string; // Supabase row ID (maps to 'id' in payment_gateways table)
  type: string; // e.g., "CashApp", "Venmo" (maps to 'type' in payment_gateways table)
  identifier: string; // Corresponds to 'handle' in DB
  instructions?: string;
  qrCodeUrl?: string | null; // Corresponds to 'qr_url' in DB
  isEnabled: boolean; // Corresponds to 'is_active' in DB
  qrCodeFile?: File | null; // For new QR code upload
  currentQrPath?: string | null; // Path in Supabase storage for existing QR, to handle deletion
}


// Caregiver Management Types
export enum CaregiverStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
}

export enum PredefinedSkill {
  RN = "RN (Registered Nurse)",
  CNA = "CNA (Certified Nursing Assistant)",
  LPN = "LPN (Licensed Practical Nurse)",
  HHA = "HHA (Home Health Aide)",
  PTA = "PTA (Physical Therapist Assistant)",
  OTA = "OTA (Occupational Therapist Assistant)",
  PHLEBOTOMIST = "Phlebotomist",
  MED_ADMIN = "Medication Administration",
  COMPANION = "Companion Care",
  DEMENTIA_CARE = "Dementia Care Specialist",
  PALLIATIVE_CARE = "Palliative Care Support"
}

export enum PredefinedCertification {
  BLS = "BLS (Basic Life Support)",
  ACLS = "ACLS (Advanced Cardiovascular Life Support)",
  CPR = "CPR Certified",
  FIRST_AID = "First Aid Certified",
  DEMENTIA_CERT = "Dementia Care Certified",
  HOSPICE_CERT = "Hospice and Palliative Care Certified",
  CNA_LICENSE = "CNA License",
  LPN_LICENSE = "LPN License",
  RN_LICENSE = "RN License"
}

export interface Caregiver {
  id: string; 
  created_at?: string; 
  full_name: string;
  email: string;
  phone: string;
  profile_image_url?: string | null;
  skills: PredefinedSkill[];
  certifications: PredefinedCertification[];
  notes?: string;
  status: CaregiverStatus;
}

// For fetching active caregivers for public booking dropdown
export interface PublicCaregiver {
  id: string; // UUID from Supabase
  full_name: string;
}


export type CaregiverFormData = Omit<Caregiver, 'id' | 'created_at'> & { id?: string };

// Caregiver Shifts
export enum ShiftStatus {
  SCHEDULED = "Scheduled",
  CONFIRMED = "Confirmed",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  NO_SHOW = "No Show"
}

export interface CaregiverShift {
  id: string;
  caregiver_id: string;
  caregiver_full_name?: string; // Joined from caregivers table for display
  patient_id: string | null; // UUID from schema, but form might take text
  shift_date: string; // date
  start_time: string; // time
  end_time: string; // time
  location: string | null;
  notes: string | null; 
  patient_identifier_notes?: string; // Used in form, content goes into 'notes'
  status: ShiftStatus;
  created_at: string;
}
// For the shift form
export type CaregiverShiftFormData = Omit<CaregiverShift, 'id' | 'created_at' | 'caregiver_full_name' | 'status'> & {
  status?: ShiftStatus; // Optional for creation, will default
};


// Caregiver Documents
export enum DocumentType {
  LICENSE = "License",
  ID = "ID Card", 
  TRAINING_CERTIFICATE = "Training Certificate",
  CERTIFICATION = "Certification", 
  BACKGROUND_CHECK = "Background Check",
  OTHER = "Other"
}
export interface CaregiverDocument {
  id: string;
  caregiver_id: string;
  caregiver_full_name?: string; 
  doc_url: string;
  doc_type: DocumentType | string;
  expires_on: string | null; 
  uploaded_at: string;
  file_name?: string; 
}

export type CaregiverDocumentFormData = {
  caregiver_id: string;
  doc_type: DocumentType | string;
  expires_on?: string | null; 
  file: File | null;
};


// Caregiver Incidents
export interface CaregiverIncident {
  id: string;
  caregiver_id: string;
  type: string | null;
  description: string | null;
  added_by: string | null; 
  created_at: string;
  attachment_url?: string | null; 
}

// Caregiver Notifications
export enum NotificationMethod {
  EMAIL = "Email",
  SMS = "SMS",
  IN_APP = "In-App"
}
export enum NotificationStatus {
  SENT = "Sent",
  DELIVERED = "Delivered",
  FAILED = "Failed",
  READ = "Read"
}

export enum NotificationPriority {
  LOW = "Low",
  NORMAL = "Normal",
  URGENT = "Urgent"
}
export interface CaregiverNotification {
  id: string;
  caregiver_id: string | null; // Nullable for "All Caregivers"
  title: string; // Was 'type', used as title
  message: string | null;
  priority: NotificationPriority;
  method: NotificationMethod | string; // Defaulted to 'Admin Panel Broadcast'
  status: NotificationStatus; // Defaulted to 'Sent'
  created_at: string;
  recipient_display_name?: string; // For UI: caregiver name or "All Caregivers"
}
export type CaregiverNotificationFormData = {
  target_caregiver_id: string; // Special value "ALL" or a specific caregiver ID
  title: string;
  message: string;
  priority: NotificationPriority;
};


// Blog Post Types
export interface BlogPost {
  id: string;
  slug: string; 
  title: string;
  author: string;
  authorImageUrl?: string; 
  publicationDate: string; 
  imageUrl?: string; 
  excerpt: string; 
  content: string; 
  tags?: string[];
}

// Admin Payments Panel Types
export interface ServicePriceInfo {
  id: string; 
  serviceName: string; 
  price: number; 
  taxable: boolean; 
  description?: string; 
  dbId?: string; 
}

export enum ChargeStatus {
  PENDING = "Pending",
  PAID = "Paid",
  OVERDUE = "Overdue",
  CANCELLED = "Cancelled"
}

export interface PatientChargeItem {
  id: string; 
  patientId: string; 
  patientName: string; 
  description: string; 
  amount: number; 
  paymentMethod?: string; 
  status: ChargeStatus; 
  chargeDate: string; 
  dueDate?: string; 
}

export enum SubscriptionStatus {
  ACTIVE = "Active",
  CANCELLED = "Cancelled",
  PAST_DUE = "Past Due"
}

export interface SubscriptionPlanInfo { 
  id: string; 
  planName: string; 
  price: number; 
  duration: 'monthly' | 'annually' | 'weekly' | string; 
  features: string[]; 
  patientId?: string; 
  startDate?: string; 
  endDate?: string; 
  status?: SubscriptionStatus; 
  dbId?: string; 
}


export enum TransactionType {
  CHARGE = "Charge",
  SUBSCRIPTION = "Subscription Payment",
  REFUND = "Refund",
  ADJUSTMENT = "Adjustment"
}

export enum TransactionStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
  REFUNDED = "Refunded"
}

export interface TransactionItem {
  id: string; 
  date: string; 
  type: TransactionType;
  description: string; 
  amount: number; 
  status: TransactionStatus; 
  referenceId?: string; 
  patientName?: string; 
}

export enum RefundRequestStatus { 
  REQUESTED = "Requested",
  PROCESSING = "Processing",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  COMPLETED = "Completed" 
}

export interface RefundItem {
  id: string; 
  transactionId: string; 
  patientName: string; 
  amount: number; 
  reason: string; 
  proofUrl?: string | null; 
  status: RefundRequestStatus; 
  requestedDate: string; 
  processedDate?: string; 
  dbId?: string; 
}

// Admin Bookings Panel
export type BookingSubTabType = 'list_view' | 'calendar_view' | 'logs' | 'manual_entry';

// Patient Type (for new `patients` table)
export interface Patient {
  id: string; // UUID
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

// Data for the public booking form
export interface PublicBookingFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string; // Corresponds to services.id (UUID)
  serviceName: string; // To store in bookings.service (text field)
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  preferredCaregiverId?: string; // Corresponds to caregivers.id (UUID)
}

// For submission result on public booking page
export interface SubmissionResult {
  success: boolean;
  bookingId?: string;
  message: string;
  bookedServiceName?: string;
  bookedDate?: string;
  bookedTime?: string;
}
