import React from 'react';
import { Service, ServiceCategory, Testimonial, PredefinedSkill, PredefinedCertification, BlogPost, AppPaymentGateway, DocumentType } from './types';

export const ROUTE_HOME = "/";
export const ROUTE_SERVICES = "/services";
export const ROUTE_BOOK_CARE = "/book-care"; 
export const ROUTE_BOOKING_PUBLIC = "/book"; 
export const ROUTE_ADMIN_DASHBOARD = "/admin";
export const ROUTE_PAY_ONLINE = "/pay-online";
export const ROUTE_TESTIMONIALS = "/testimonials";
export const ROUTE_URGENT_HELP = "/urgent-help";
export const ROUTE_WHY_US = "/why-us";
export const ROUTE_BLOG = "/blog";
export const ROUTE_BLOG_POST_DETAIL_PREFIX = "/blog/"; 
export const ROUTE_PATIENT_DASHBOARD = "/dashboard";
export const ROUTE_LOGIN = "/login";


// Admin Dashboard Main Tab Identifiers
export const ADMIN_TAB_BOOKINGS = 'bookings';
export const ADMIN_TAB_PAYMENTS = 'payments';
export const ADMIN_TAB_CAREGIVERS = 'caregivers';
export const ADMIN_TAB_SETTINGS = 'settings';
export const ADMIN_TAB_REPORTS = 'reports';
export const ADMIN_TAB_INVENTORY = 'inventory';
export const ADMIN_TAB_ACTIVITY_LOG = 'activity_log';
export const ADMIN_TAB_MESSAGES = 'messages';
export const ADMIN_TAB_CASES = 'cases';


// Admin Payments Panel Sub-Tab Identifiers
export const PAYMENT_SUB_TAB_GATEWAYS = 'gateways';
export const PAYMENT_SUB_TAB_PRICING = 'pricing';
export const PAYMENT_SUB_TAB_CHARGES = 'charges';
export const PAYMENT_SUB_TAB_SUBSCRIPTIONS = 'subscriptions';
export const PAYMENT_SUB_TAB_TRANSACTIONS = 'transactions';
export const PAYMENT_SUB_TAB_REFUNDS = 'refunds';

// Admin Caregiver Panel Sub-Tab Identifiers
export const CAREGIVER_SUB_TAB_LIST = 'list';
export const CAREGIVER_SUB_TAB_SHIFTS = 'shifts';
export const CAREGIVER_SUB_TAB_DOCUMENTS = 'documents';
export const CAREGIVER_SUB_TAB_INCIDENTS = 'incidents';
export const CAREGIVER_SUB_TAB_NOTIFICATIONS = 'notifications';

// Admin Bookings Panel Sub-Tab Identifiers
export const BOOKINGS_SUB_TAB_LIST_VIEW = 'list_view';
export const BOOKINGS_SUB_TAB_CALENDAR_VIEW = 'calendar_view';
export const BOOKINGS_SUB_TAB_LOGS = 'logs';
export const BOOKINGS_SUB_TAB_MANUAL_ENTRY = 'manual_entry';

// Patient Dashboard Sub-Tab Identifiers
export const PATIENT_DASHBOARD_PROFILE = 'profile';
export const PATIENT_DASHBOARD_UPCOMING_BOOKINGS = 'upcoming_bookings';
export const PATIENT_DASHBOARD_BOOKING_HISTORY = 'booking_history';
export const PATIENT_DASHBOARD_SUBSCRIPTION = 'subscription';
export const PATIENT_DASHBOARD_BILLING = 'billing';
export const PATIENT_DASHBOARD_MESSAGES = 'messages';
export const PATIENT_DASHBOARD_CASES = 'my_cases';


// --- EXISTING ICONS ---
export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>
);

