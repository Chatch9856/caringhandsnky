
import React from 'react';
import { BarChart3, Users, CalendarClock, DollarSign } from 'lucide-react'; // Assuming these are for dashboard widgets

const AdminDashboardPanel: React.FC = () => {
  // Dummy data for dashboard widgets
  const KpiCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${color} flex items-center space-x-4 transform hover:scale-105 transition-transform`}>
      <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-').replace('text-', 'bg-')}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="text-2xl font-semibold text-neutral-dark">{value}</p>
      </div>
    </div>
  );
  
  const dashboardWidgets = [
    { title: 'Total Bookings', value: 78, icon: <CalendarClock size={24} className="text-blue-500" />, color: 'border-blue-500' },
    { title: 'Active Caregivers', value: 12, icon: <Users size={24} className="text-green-500" />, color: 'border-green-500' },
    { title: 'Pending Approvals', value: 5, icon: <BarChart3 size={24} className="text-yellow-500" />, color: 'border-yellow-500' },
    { title: 'Revenue (This Month)', value: '$3,450', icon: <DollarSign size={24} className="text-purple-500" />, color: 'border-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardWidgets.map(widget => (
          <KpiCard key={widget.title} {...widget} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm">
            <li className="border-b border-slate-100 pb-2">New booking request from J. Doe for Personal Care.</li>
            <li className="border-b border-slate-100 pb-2">Caregiver A. Smith completed shift with R. Jones.</li>
            <li className="border-b border-slate-100 pb-2">Payment received for booking #BKG-125.</li>
            <li>System settings updated: Email notifications enabled for New Bookings.</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <LinkToAdminPanel label="Manage Bookings" route="/admin/bookings" />
            <LinkToAdminPanel label="View Caregivers" route="/admin/caregivers" />
            <LinkToAdminPanel label="Payment Settings" route="/admin/payments" />
            <LinkToAdminPanel label="System Reports" route="/admin/reports" />
          </div>
        </div>
      </div>
       <p className="text-sm text-neutral-500 mt-8">
        Welcome to the CaringHandsNKY admin dashboard. Use the sidebar to navigate through different management sections.
      </p>
    </div>
  );
};

const LinkToAdminPanel = ({ label, route }: { label: string, route: string}) => (
    // In AdminLayout, links are <button>, here using <Link> for consistency if these were router links
    // However, AdminLayout uses onClick to set state. If these are to behave like sidebar, they should do the same.
    // For now, assuming placeholder styling.
    <a href={`#${route}`} /* Changed to href for HashRouter compatibility */
       className="bg-primary-light text-primary-dark hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
        {label}
    </a>
);


export default AdminDashboardPanel;
