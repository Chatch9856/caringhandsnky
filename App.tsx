
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'; // Public layout
import AdminLayout from './AdminLayout'; // New Admin Layout

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookCarePage from './pages/BookCarePage'; 
import PublicBookingPage from './pages/PublicBookingPage'; 
// import AdminDashboardPage from './pages/AdminDashboardPage'; // Will be replaced by specific panels
import PayOnlinePage from './pages/PayOnlinePage';
import TestimonialsPage from './pages/TestimonialsPage';
import UrgentHelpPage from './pages/UrgentHelpPage';
import WhyUsPage from './pages/WhyUsPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './components/ToastContext';

// Admin Panels (some might be renamed or used directly from old AdminDashboardPage imports)
import AdminDashboardPanel from './pages/admin_panels/AdminDashboardPanel'; 
import AdminCaregiversPage from './AdminCaregiversPage'; 
import AdminBookingsPage from './pages/admin_panels/AdminBookingsPage'; // Ensured relative path
import AdminPaymentsPanel from './components/admin/AdminPaymentsPanel';
import AdminMessagesPage from './AdminMessagesPage'; 
import AdminCasesPanel from './components/admin/AdminCasesPanel';
import AdminReportsPanel from './components/admin/AdminReportsPanel';
import AdminInventoryPanel from './components/admin/AdminInventoryPanel';
import AdminActivityLogPanel from './components/admin/AdminActivityLogPanel';
import AdminSettingsPanel from './components/admin/settings/AdminSettingsPanel';

import { SAMPLE_SERVICES } from './constants'; 

import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US,
  ROUTE_BLOG, ROUTE_BLOG_POST_DETAIL_PREFIX, ROUTE_BOOKING_PUBLIC
} from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        {/* Public Layout applied to non-admin routes */}
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTE_HOME} element={<HomePage />} />
            <Route path={ROUTE_SERVICES} element={<ServicesPage />} />
            <Route path={ROUTE_BOOKING_PUBLIC} element={<PublicBookingPage />} />
            <Route path={ROUTE_BOOK_CARE} element={<BookCarePage />} />
            <Route path={ROUTE_PAY_ONLINE} element={<PayOnlinePage />} />
            <Route path={ROUTE_TESTIMONIALS} element={<TestimonialsPage />} />
            <Route path={ROUTE_URGENT_HELP} element={<UrgentHelpPage />} />
            <Route path={ROUTE_WHY_US} element={<WhyUsPage />} />
            <Route path={ROUTE_BLOG} element={<BlogListPage />} />
            <Route path={`${ROUTE_BLOG_POST_DETAIL_PREFIX}:slug`} element={<BlogPostPage />} />
          </Route>

          {/* Admin Routes with new AdminLayout */}
          <Route path={ROUTE_ADMIN_DASHBOARD} element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPanel /></AdminLayout>} />
          <Route path="/admin/caregivers" element={<AdminCaregiversPage />} /> 
          <Route path="/admin/bookings" element={<AdminLayout><AdminBookingsPage /></AdminLayout>} />
          <Route path="/admin/payments" element={<AdminLayout><AdminPaymentsPanel services={SAMPLE_SERVICES} /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} /> 
          <Route path="/admin/cases" element={<AdminLayout><AdminCasesPanel /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReportsPanel /></AdminLayout>} />
          <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPanel /></AdminLayout>} />
          <Route path="/admin/activity" element={<AdminLayout><AdminActivityLogPanel /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPanel /></AdminLayout>} />
          
          <Route path="/admin/*" element={<AdminLayout><NotFoundPage /></AdminLayout>} /> 

          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