export const PersonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Settings
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.166.399.506.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.399.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.807.108-1.204-.165-.399-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.399-.165.71-.505.78-.929l.15-.894Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21m-12-5.25a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v.75m13.5 0v.75a2.25 2.25 0 0 1-2.25 2.25H15a2.25 2.25 0 0 1-2.25-2.25V8.25m0 0H6.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement> & {filled?: boolean}) => {
  const { filled, className = '', ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
         fill={filled ? "currentColor" : "none"} 
         stroke="currentColor" strokeWidth={1.5} 
         className={`inline-block w-5 h-5 ${filled ? 'text-amber-400' : 'text-gray-300'} ${className}`}
         {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
};

export const HandshakeIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.994 0-3.182-3.182A8.25 8.25 0 0 0 9.171 6.12m0 6.175 3.181-3.182m0-4.39 3.18 3.181" />
  </svg>
);

export const HomeModernIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const MedicalShieldIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0V6M3 12h18" />
  </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const CarIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.139A48.784 48.784 0 0 0 12 5.25c-2.295 0-4.516.325-6.674.92.007.001.014.002.021.002Z" />
  </svg>
);


export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5V12c0-1.657-1.343-3-3-3h-1.5M4.5 13.5V12c0-1.657 1.343-3 3-3h1.5" />
  </svg>
);

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const RefreshIconSolid = (props: React.SVGProps<SVGSVGElement>) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.458 2.52l-.345.344a.75.75 0 1 1-1.06-1.06l.344-.345a5.504 5.504 0 0 1 7.017-7.017l.343.343a.75.75 0 0 1-1.06 1.061l-.343-.343a3.995 3.995 0 0 0-5.09 1.024 3.999 3.999 0 0 0-1.025 5.09.75.75 0 1 1-1.408-.518 5.5 5.5 0 0 1 9.458-2.52ZM4.688 8.576a5.5 5.5 0 0 1 9.457-2.52l.345-.344a.75.75 0 1 1 1.06 1.06l-.344.345a5.504 5.504 0 0 1-7.017 7.017l-.343-.343a.75.75 0 0 1 1.06-1.061l.343.343a3.995 3.995 0 0 0 5.09-1.024 3.999 3.999 0 0 0 1.025-5.09.75.75 0 1 1 1.408.518 5.5 5.5 0 0 1-9.457 2.52Z" clipRule="evenodd" />
  </svg>
);

export const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const DefaultCaregiverIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const NewspaperIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.625a2.25 2.25 0 01-2.25-2.25V7.875c0-.621.504-1.125 1.125-1.125H7.5M12 4.5L12 7.5m0 0l0 3m0-3h-3m3 0h3m-3-3l0-3m0 3l0 3" />
  </svg>
);


export const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const ReceiptPercentIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5H5.625c-.621 0-1.125.504-1.125 1.125v6c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-6c0-.621-.504-1.125-1.125-1.125H12M17.25 12a4.5 4.5 0 0 1-9 0 4.5 4.5 0 0 1 9 0Zm-.217-2.613a.374.374 0 0 1 .534.533l-2.436 2.437a.375.375 0 0 1-.534-.534l2.436-2.436Z" />
  </svg>
);

export const RectangleStackIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-3.75 2.063M21.75 12l-4.179-2.25M6.429 14.25l5.571 3 5.571-3M6.429 14.25L2.25 12l4.179-2.25m11.142 0l4.179 2.25-4.179 2.25m0 0l-5.571 3-5.571-3" />
  </svg>
);

export const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

export const ArrowDownTrayIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const CloudArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);


export const ArrowUturnLeftIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>
);


export const ClockSolidIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
  </svg>
);

export const DocumentDuplicateIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75M9.06 4.5H12m3.75 0h.375a1.125 1.125 0 0 1 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-9.75A1.125 1.125 0 0 1 3.375 7.125v-1.5A1.125 1.125 0 0 1 4.5 4.5m9.06 0v1.5h-9.06V4.5m9.06 0H12M9 4.5h.75M12 4.5H9m3 13.5V12m0 0H9m3 0h3m3-3H9m0 0H6.75M9 12H6.75m9 0h2.25m-2.25 0H12m2.25 0H9" />
  </svg>
);

export const ExclamationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0V6M3 12h18" />
  </svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);


