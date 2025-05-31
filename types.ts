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
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  pricePerHour?: number; 
  details?: string[]; 
}

export interface PublicService { 
  id: string; 
  name: string;
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


export interface AdminBooking {
  id: string; 
  patient_id: string | null; 
  patient_display_info: string; 
  caregiver_id: string | null; 
  caregiver_full_name?: string | null; 
  service_name: string; 
  location: string | null; 
  booking_date: string; 
  start_time: string; 
  end_time: string | null; 
  notes: string | null; 
  status: BookingStatus; 
  created_at: string; 
}


export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number; 
  date: string; 
}


export interface AppPaymentGateway {
  dbId?: string; 
  type: string; 
  identifier: string; 
  instructions?: string;
  qrCodeUrl?: string | null; 
  isEnabled: boolean; 
  qrCodeFile?: File | null; 
  currentQrPath?: string | null; 
}



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


export interface PublicCaregiver {
  id: string; 
  full_name: string;
}


export type CaregiverFormData = Omit<Caregiver, 'id' | 'created_at'> & { id?: string };


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
  caregiver_full_name?: string; 
  patient_id: string | null; 
  shift_date: string; 
  start_time: string; 
  end_time: string; 
  location: string | null;
  notes: string | null; 
  patient_identifier_notes?: string; 
  status: ShiftStatus;
  created_at: string;
}

export type CaregiverShiftFormData = Omit<CaregiverShift, 'id' | 'created_at' | 'caregiver_full_name' | 'status'> & {
  status?: ShiftStatus; 
};



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



export interface CaregiverIncident {
  id: string;
  caregiver_id: string;
  type: string | null;
  description: string | null;
  added_by: string | null; 
  created_at: string;
  attachment_url?: string | null; 
}


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
  caregiver_id: string | null; 
  title: string; 
  message: string | null;
  priority: NotificationPriority;
  method: NotificationMethod | string; 
  status: NotificationStatus; 
  created_at: string;
  recipient_display_name?: string; 
}
export type CaregiverNotificationFormData = {
  target_caregiver_id: string; 
  title: string;
  message: string;
  priority: NotificationPriority;
};



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


export type BookingSubTabType = 'list_view' | 'calendar_view' | 'logs' | 'manual_entry';


export interface Patient {
  id: string; 
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
}


export interface PublicBookingFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string; 
  serviceName: string; 
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  preferredCaregiverId?: string; 
}


export interface SubmissionResult {
  success: boolean;
  bookingId?: string;
  message: string;
  bookedServiceName?: string;
  bookedDate?: string;
  bookedTime?: string;
}

// --- NOTIFICATION ENGINE TYPES ---
export enum NotificationType {
  // Patient-facing
  NEW_BOOKING_PATIENT = "NEW_BOOKING_PATIENT",
  BOOKING_APPROVED_PATIENT = "BOOKING_APPROVED_PATIENT",
  BOOKING_REJECTED_PATIENT = "BOOKING_REJECTED_PATIENT",
  BOOKING_CANCELLED_PATIENT = "BOOKING_CANCELLED_PATIENT", // If admin cancels
  BOOKING_REMINDER_PATIENT = "BOOKING_REMINDER_PATIENT", // 24hr before
  PAYMENT_RECEIVED_PATIENT = "PAYMENT_RECEIVED_PATIENT",
  SUBSCRIPTION_ACTIVATED_PATIENT = "SUBSCRIPTION_ACTIVATED_PATIENT",
  SUBSCRIPTION_RENEWAL_REMINDER_PATIENT = "SUBSCRIPTION_RENEWAL_REMINDER_PATIENT",
  SUBSCRIPTION_ENDED_PATIENT = "SUBSCRIPTION_ENDED_PATIENT",
  NEW_MESSAGE_PATIENT = "NEW_MESSAGE_PATIENT", // For patient messages
  CASE_UPDATE_PATIENT = "CASE_UPDATE_PATIENT", // For case notes/status visible to patient

