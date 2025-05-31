import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TabButton from '../components/TabButton';
import ProfileSettingsSection from '../components/patient_dashboard/ProfileSettingsSection';
import UpcomingBookingsSection from '../components/patient_dashboard/UpcomingBookingsSection';
import BookingHistorySection from '../components/patient_dashboard/BookingHistorySection';
import SubscriptionSection from '../components/patient_dashboard/SubscriptionSection';
import BillingSection from '../components/patient_dashboard/BillingSection';
import PatientMessagesPanel from '../components/patient_dashboard/PatientMessagesPanel';
import PatientCasesPanel from '../components/patient_dashboard/PatientCasesPanel'; // Corrected: Ensure PatientCasesPanel has a default export

import { 
    UserCircleIcon, CalendarIcon, ListBulletIcon, RectangleStackIcon, CreditCardIcon, MessageSquareIcon, BriefcaseIcon, // New Icons
    PATIENT_DASHBOARD_PROFILE, PATIENT_DASHBOARD_UPCOMING_BOOKINGS, PATIENT_DASHBOARD_BOOKING_HISTORY, 
    PATIENT_DASHBOARD_SUBSCRIPTION, PATIENT_DASHBOARD_BILLING,
    PATIENT_DASHBOARD_MESSAGES, PATIENT_DASHBOARD_CASES // New Tab constants
} from '../constants';
import { PatientDashboardTabType } from '../types';


const PatientDashboardPage: React.FC = () => {
  const { currentUser, isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<PatientDashboardTabType>(PATIENT_DASHBOARD_PROFILE);

  const tabs = [
    { id: PATIENT_DASHBOARD_PROFILE, label: "Profile", icon: <UserCircleIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_UPCOMING_BOOKINGS, label: "Upcoming", icon: <CalendarIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_BOOKING_HISTORY, label: "History", icon: <ListBulletIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_MESSAGES, label: "Messages", icon: <MessageSquareIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_CASES, label: "My Cases", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_SUBSCRIPTION, label: "Subscription", icon: <RectangleStackIcon className="w-5 h-5" /> },
    { id: PATIENT_DASHBOARD_BILLING, label: "Billing", icon: <CreditCardIcon className="w-5 h-5" /> },
  ];

  if (isLoadingAuth) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (!currentUser) {
    // This should ideally be handled by ProtectedRoute, but as a fallback:
    return <div className="text-center py-10">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-dark">Welcome, {currentUser.full_name}!</h1>
        <p className="text-neutral-DEFAULT">Manage your bookings, profile, and more.</p>
      </div>

      <div className="mb-0 border-b border-slate-200">
        <div className="flex space-x-1 -mb-px overflow-x-auto pb-1">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as PatientDashboardTabType)}
              icon={tab.icon}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm p-6 mt-0">
        {activeTab === PATIENT_DASHBOARD_PROFILE && <ProfileSettingsSection patient={currentUser} />}
        {activeTab === PATIENT_DASHBOARD_UPCOMING_BOOKINGS && <UpcomingBookingsSection patientId={currentUser.id} />}
        {activeTab === PATIENT_DASHBOARD_BOOKING_HISTORY && <BookingHistorySection patientId={currentUser.id} />}
        {activeTab === PATIENT_DASHBOARD_SUBSCRIPTION && <SubscriptionSection patientId={currentUser.id} />}
        {activeTab === PATIENT_DASHBOARD_BILLING && <BillingSection patientId={currentUser.id} />}
        {activeTab === PATIENT_DASHBOARD_MESSAGES && <PatientMessagesPanel currentUser={currentUser} />}
        {activeTab === PATIENT_DASHBOARD_CASES && <PatientCasesPanel currentUser={currentUser} />}
      </div>
    </div>
  );
};

export default PatientDashboardPage;