export const CalendarSolidIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2Zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 010 1.5H5.5a.75.75 0 01-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM11.25 12h.008v.008h-.008V12z" />
  </svg>
);

export const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);


export const ClipboardDocumentCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25c.414 0 .82.123 1.188.354M10.125 2.25V7.5c0 .621.504 1.125 1.125 1.125h4.5M13.5 14.25L11.25 12l-1.258 1.258a1.12 1.12 0 00-.317.522l-.038.156a.68.68 0 00.317.773l2.072 1.179a.68.68 0 00.773-.317l.038-.156a1.12 1.12 0 00-.317-.522L13.5 14.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
);

// --- ICONS FOR ADMIN PANEL: REPORTS, INVENTORY, ACTIVITY LOG ---
export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Reports
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);
export const ArchiveBoxIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Inventory
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
export const DocumentMagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Activity Log / Audit Log
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h4.5m0 0l1.638-1.638a1.125 1.125 0 00-1.59-1.59L12.75 17.25m0 0H11.25m4.125 0a2.25 2.25 0 002.25-2.25V6.75c0-1.242-.99-2.25-2.217-2.25H8.25c-1.227 0-2.217 1.008-2.217 2.25v10.5A2.25 2.25 0 008.25 19.5h7.5c1.227 0 2.217-1.008 2.217-2.25v-2.625Z" />
  </svg>
);

// --- ICONS FOR MESSAGING & CASE MANAGEMENT ---
export const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Messages Tab
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.688-3.091a4.501 4.501 0 00-3.444-1.354H6.75c-1.136 0-2.1-.847-2.193-1.98A17.882 17.882 0 013 12.607v-4.285c0-.97.616-1.813 1.5-2.097m15.75 0c-.16-.533-.446-1.007-.823-1.397a4.5 4.5 0 00-5.916-1.796L12 4.999l-1.011-1.094a4.5 4.5 0 00-5.916 1.796S3.963 6.702 3.75 7.25m15.75 0v-.093c0-.318-.072-.621-.213-.899a2.255 2.255 0 00-1.06-.819l-3.428-1.714a2.253 2.253 0 00-2.07 0l-3.427 1.714a2.255 2.255 0 00-1.06.819A2.252 2.252 0 006 7.157v.093m12 1.354H6.75" />
  </svg>
);
export const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Cases Tab
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15M12 12.375v4.125m0 0A2.25 2.25 0 019.75 18.75h-1.5A2.25 2.25 0 016 16.5v-4.125m6.375 0V6.75A2.25 2.25 0 009.75 4.5h-1.5A2.25 2.25 0 006 6.75v4.125M12 12.375V6.75m3.75 5.625V6.75a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v5.625m3.75 0V12.375M12 12.375v-1.5m3.75 1.5v-1.5M12 6.75H9.75m3 0h1.5M12 6.75V4.5M6 16.5v-4.125M18 16.5v-4.125" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12.375h16.5M3.75 9h16.5" />
  </svg>
);
export const PaperclipIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Attach File
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.687 7.687a1.5 1.5 0 002.121 2.121l7.687-7.687-2.121-2.121z" />
  </svg>
);
export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Send Message
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);
export const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For assigned staff / group contexts
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-2.684m0-2.684a3 3 0 110-5.368 3 3 0 010 5.368zM12.75 6.75A2.25 2.25 0 0115 9v2.25l-3.75 3.75-3.75-3.75V9A2.25 2.25 0 0112.75 6.75zM6 15A2.25 2.25 0 008.25 12.75v-1.5a2.25 2.25 0 00-4.5 0v1.5A2.25 2.25 0 006 15z" />
  </svg>
);

