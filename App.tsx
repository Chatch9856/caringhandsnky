
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookCarePage from './pages/BookCarePage';
import AdminDashboardLayout from './pages/AdminDashboardLayout'; // Changed to AdminDashboardLayout
import PayOnlinePage from './pages/PayOnlinePage';
import TestimonialsPage from './pages/TestimonialsPage';
import UrgentHelpPage from './pages/UrgentHelpPage';
import WhyUsPage from './pages/WhyUsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './auth/LoginPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US,
  ROUTE_LOGIN, ROUTE_BOOKING_SUCCESS,
  ROUTE_ADMIN_CONTENT_MANAGEMENT, ROUTE_ADMIN_PAYMENT_SETTINGS,
  ROUTE_ADMIN_NOTIFICATION_LOGS, ROUTE_ADMIN_APP_SETTINGS, ROUTE_ADMIN_BOOKING_ARCHIVE
} from './constants';

// Admin section components (to be created or existing ones refactored)
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminAppSettingsPage from './pages/admin/AdminAppSettingsPage';
import AdminArchivedBookingsPage from './pages/admin/AdminArchivedBookingsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path={ROUTE_HOME} element={<HomePage />} />
            <Route path={ROUTE_SERVICES} element={<ServicesPage />} />
            <Route path={ROUTE_BOOK_CARE} element={<BookCarePage />} />
            
            <Route 
              path={ROUTE_ADMIN_DASHBOARD}
              element={
                <ProtectedRoute>
                  <AdminDashboardLayout />
                </ProtectedRoute>
              } 
            >
              {/* Default admin route */}
              <Route index element={<Navigate to="bookings" replace />} /> 
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="archive" element={<AdminArchivedBookingsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="settings" element={<AdminAppSettingsPage />} />
            </Route>

            <Route path={ROUTE_LOGIN} element={<LoginPage />} /> 
            <Route path={ROUTE_BOOKING_SUCCESS} element={<BookingSuccessPage />} />
            <Route path={ROUTE_PAY_ONLINE} element={<PayOnlinePage />} />
            <Route path={ROUTE_TESTIMONIALS} element={<TestimonialsPage />} />
            <Route path={ROUTE_URGENT_HELP} element={<UrgentHelpPage />} />
            <Route path={ROUTE_WHY_US} element={<WhyUsPage />} />
            {/* Ensure admin sub-routes are caught by the admin layout or redirect */}
            <Route path="/admin/*" element={<Navigate to={ROUTE_ADMIN_DASHBOARD} replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
