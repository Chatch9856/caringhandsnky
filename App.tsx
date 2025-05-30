import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookCarePage from './pages/BookCarePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PayOnlinePage from './pages/PayOnlinePage';
import TestimonialsPage from './pages/TestimonialsPage';
import UrgentHelpPage from './pages/UrgentHelpPage';
import WhyUsPage from './pages/WhyUsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './auth/LoginPage'; // Import LoginPage
import BookingSuccessPage from './pages/BookingSuccessPage'; // Import BookingSuccessPage
import { AuthProvider } from './auth/AuthContext'; // Import AuthProvider
import ProtectedRoute from './auth/ProtectedRoute'; // Import ProtectedRoute
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US,
  ROUTE_LOGIN, ROUTE_BOOKING_SUCCESS // Import ROUTE_LOGIN & ROUTE_BOOKING_SUCCESS
} from './constants';

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
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path={ROUTE_LOGIN} element={<LoginPage />} /> 
            <Route path={ROUTE_BOOKING_SUCCESS} element={<BookingSuccessPage />} />
            <Route path={ROUTE_PAY_ONLINE} element={<PayOnlinePage />} />
            <Route path={ROUTE_TESTIMONIALS} element={<TestimonialsPage />} />
            <Route path={ROUTE_URGENT_HELP} element={<UrgentHelpPage />} />
            <Route path={ROUTE_WHY_US} element={<WhyUsPage />} />
            <Route path="/admin/*" element={<Navigate to={ROUTE_ADMIN_DASHBOARD} replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;