  // Admin-facing
  NEW_BOOKING_ADMIN = "NEW_BOOKING_ADMIN",
  BOOKING_CANCELLED_BY_PATIENT_ADMIN = "BOOKING_CANCELLED_BY_PATIENT_ADMIN",
  PAYMENT_FAILED_ADMIN = "PAYMENT_FAILED_ADMIN",
  REFUND_REQUEST_ADMIN = "REFUND_REQUEST_ADMIN",
  LOW_INVENTORY_ADMIN = "LOW_INVENTORY_ADMIN",
  NEW_MESSAGE_ADMIN = "NEW_MESSAGE_ADMIN", // If a patient/caregiver messages admin
  CASE_CREATED_ADMIN = "CASE_CREATED_ADMIN",
  CASE_NOTE_ADDED_ADMIN = "CASE_NOTE_ADDED_ADMIN", // If patient adds a note to their case

  // Caregiver-facing
  NEW_SHIFT_ASSIGNMENT_CAREGIVER = "NEW_SHIFT_ASSIGNMENT_CAREGIVER",
  SHIFT_REMINDER_CAREGIVER = "SHIFT_REMINDER_CAREGIVER",
  SHIFT_CANCELLED_CAREGIVER = "SHIFT_CANCELLED_CAREGIVER",
  NEW_MESSAGE_CAREGIVER = "NEW_MESSAGE_CAREGIVER", // For caregiver messages
  CASE_ASSIGNED_CAREGIVER = "CASE_ASSIGNED_CAREGIVER",
  CASE_NOTE_ADDED_CAREGIVER = "CASE_NOTE_ADDED_CAREGIVER", // If admin adds note to their assigned case

  // General System
  PASSWORD_RESET = "PASSWORD_RESET", // For user accounts in general
  WELCOME_EMAIL = "WELCOME_EMAIL", // For new patient/user accounts
}

export enum NotificationMedium {
  EMAIL = "EMAIL",
  SMS = "SMS",
  // IN_APP = "IN_APP" // Future consideration
}
export enum NotificationLogStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED", // If supported by provider
  FAILED = "FAILED",
  READ = "READ" // For in-app, if applicable
}
export interface NotificationLog {
  id: string;
  user_id: string | null; // Who the notification is for (patient_id, caregiver_id, or admin_user_id)
  recipient_contact: string; // Actual email or phone number used
  notification_type: NotificationType | string;
  medium: NotificationMedium | string;
  status: NotificationLogStatus | string;
  subject?: string | null; // For email
  body?: string | null; // For email/SMS content or template ID
  error_message?: string | null;
  reference_id?: string | null; // e.g., booking_id, case_id
  created_at: string;
}
export interface NotificationEventSetting {
  id: string; // DB ID
  event_type: NotificationType | string; // Unique key
  email_enabled: boolean;
  sms_enabled: boolean;
  description?: string | null; // For admin display
  updated_at: string;
}


// --- PATIENT DASHBOARD TYPES ---
export type PatientDashboardTabType = 'profile' | 'upcoming_bookings' | 'booking_history' | 'subscription' | 'billing' | 'messages' | 'my_cases';

export interface PatientSubscription {
  id: string;
  patient_id: string;
  plan_name: string;
  price: number;
  duration: string;
  features: string[];
  start_date: string;
  end_date: string | null;
  status: SubscriptionStatus | string;
  created_at: string;
}


// --- ADMIN PANEL: REPORTS, INVENTORY, ACTIVITY LOG ---
export type AdminTabType = 'bookings' | 'payments' | 'caregivers' | 'settings' | 'reports' | 'inventory' | 'activity_log' | 'messages' | 'cases';

// Reports
export interface ReportWidgetData {
  title: string;
  value: string | number;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Ensure icon accepts SVGProps
  trend?: string; // e.g., "+5% from last month"
}
export interface ReportChartDataPoint {
  label: string;
  value: number;
}

// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  category?: string | null;
  quantity: number;
  reorder_level?: number | null;
  unit?: string | null; // e.g., 'pcs', 'box', 'ml'
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
export type InventoryItemFormData = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'> & { id?: string };

