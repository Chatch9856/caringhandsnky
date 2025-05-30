
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
  id: string; // remains slug-like, e.g., 'personal-care'
  name: string; // Now potentially editable
  description: string; // Now potentially editable
  category: ServiceCategory; // Remains fixed
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Static icon mapping
  pricePerHour?: number; // Now potentially editable
  details?: string[]; // Now potentially editable as a list or rich text
  contentKeyName?: string; // e.g., 'service_personal_care_name'
  contentKeyDescription?: string; // e.g., 'service_personal_care_description'
  contentKeyDetails?: string; // e.g., 'service_personal_care_details'
}

export enum BookingStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  ARCHIVED = "Archived" // New status
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string; 
  serviceName: string; // This will be the name of the service at the time of booking
  requestedDate: string; 
  requestedTime: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  submittedAt: string; 
}

export interface Testimonial {
  id: string; // Can be a DB ID or content key
  author: string; // Editable
  text: string; // Editable
  rating: number; // 1-5 stars, Editable
  date: string; // Editable
  contentKey?: string; // e.g., 'testimonial_t1'
}

export interface PaymentMethod {
  id: string; // e.g., "paypal", "stripe"
  name: string; // e.g., "PayPal", "Stripe"
  identifier: string; // User ID, Payment Link, API Key hint
  instructions?: string;
  isEnabled: boolean;
  logoUrl?: string; // URL for the payment gateway logo
  officialLink?: string; // Official link to the payment gateway
}

export enum SiteContentType {
  HOME_HERO_TITLE = "home_hero_title",
  HOME_HERO_SUBTITLE = "home_hero_subtitle",
  HOME_WHY_US_SNIPPET_TITLE = "home_why_us_snippet_title",
  HOME_WHY_US_REASON1_TITLE = "home_why_us_reason1_title",
  HOME_WHY_US_REASON1_DESC = "home_why_us_reason1_desc",
  // Add more keys for each editable section
  SERVICE_INTRO_TITLE = "service_intro_title",
  SERVICE_INTRO_SUBTITLE = "service_intro_subtitle",
  WHY_US_PAGE_TITLE = "why_us_page_title",
  WHY_US_PAGE_SUBTITLE = "why_us_page_subtitle",
  // For dynamic items like services/testimonials, content might be stored directly with them
  // or referenced by a key if they become fully dynamic from DB
  PAY_ONLINE_INTRO = "pay_online_intro",
  PAY_ONLINE_FOOTER = "pay_online_footer",
  URGENT_HELP_MAIN_TEXT = "urgent_help_main_text",
  URGENT_HELP_EMERGENCY_CALL_TEXT = "urgent_help_emergency_call_text",
  TESTIMONIALS_PAGE_INTRO = "testimonials_page_intro",
  TESTIMONIALS_PAGE_SUBMIT_CTA = "testimonials_page_submit_cta",
}

export interface SiteContent {
  sectionKey: SiteContentType | string; // Allow dynamic keys for services/testimonials
  contentHtml: string; // Store as HTML, use a simple editor or textarea
  updatedAt?: string;
}

export enum AdminSettingKey {
  SMTP_HOST = "smtp_host",
  SMTP_PORT = "smtp_port",
  SMTP_USER = "smtp_user",
  SMTP_PASS = "smtp_pass", // Should be stored encrypted if in DB
  SMTP_FROM_EMAIL = "smtp_from_email",
  GOOGLE_MAPS_API_KEY = "google_maps_api_key", // For more advanced map features
  ENABLE_MAP_PREVIEW = "enable_map_preview", // Toggle for address preview
  ENABLE_CALENDAR_INTEGRATION = "enable_calendar_integration",
  CALENDAR_EMBED_URL = "calendar_embed_url",
  PAYMENT_METHODS_CONFIG = "payment_methods_config", // Added missing key
}

export interface AdminSetting {
  settingKey: AdminSettingKey | string;
  value: any; // Can be string, number, boolean, JSON object
}

export enum NotificationType {
  NEW_BOOKING_ADMIN = "new_booking_admin",
  NEW_USER_ADMIN = "new_user_admin", // If user registration is added
  BOOKING_CONFIRMATION_PATIENT = "booking_confirmation_patient",
  BOOKING_STATUS_UPDATE_PATIENT = "booking_status_update_patient"
}

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
  ARCHIVED = "archived" // For admin inbox
}
export interface Notification {
  id: string;
  recipientEmail?: string; // For patient notifications
  userId?: string; // For admin user associated with this notification
  type: NotificationType;
  title: string;
  message: string; // Can be HTML
  data?: Record<string, any>; // e.g., bookingId
  status: NotificationStatus;
  createdAt: string;
}

// For editable service structure if fully DB driven
export interface EditableService extends Omit<Service, 'icon' | 'category'> {
  category: ServiceCategory; // Still fixed for logic
  iconIdentifier: string; // e.g., 'PersonIcon', to map to actual icon components
  // content is stored in site_content or a dedicated services table
}
