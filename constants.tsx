
import React from 'react';
import { Service, ServiceCategory, Testimonial, PaymentMethod } from './types';

export const ROUTE_HOME = "/";
export const ROUTE_SERVICES = "/services";
export const ROUTE_BOOK_CARE = "/book-care";
export const ROUTE_ADMIN_DASHBOARD = "/admin";
export const ROUTE_PAY_ONLINE = "/pay-online";
export const ROUTE_TESTIMONIALS = "/testimonials";
export const ROUTE_URGENT_HELP = "/urgent-help";
export const ROUTE_WHY_US = "/why-us";
export const ROUTE_LOGIN = "/login";
export const ROUTE_BOOKING_SUCCESS = "/booking-success";

// New Admin Routes (Sub-routes of /admin)
export const ROUTE_ADMIN_CONTENT_MANAGEMENT = "/admin/content";
export const ROUTE_ADMIN_PAYMENT_SETTINGS = "/admin/payments";
export const ROUTE_ADMIN_NOTIFICATION_LOGS = "/admin/notifications";
export const ROUTE_ADMIN_APP_SETTINGS = "/admin/settings";
export const ROUTE_ADMIN_BOOKING_ARCHIVE = "/admin/archive";


// Existing Icons
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
export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => ( // General Settings
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205-.108l-.737.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.019.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.806.272 1.203.107.397-.165.71-.505.78-.93l.15-.894Z" />
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
export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Bookings / Content Management
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);
export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Payment Settings
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
export const HandshakeIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Companionship
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.994 0-3.182-3.182A8.25 8.25 0 0 0 9.171 6.12m0 6.175 3.181-3.182m0-4.39 3.18 3.181" />
  </svg>
);
export const HomeModernIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Household Help
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
export const MedicalShieldIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Specialized Care
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0V6M3 12h18" />
  </svg>
);
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Respite Care
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
export const CarIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Transportation
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.139A48.784 48.784 0 0 0 12 5.25c-2.295 0-4.516.325-6.674.92.007.001.014.002.021.002Z" />
  </svg>
);
export const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);
export const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
</svg>
);

// New Icons
export const ArchiveBoxIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Booking Archive
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Delete
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.243.096 3.288.257m-1.04 2.503L5.272 20.25a2.25 2.25 0 0 0 2.244 2.077h8.964a2.25 2.25 0 0 0 2.244-2.077L15.728 8.25H9.042" />
  </svg>
);
export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Notifications
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.017 5.454 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);
export const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => ( // SMTP Settings / Email
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Google Maps
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

// Placeholder/Example Payment Gateway Logos - In a real app, use official SVGs or good quality images.
export const PayPalLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#0070BA">PayPal</text></svg>);
export const StripeLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#635BFF">Stripe</text></svg>);
export const SquareLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#000000">Square</text></svg>);
export const VenmoLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#008CFF">Venmo</text></svg>);
export const CashAppLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#00D632">CashApp</text></svg>);
export const GooglePayLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#EA4335">G Pay</text></svg>);
export const ApplePayLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#000000"> Pay</text></svg>);
export const ZelleLogo = (props: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 100 30" {...props}><text x="50" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#6A0DAD">Zelle</text></svg>);


export const SERVICE_ICONS: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  PersonIcon, HandshakeIcon, HomeModernIcon, MedicalShieldIcon, ClockIcon, CarIcon
};


