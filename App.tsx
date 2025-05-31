
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookCarePage from './pages/BookCarePage'; // Old page
import PublicBookingPage from './pages/PublicBookingPage'; // New public booking page
import AdminDashboardPage from './pages/AdminDashboardPage';
import PayOnlinePage from './pages/PayOnlinePage';
import TestimonialsPage from './pages/TestimonialsPage';
import UrgentHelpPage from './pages/UrgentHelpPage';
import WhyUsPage from './pages/WhyUsPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './components/ToastContext';
import { AdminLayoutProvider } from './components/AdminLayoutContext'; // Import AdminLayoutProvider
import { 
  ROUTE_HOME, ROUTE_SERVICES, ROUTE_BOOK_CARE, ROUTE_ADMIN_DASHBOARD, 
  ROUTE_PAY_ONLINE, ROUTE_TESTIMONIALS, ROUTE_URGENT_HELP, ROUTE_WHY_US,
  ROUTE_BLOG, ROUTE_BLOG_POST_DETAIL_PREFIX, ROUTE_BOOKING_PUBLIC
} from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <AdminLayoutProvider> {/* Wrap routes that might use AdminLayoutContext */}
          <Layout>
            <Routes>
              <Route path={ROUTE_HOME} element={<HomePage />} />
              <Route path={ROUTE_SERVICES} element={<ServicesPage />} />
              <Route path={ROUTE_BOOKING_PUBLIC} element={<PublicBookingPage />} />
              <Route path={ROUTE_BOOK_CARE} element={<BookCarePage />} />
              
              <Route 
                path={ROUTE_ADMIN_DASHBOARD} 
                element={<AdminDashboardPage />} 
              />
              
              <Route path={ROUTE_PAY_ONLINE} element={<PayOnlinePage />} />
              <Route path={ROUTE_TESTIMONIALS} element={<TestimonialsPage />} />
              <Route path={ROUTE_URGENT_HELP} element={<UrgentHelpPage />} />
              <Route path={ROUTE_WHY_US} element={<WhyUsPage />} />
              <Route path={ROUTE_BLOG} element={<BlogListPage />} />
              <Route path={`${ROUTE_BLOG_POST_DETAIL_PREFIX}:slug`} element={<BlogPostPage />} />
              <Route path="/admin/*" element={<Navigate to={ROUTE_ADMIN_DASHBOARD} replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </AdminLayoutProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;