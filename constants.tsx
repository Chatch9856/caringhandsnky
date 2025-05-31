
import React from 'react';
import { Service, ServiceCategory, Testimonial, PredefinedSkill, PredefinedCertification, BlogPost, AppPaymentGateway, DocumentType } from './types';
import {
  Home, Settings, Users, CreditCard, BookText, BarChart3, Archive, Activity, MessageSquare, Briefcase,
  Heart, UsersRound, ShieldCheck, Zap, MessagesSquare, AlertTriangle, FileText, HandCoins,
  PercentSquare, Layers, ListOrdered, Download, UploadCloud, CornerUpLeft, Clock, Settings2, // Added Settings2
  Copy, Bell, CalendarDays, ClipboardList, SquarePen, FileCheck, Send, Paperclip, UserCog, Eye, EyeOff, Search, ChevronsUpDown, ChevronDown,
  Trash2, PlusCircle, RefreshCw, Info, CheckCircle2, XCircle // Added CheckCircle2, XCircle, Info, Trash2, PlusCircle, RefreshCw
} from 'lucide-react';


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


// --- LUCIDE ICONS ---
// General & Navigation
export const HomeIcon = Home;
export const SettingsIcon = Settings;
export const UsersIcon = UsersRound; // For Caregivers, Patients (Modern Admin)
export const CreditCardIcon = CreditCard; // Payments
export const BookingsIcon = BookText; // Bookings
export const ReportsIcon = BarChart3; // Reports
export const InventoryIcon = Archive; // Inventory
export const ActivityLogIcon = Activity; // Activity Log
export const MessagesIcon = MessageSquare; // Messages (Modern Admin)
export const CasesIcon = Briefcase; // Cases (Modern Admin)

// UI Elements specifically requested by components using direct import names
export const CheckCircleIcon = CheckCircle2; // Used in BookingRequestCard, ToastContext
export const XCircleIcon = XCircle;         // Used in BookingRequestCard, ToastContext
export const PersonIcon = UsersRound;       // Used in BookingRequestCard
export const CalendarIcon = CalendarDays;   // Used in BookingRequestCard, BlogPostCard, BlogPostPage, PatientDashboardPage
export const InformationCircleIcon = Info;  // Used in ToastContext
export const Settings2Icon = Settings2;     // For the reported error