export enum InventoryLogActionType {
  STOCK_IN = "Stock In",
  STOCK_OUT = "Stock Out",
  ADJUSTMENT_ADD = "Adjustment (Add)",
  ADJUSTMENT_REMOVE = "Adjustment (Remove)",
  INITIAL_STOCK = "Initial Stock",
}
export interface InventoryLog {
  id: string;
  item_id: string;
  item_name?: string; // For display
  action_type: InventoryLogActionType | string;
  quantity_changed: number;
  user_info?: string | null; // Who performed action
  notes?: string | null;
  created_at: string;
}

// Activity Log
export interface AuditLogEntry {
  id: string;
  module: string | null;
  action: string | null;
  user_info: string | null; // Stores more detailed user info (e.g., Admin name, Patient email)
  target_id: string | null;
  target_type?: string | null; // e.g., "Booking", "Caregiver"
  notes: string | null;
  timestamp: string;
}

// --- MESSAGING SYSTEM TYPES ---
export enum UserType {
  ADMIN = 'admin',
  PATIENT = 'patient',
  CAREGIVER = 'caregiver',
}

export interface MessageUser { // Simplified user for display in conversations/messages
  id: string; // patient_id, caregiver_id, or ADMIN_USER_ID
  name: string;
  type: UserType;
  avatarUrl?: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_type: UserType;
  recipient_type: UserType;
  content: string;
  created_at: string; // ISO string
  read_at?: string | null; // ISO string
  // For UI display primarily:
  sender?: MessageUser; 
  recipient?: MessageUser;
}

export interface Conversation {
  id: string; // Generated (e.g., user1Id_user2Id sorted alphabetically)
  partner: MessageUser; // The other user in the conversation
  lastMessage: Message | null;
  unreadCount: number;
  updated_at: string; // Timestamp of the last message or interaction
}


// --- CASE MANAGEMENT TYPES ---
export enum CaseStatus {
  OPEN = "Open",
  ACTIVE = "Active", // Work in progress
  PENDING_PATIENT = "Pending Patient Input",
  PENDING_STAFF = "Pending Staff Input",
  RESOLVED = "Resolved",
  CLOSED = "Closed", // Resolved and no further action
}

export type CaseTag = "Urgent" | "Follow-Up" | "Billing Inquiry" | "Service Quality" | "Technical Support" | "Feedback" | string;

export interface CaseFile {
  id: string;
  case_id: string;
  uploader_id?: string | null;
  uploader_type?: UserType | string | null;
  uploader_name?: string | null;
  file_name: string;
  file_path: string; // For storage identification
  file_url: string; // Public URL for access
  file_type?: string | null; // MIME type
  file_size?: number | null; // In bytes
  created_at: string;
  visible_to_patient: boolean;
}

export interface CaseNote {
  id: string;
  case_id: string;
  author_id?: string | null;
  author_type?: UserType | string | null;
  author_name?: string | null; // For display
  note: string;
  created_at: string;
  visible_to_patient: boolean;
}

export interface Case {
  id: string;
  patient_id: string;
  patient_name?: string; // For display
  assigned_staff_id?: string | null; // Caregiver ID
  assigned_staff_name?: string; // For display
  title: string;
  description: string;
  tags: CaseTag[];
  status: CaseStatus | string;
  created_by_id?: string | null; // Admin/Staff ID
  created_by_type?: UserType | string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  // For UI display, not direct DB fields necessarily
  notes?: CaseNote[];
  files?: CaseFile[];
}

export type CaseFormData = {
  patient_id: string;
  title: string;
  description: string;
  assigned_staff_id?: string; // Caregiver ID
  status: CaseStatus | string;
  tags?: string; // Comma-separated string from input
};

export type CaseNoteFormData = {
  case_id: string;
  note: string;
  visible_to_patient: boolean;
};

export type AdminCaseSortOption = 'created_at_desc' | 'created_at_asc' | 'updated_at_desc' | 'status' | 'patient_name';