// --- DATA CONSTANTS ---
export const SAMPLE_SERVICES: Service[] = [
  { 
    id: 'personal-care', 
    name: 'Personal Care Assistance', 
    description: 'Dignified help with daily activities like bathing, dressing, and mobility.',
    category: ServiceCategory.PERSONAL_CARE, 
    icon: <PersonIcon className="w-12 h-12 text-primary" />,
    pricePerHour: 25,
    details: ["Bathing and hygiene assistance", "Dressing and grooming", "Mobility support and transfers", "Medication reminders"]
  },
  { 
    id: 'companionship', 
    name: 'Companionship & Socialization', 
    description: 'Friendly company, conversation, and engagement in favorite hobbies.',
    category: ServiceCategory.COMPANIONSHIP, 
    icon: <HandshakeIcon className="w-12 h-12 text-secondary" />,
    pricePerHour: 22,
    details: ["Meaningful conversation and engagement", "Accompanying to social events", "Playing games and hobbies", "Reading aloud"]
  },
  { 
    id: 'household-help', 
    name: 'Light Household Help', 
    description: 'Support with light housekeeping, meal prep, and errands.',
    category: ServiceCategory.HOUSEHOLD_HELP, 
    icon: <HomeModernIcon className="w-12 h-12 text-accent" />,
    pricePerHour: 20,
    details: ["Light tidying and cleaning", "Meal planning and preparation", "Laundry and linen changes", "Grocery shopping and errands"]
  },
  { 
    id: 'specialized-care', 
    name: 'Specialized Care Support', 
    description: 'Tailored care for conditions like Dementia, Alzheimer’s, or post-surgery recovery.',
    category: ServiceCategory.SPECIALIZED_CARE, 
    icon: <MedicalShieldIcon className="w-12 h-12 text-red-500" />,
    pricePerHour: 30,
    details: ["Memory care support", "Post-operative assistance", "Chronic condition management support", "Coordination with healthcare providers"]
  },
  { 
    id: 'respite-care', 
    name: 'Respite Care', 
    description: 'Temporary relief for family caregivers, providing peace of mind.',
    category: ServiceCategory.RESPITE_CARE, 
    icon: <ClockIcon className="w-12 h-12 text-purple-500" />,
    pricePerHour: 28,
    details: ["Short-term care solutions", "Flexible scheduling", "Support for primary caregivers", "Ensuring continuity of care"]
  },
  { 
    id: 'transportation', 
    name: 'Transportation Services', 
    description: 'Safe and reliable transportation to appointments, social outings, and errands.',
    category: ServiceCategory.TRANSPORTATION, 
    icon: <CarIcon className="w-12 h-12 text-blue-500" />,
    pricePerHour: 24,
    details: ["Medical appointments", "Grocery shopping and errands", "Social events and visits", "Wheelchair accessible options (if available)"]
  }
];

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { id: 't1', author: 'Mary S.', text: 'CaringHandsNKY has been a blessing for our family. Their caregivers are compassionate and professional. Highly recommend!', rating: 5, date: '2024-05-15' },
  { id: 't2', author: 'John B.', text: 'The team provided excellent support for my father after his surgery. They were attentive and made his recovery much smoother.', rating: 5, date: '2024-04-20' },
  { id: 't3', author: 'Lisa P.', text: 'Finding reliable care was stressful until we found CaringHandsNKY. Their companionship service has made a huge difference for my mother.', rating: 4, date: '2024-06-01' },
];


export const AVAILABLE_GATEWAY_TYPES: { type: string, defaultInstructions: string, placeholder: string }[] = [
  { type: "CashApp", defaultInstructions: "Send payment to our CashApp ID.", placeholder: "$YourCashTag" },
  { type: "Venmo", defaultInstructions: "Pay us via Venmo @OurVenmoHandle.", placeholder: "@YourVenmo" },
  { type: "Square", defaultInstructions: "Use our Square payment link.", placeholder: "https://squareup.com/..." },
  { type: "Zelle", defaultInstructions: "Send payment via Zelle to our registered email/phone.", placeholder: "your.email@example.com" },
  { type: "PayPal", defaultInstructions: "Send payment to our PayPal email or link.", placeholder: "your-paypal-email@example.com or paypal.me/yourlink" },
];