// Other Lucide icons, often exported with a "Lucide" suffix or specific name for clarity
export const HeartIconLucide = Heart; // Brand icon
// PersonIconLucide was UsersRound, now PersonIcon covers it. If needed elsewhere:
// export const PersonIconLucide = UsersRound; 
export const MedicalShieldIconLucide = ShieldCheck; // Specialized Care
export const ClockIconLucide = Clock; // Respite Care, Time
export const CarIconLucide = Zap; // Transportation (Zap for speed/service)
export const HandshakeIconLucide = Users; // Companionship (Users for multiple people)
export const HomeModernIconLucide = Home; // Household Help
// CheckCircleIconLucide and XCircleIconLucide were incorrect mappings, replaced by direct exports above.
export const ExclamationTriangleIcon = AlertTriangle; // Used in UrgentHelpPage, NotFoundPage
export const DocumentTextIcon = FileText; // Document general, used in AdminReportsPanel
export const StarIconLucide = (props: React.SVGProps<SVGSVGElement> & { filled?: boolean }) => {
  const { filled, className = '', ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
         fill={filled ? "currentColor" : "none"} 
         stroke="currentColor" strokeWidth={1.5} 
         className={`inline-block w-5 h-5 ${filled ? 'text-amber-400' : 'text-gray-300'} ${className}`}
         {...rest}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};
export const NewspaperIcon = FileText; // Blog, used in BlogListPage
export const CurrencyDollarIcon = HandCoins; // Pricing, Revenue, used in AdminReportsPanel, PricingTab
export const ReceiptPercentIcon = PercentSquare; // Charges (with percent context), used in AdminPaymentsPanel
export const RectangleStackIcon = Layers; // Subscriptions (layers of service), used in AdminPaymentsPanel, PatientDashboardPage
export const ListBulletIcon = ListOrdered; // List view, Transaction list, used in AdminPaymentsPanel, TransactionsTab, CaregiverPanel, PatientDashboardPage
export const ArrowDownTrayIcon = Download; // Export, used in TransactionsTab
export const CloudArrowUpIcon = UploadCloud; // Upload, used in GatewaysTab, CaregiverPanel
export const ArrowUturnLeftIcon = CornerUpLeft; // Refunds, Back, used in AdminPaymentsPanel, CaseDetailView
export const ClockSolidIcon = Clock; // Shifts (filled variant if needed, Lucide is mostly outline), used in CaregiverPanel
export const DocumentDuplicateIcon = Copy; // Documents tab, Copy action, used in CaregiverPanel
// ExclamationCircleIconLucide was AlertTriangle, now covered by ExclamationTriangleIcon
export const BellIcon = Bell; // Notifications, used in CaregiverPanel, SettingsPanel, TopBar
export const CalendarSolidIcon = CalendarDays; // Calendar View, used in AdminBookingsPanel
export const ClipboardListIcon = ClipboardList; // Booking Logs, used in AdminBookingsPanel
export const PencilSquareIcon = SquarePen; // Manual Entry, Edit, used in AdminBookingsPanel
export const ClipboardDocumentCheckIcon = FileCheck; // Public Booking Success, used in PublicBookingPage
export const PaperclipIcon = Paperclip; // Attach file, used in CaseDetailView
export const SendIcon = Send; // Send message, used in AdminMessagesPanel, ChatWindow, CaseDetailView
export const UserGroupIcon = Users; // Assigned Staff, Group contexts
export const DefaultCaregiverIcon = UserCog; // Default avatar, used in CaregiverFormModal, CaregiverListTable, AdminMessagesPanel, ChatMessage, ConversationList
export const UserCircleIcon = UserCog; // User avatar placeholder for blog author, PatientDashboardPage, BlogPostCard, BlogPostPage, CaseDetailView
export const EditIcon = SquarePen; // Edit action, used in CaregiverListTable, AdminInventoryPanel
export const DeleteIcon = Trash2; // Delete action, lucide-react uses Trash2, used in CaregiverListTable, GatewaysTab, AdminInventoryPanel
export const PlusCircleIcon = PlusCircle; // Add action, used in AdminDashboardPage, ChargesTab, SubscriptionsTab, CaregiverPanel, AdminInventoryPanel, AdminCasesPanel, CaseDetailView
export const RefreshIconSolid = RefreshCw; // Sync/Refresh (lucide-react uses RefreshCw or RefreshCcw), used in AdminDashboardPage, CaregiverPanel, AdminBookingsPanel, NotificationSettingsPanel, AdminCasesPanel, AdminActivityLogPanel
// InformationCircleIconLucide was Info, now covered by InformationCircleIcon above
export const SearchIcon = Search; // Used in AdminBookingsPanel
export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;
export const ChevronsUpDownIcon = ChevronsUpDown;
export const ChevronDownIcon = ChevronDown; // Used in AdminBookingsPanel
export const MessageSquareIcon = MessageSquare; // Used in PatientDashboardPage
export const BriefcaseIcon = Briefcase;       // Used in PatientDashboardPage, AdminCasesPanel
export const ArchiveBoxIcon = Archive;        // Used in AdminInventoryPanel
export const DocumentMagnifyingGlassIcon = FileText; // Used in AdminActivityLogPanel (FileText as placeholder)
export const CogIcon = Settings; // Used in AdminSettingsPanel, AdminCasesPanel


// --- DATA CONSTANTS ---
export const SAMPLE_SERVICES: Service[] = [
  { 
    id: 'personal-care', 
    name: 'Personal Care Assistance', 
    description: 'Dignified help with daily activities like bathing, dressing, and mobility.',
    category: ServiceCategory.PERSONAL_CARE, 
    icon: <UsersIcon className="w-12 h-12 text-primary" />, 
    pricePerHour: 25,
    details: ["Bathing and hygiene assistance", "Dressing and grooming", "Mobility support and transfers", "Medication reminders"]
  },
  { 
    id: 'companionship', 
    name: 'Companionship & Socialization', 
    description: 'Friendly company, conversation, and engagement in favorite hobbies.',
    category: ServiceCategory.COMPANIONSHIP, 
    icon: <HandshakeIconLucide className="w-12 h-12 text-secondary" />,
    pricePerHour: 22,
    details: ["Meaningful conversation and engagement", "Accompanying to social events", "Playing games and hobbies", "Reading aloud"]
  },
  { 
    id: 'household-help', 
    name: 'Light Household Help', 
    description: 'Support with light housekeeping, meal prep, and errands.',
    category: ServiceCategory.HOUSEHOLD_HELP, 
    icon: <HomeModernIconLucide className="w-12 h-12 text-accent" />,
    pricePerHour: 20,
    details: ["Light tidying and cleaning", "Meal planning and preparation", "Laundry and linen changes", "Grocery shopping and errands"]
  },
  { 
    id: 'specialized-care', 
    name: 'Specialized Care Support', 
    description: 'Tailored care for conditions like Dementia, Alzheimer’s, or post-surgery recovery.',
    category: ServiceCategory.SPECIALIZED_CARE, 
    icon: <MedicalShieldIconLucide className="w-12 h-12 text-red-500" />,
    pricePerHour: 30,
    details: ["Memory care support", "Post-operative assistance", "Chronic condition management support", "Coordination with healthcare providers"]
  },
  { 
    id: 'respite-care', 
    name: 'Respite Care', 
    description: 'Temporary relief for family caregivers, providing peace of mind.',
    category: ServiceCategory.RESPITE_CARE, 
    icon: <ClockIconLucide className="w-12 h-12 text-purple-500" />,
    pricePerHour: 28,
    details: ["Short-term care solutions", "Flexible scheduling", "Support for primary caregivers", "Ensuring continuity of care"]
  },
  { 
    id: 'transportation', 
    name: 'Transportation Services', 
    description: 'Safe and reliable transportation to appointments, social outings, and errands.',
    category: ServiceCategory.TRANSPORTATION, 
    icon: <CarIconLucide className="w-12 h-12 text-blue-500" />,
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

// For modern admin layout
export const ADMIN_SIDEBAR_WIDTH = "w-60"; // Equivalent to 240px for grid-cols-[240px,1fr]
export const ADMIN_TOP_BAR_HEIGHT = "h-16"; // Equivalent to 64px