export const SAMPLE_SERVICES: Service[] = [
  { 
    id: 'personal-care', 
    name: 'Personal Care Assistance', 
    description: 'Dignified help with daily activities like bathing, dressing, and mobility.',
    category: ServiceCategory.PERSONAL_CARE, 
    icon: <PersonIcon className="w-12 h-12 text-primary" />,
    pricePerHour: 25,
    details: ["Bathing and hygiene assistance", "Dressing and grooming", "Mobility support and transfers", "Medication reminders"],
    contentKeyName: 'service_personal_care_name',
    contentKeyDescription: 'service_personal_care_desc',
    contentKeyDetails: 'service_personal_care_details',
  },
  { 
    id: 'companionship', 
    name: 'Companionship & Socialization', 
    description: 'Friendly company, conversation, and engagement in favorite hobbies.',
    category: ServiceCategory.COMPANIONSHIP, 
    icon: <HandshakeIcon className="w-12 h-12 text-secondary" />,
    pricePerHour: 22,
    details: ["Meaningful conversation and engagement", "Accompanying to social events", "Playing games and hobbies", "Reading aloud"],
    contentKeyName: 'service_companionship_name',
    contentKeyDescription: 'service_companionship_desc',
    contentKeyDetails: 'service_companionship_details',
  },
  { 
    id: 'household-help', 
    name: 'Light Household Help', 
    description: 'Support with light housekeeping, meal prep, and errands.',
    category: ServiceCategory.HOUSEHOLD_HELP, 
    icon: <HomeModernIcon className="w-12 h-12 text-accent" />,
    pricePerHour: 20,
    details: ["Light tidying and cleaning", "Meal planning and preparation", "Laundry and linen changes", "Grocery shopping and errands"],
    contentKeyName: 'service_household_help_name',
    contentKeyDescription: 'service_household_help_desc',
    contentKeyDetails: 'service_household_help_details',
  },
  { 
    id: 'specialized-care', 
    name: 'Specialized Care Support', 
    description: 'Tailored care for conditions like Dementia, Alzheimer’s, or post-surgery recovery.',
    category: ServiceCategory.SPECIALIZED_CARE, 
    icon: <MedicalShieldIcon className="w-12 h-12 text-red-500" />,
    pricePerHour: 30,
    details: ["Memory care support", "Post-operative assistance", "Chronic condition management support", "Coordination with healthcare providers"],
    contentKeyName: 'service_specialized_care_name',
    contentKeyDescription: 'service_specialized_care_desc',
    contentKeyDetails: 'service_specialized_care_details',
  },
  { 
    id: 'respite-care', 
    name: 'Respite Care', 
    description: 'Temporary relief for family caregivers, providing peace of mind.',
    category: ServiceCategory.RESPITE_CARE, 
    icon: <ClockIcon className="w-12 h-12 text-purple-500" />,
    pricePerHour: 28,
    details: ["Short-term care solutions", "Flexible scheduling", "Support for primary caregivers", "Ensuring continuity of care"],
    contentKeyName: 'service_respite_care_name',
    contentKeyDescription: 'service_respite_care_desc',
    contentKeyDetails: 'service_respite_care_details',
  },
  { 
    id: 'transportation', 
    name: 'Transportation Services', 
    description: 'Safe and reliable transportation to appointments, social outings, and errands.',
    category: ServiceCategory.TRANSPORTATION, 
    icon: <CarIcon className="w-12 h-12 text-blue-500" />,
    pricePerHour: 24,
    details: ["Medical appointments", "Grocery shopping and errands", "Social events and visits", "Wheelchair accessible options (if available)"],
    contentKeyName: 'service_transportation_name',
    contentKeyDescription: 'service_transportation_desc',
    contentKeyDetails: 'service_transportation_details',
  }
];

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { id: 't1', author: 'Mary S.', text: 'CaringHandsNKY has been a blessing for our family. Their caregivers are compassionate and professional. Highly recommend!', rating: 5, date: '2024-05-15', contentKey: 'testimonial_t1_text' },
  { id: 't2', author: 'John B.', text: 'The team provided excellent support for my father after his surgery. They were attentive and made his recovery much smoother.', rating: 5, date: '2024-04-20', contentKey: 'testimonial_t2_text' },
  { id: 't3', author: 'Lisa P.', text: 'Finding reliable care was stressful until we found CaringHandsNKY. Their companionship service has made a huge difference for my mother.', rating: 4, date: '2024-06-01', contentKey: 'testimonial_t3_text' },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "paypal", name: "PayPal", identifier: "", instructions: "Pay using your PayPal account.", isEnabled: false, logoUrl: "paypal_logo_url_placeholder", officialLink: "https://paypal.com" },
  { id: "stripe", name: "Stripe (Card)", identifier: "", instructions: "Secure card payment via Stripe.", isEnabled: false, logoUrl: "stripe_logo_url_placeholder", officialLink: "https://stripe.com" },
  { id: "square", name: "Square", identifier: "", instructions: "Use our Square payment link.", isEnabled: false, logoUrl: "square_logo_url_placeholder", officialLink: "https://squareup.com" },
  { id: "venmo", name: "Venmo", identifier: "", instructions: "Pay us via Venmo.", isEnabled: false, logoUrl: "venmo_logo_url_placeholder", officialLink: "https://venmo.com" },
  { id: "cashapp", name: "CashApp", identifier: "", instructions: "Send payment to our CashApp ID.", isEnabled: false, logoUrl: "cashapp_logo_url_placeholder", officialLink: "https://cash.app" },
  { id: "googlepay", name: "Google Pay", identifier: "", instructions: "Use Google Pay for quick payments.", isEnabled: false, logoUrl: "googlepay_logo_url_placeholder", officialLink: "https://pay.google.com" },
  { id: "applepay", name: "Apple Pay", identifier: "", instructions: "Use Apple Pay for secure payments.", isEnabled: false, logoUrl: "applepay_logo_url_placeholder", officialLink: "https://www.apple.com/apple-pay/" },
  { id: "zelle", name: "Zelle", identifier: "", instructions: "Send payment via Zelle to our registered email/phone.", isEnabled: false, logoUrl: "zelle_logo_url_placeholder", officialLink: "https://www.zellepay.com" },
];

export const PAYMENT_METHOD_LOGOS: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  paypal: PayPalLogo,
  stripe: StripeLogo,
  square: SquareLogo,
  venmo: VenmoLogo,
  cashapp: CashAppLogo,
  googlepay: GooglePayLogo,
  applepay: ApplePayLogo,
  zelle: ZelleLogo,
};