export const CAREGIVER_PHOTO_BUCKET = 'caregiver_photos';
export const CAREGIVER_DOCUMENTS_BUCKET = 'caregiver_documents';
export const CAREGIVER_INCIDENT_ATTACHMENTS_BUCKET = 'incident_attachments';
export const CASE_FILES_BUCKET = 'case_files'; 


export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']; 
export const MAX_IMAGE_SIZE_MB = 5; 

export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf', 
    'image/png', 
    'image/jpeg', 
    'image/webp',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
];
export const MAX_DOCUMENT_SIZE_MB = 10;


export const CAREGIVER_DOCUMENT_TYPE_OPTIONS: DocumentType[] = [
    DocumentType.LICENSE,
    DocumentType.ID,
    DocumentType.TRAINING_CERTIFICATE,
    DocumentType.CERTIFICATION,
    DocumentType.BACKGROUND_CHECK,
    DocumentType.OTHER,
];


export const PREDEFINED_SKILLS_LIST: PredefinedSkill[] = Object.values(PredefinedSkill);
export const PREDEFINED_CERTIFICATIONS_LIST: PredefinedCertification[] = Object.values(PredefinedCertification);



export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-post-1',
    slug: 'understanding-home-care-options',
    title: 'Understanding Home Care: A Guide for Families',
    author: 'Dr. Eleanor Vance',
    authorImageUrl: undefined, 
    publicationDate: '2024-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d49619?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Navigating the world of home care can be challenging. This guide breaks down the different types of care available and how to choose the best option for your loved one.',
    content: `
      <h2>Introduction to Home Care</h2>
      <p>Choosing the right care for a loved one is a significant decision. Home care services offer a way for individuals to receive personalized support in the comfort and familiarity of their own homes. This can range from companionship and help with daily tasks to more specialized medical care.</p>
      <h3>Types of Home Care Services</h3>
      <p>There are several categories of home care, each designed to meet different needs:</p>
      <ul>
        <li><strong>Personal Care and Companionship:</strong> Assistance with activities of daily living (ADLs) such as bathing, dressing, and meal preparation, as well as providing social interaction.</li>
        <li><strong>Skilled Nursing Care:</strong> Medical care provided by licensed nurses, including medication administration, wound care, and health monitoring. This is often required for individuals with chronic conditions or recovering from surgery.</li>
        <li><strong>Respite Care:</strong> Short-term care to provide relief for primary family caregivers.</li>
        <li><strong>Specialized Care:</strong> Focused support for conditions like dementia, Alzheimer's, or Parkinson's disease.</li>
      </ul>
      <h3>Benefits of Home Care</h3>
      <p>Home care offers numerous benefits, including:</p>
      <ul>
        <li><strong>Comfort and Independence:</strong> Allows individuals to remain in a familiar environment.</li>
        <li><strong>Personalized Attention:</strong> One-on-one care tailored to specific needs.</li>
        <li><strong>Family Involvement:</strong> Easier for families to participate in care planning and visits.</li>
        <li><strong>Cost-Effectiveness:</strong> Can be more affordable than institutional care for certain levels of need.</li>
      </ul>
      <p>At CaringHandsNKY, we are committed to helping you understand these options and find the best fit for your family. Contact us for a consultation to discuss your specific needs.</p>
    `,
    tags: ['Home Care', 'Elder Care', 'Family Support', 'Healthcare']
  },
  {
    id: 'blog-post-2',
    slug: 'tips-for-aging-gracefully-at-home',
    title: '5 Tips for Aging Gracefully and Safely at Home',
    author: 'Sarah Miller, RN',
    authorImageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
    publicationDate: '2024-06-28',
    imageUrl: 'https://images.unsplash.com/photo-1505308302999-99439815b0ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Maintaining independence at home is a key goal for many seniors. Discover five practical tips to help ensure safety, health, and happiness while aging in place.',
    content: `
      <h2>Embracing Aging in Place</h2>
      <p>Aging gracefully at home involves a combination of proactive health management, home safety modifications, and maintaining social connections. Here are five key tips:</p>
      <h3>1. Prioritize Home Safety</h3>
      <p>Prevent falls and injuries by:</p>
      <ul>
        <li>Removing clutter and securing rugs.</li>
        <li>Installing grab bars in bathrooms and handrails on stairs.</li>
        <li>Ensuring adequate lighting throughout the home.</li>
      </ul>
      <h3>2. Stay Active and Engaged</h3>
      <p>Regular physical activity and mental stimulation are crucial. Consider:</p>
      <ul>
        <li>Low-impact exercises like walking or tai chi.</li>
        <li>Hobbies, puzzles, or learning new skills.</li>
        <li>Staying connected with friends and family, either in person or virtually.</li>
      </ul>
      <h3>3. Manage Medications Wisely</h3>
      <p>Keep track of medications by using pill organizers, setting reminders, and regularly reviewing prescriptions with a doctor or pharmacist.</p>
      <h3>4. Healthy Nutrition</h3>
      <p>A balanced diet supports overall health. Focus on fruits, vegetables, lean proteins, and whole grains. If cooking becomes difficult, explore meal delivery services or assistance with meal preparation.</p>
      <h3>5. Plan for Support</h3>
      <p>Don't hesitate to seek help when needed. This could involve family assistance, community resources, or professional home care services like those offered by CaringHandsNKY for tasks that become challenging.</p>
      <p>By taking these steps, seniors can enhance their quality of life and continue to live comfortably and safely in their own homes.</p>
    `,
    tags: ['Aging in Place', 'Senior Health', 'Home Safety', 'Wellness']
  },
   {
    id: 'blog-post-3',
    slug: 'benefits-companionship-care',
    title: 'The Unseen Benefits of Companionship Care for Seniors',
    author: 'James Peterson',
    authorImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
    publicationDate: '2024-05-10',
    excerpt: 'Companionship care goes beyond basic needs, offering vital emotional and social support that significantly improves a senior\'s quality of life.',
    content: `
      <h2>More Than Just Assistance</h2>
      <p>While practical help with daily tasks is important, the emotional well-being of seniors is equally crucial. Companionship care addresses the social and emotional needs that can sometimes be overlooked.</p>
      <h3>Combating Loneliness and Isolation</h3>
      <p>Loneliness can have serious health consequences for seniors. A companion caregiver provides regular social interaction, engaging conversation, and a friendly presence, which can greatly reduce feelings of isolation.</p>
      <h3>Encouraging Engagement in Activities</h3>
      <p>Companions can assist with and encourage participation in hobbies, outings, and social events. This could be anything from playing cards and gardening to attending community gatherings or simply going for a walk.</p>
      <h3>Providing Peace of Mind for Families</h3>
      <p>Knowing that a loved one has a dedicated companion can provide immense peace of mind for family members, especially those who live far away or have busy schedules. It ensures that the senior is not only safe but also socially engaged.</p>
      <h3>Improving Overall Well-being</h3>
      <p>The benefits of companionship are holistic. Reduced stress, improved mood, and even better cognitive function are often observed in seniors who receive regular companionship care.</p>
      <p>At CaringHandsNKY, our companionship services are designed to foster meaningful connections and enhance the daily lives of the seniors we serve.</p>
    `,
    tags: ['Companionship', 'Mental Health', 'Senior Living', 'Socialization']
  }
];


export const PAYMENT_QR_CODES_BUCKET = 'payment_qrcodes';
export const ALLOWED_QR_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
export const MAX_QR_IMAGE_SIZE_MB = 2;


export const NOTIFICATION_PRIORITY_OPTIONS = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Low', label: 'Low' },
  { value: 'Urgent', label: 'Urgent' },
];

// --- MESSAGING & CASE MANAGEMENT ---
export const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000000'; // Static ID for Admin
export const ADMIN_DISPLAY_NAME = 'CaringHandsNKY Admin';

export const MAX_CASE_FILE_SIZE_MB = 10;
export const ALLOWED_CASE_FILE_TYPES = [
    'application/pdf', 
    'image/png', 
    'image/jpeg', 
    'image/webp',
    'text/plain',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
];
