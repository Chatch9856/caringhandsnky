
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import { ReportWidgetData } from '../../types';
import { ReportsIcon, UsersIcon, DocumentTextIcon, CurrencyDollarIcon } from '../../constants';
// import { getReportWidgetsData } from '../../services/adminReportsService'; // Uncomment when service is implemented

const AdminReportsPanel: React.FC = () => {
  const [widgetData, setWidgetData] = useState<ReportWidgetData[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching data

  // Placeholder data for widgets, since actual service is commented out
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setWidgetData([
        { title: "Total Patients", value: 0, icon: <UsersIcon /> }, // Ensure icons passed are compatible
        { title: "Total Caregivers", value: 0, icon: <UsersIcon /> },
        { title: "Appointments This Week", value: 0, icon: <DocumentTextIcon /> },
        { title: "Revenue This Month", value: "$0.00", icon: <CurrencyDollarIcon /> },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       // const data = await getReportWidgetsData(); // Fetch data from service
  //       // setWidgetData(data);
  //       // Placeholder data:
  //       setWidgetData([
  //         { title: "Total Patients", value: 0, icon: <UsersIcon className="w-8 h-8" /> },
  //         { title: "Total Caregivers", value: 0, icon: <UsersIcon className="w-8 h-8" /> },
  //         { title: "Appointments This Week", value: 0, icon: <DocumentTextIcon className="w-8 h-8" /> },
  //         { title: "Revenue This Month", value: "$0.00", icon: <CurrencyDollarIcon className="w-8 h-8" /> },
  //       ]);
  //     } catch (error) {
  //       console.error("Error fetching report data:", error);
  //       // addToast("Failed to load report data.", "error");
  //     }
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm mt-0">
      <h3 className="text-xl font-semibold text-primary-dark mb-6">System Reports & Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgetData.map(widget => (
          <div key={widget.title} className="bg-slate-50 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center text-primary-dark mb-2">
              {widget.icon && React.cloneElement(widget.icon, { className: "w-7 h-7 mr-3 text-primary" })}
              <h4 className="text-md font-semibold">{widget.title}</h4>
            </div>
            <p className="text-3xl font-bold text-neutral-dark">{widget.value}</p>
            {widget.trend && <p className="text-xs text-neutral-500 mt-1">{widget.trend}</p>}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor="dateRange" className="block text-sm font-medium text-neutral-dark">Filter by Date Range:</label>
        <input type="date" id="dateRangeStart" name="dateRangeStart" className="mt-1 input-style-sm mr-2" />
        <span className="text-neutral-dark">to</span>
        <input type="date" id="dateRangeEnd" name="dateRangeEnd" className="mt-1 input-style-sm ml-2" />
      </div>
      
      <button 
        // onClick={handleExport} 
        className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
      >
        Export Report (PDF/CSV)
      </button>
      <p className="text-xs text-neutral-500 mt-2">(Export functionality coming soon)</p>
       <style>{`
        .input-style-sm {
          padding: 0.4rem 0.6rem; 
          border-radius: 0.375rem; 
          border: 1px solid #cbd5e1; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
        }
        .input-style-sm:focus {
          outline: none;
          border-color: #0891b2; 
          box-shadow: 0 0 0 0.2rem rgba(8, 145, 178, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AdminReportsPanel;