import React, { useState, useEffect } from 'react';
import { AdminBookingEntry } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

const AdminBookingsView: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLElement>({ animationClass: 'animate-fade-in' });
  const [bookings, setBookings] = useState<AdminBookingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assumes booking-requests.json is in public/data/ and served statically
        const response = await fetch('/data/booking-requests.json');
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No booking data found. Ensure 'booking-requests.json' is in the 'public/data' folder.");
          }
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
        const data: AdminBookingEntry[] = await response.json();
        // Sort by submittedAt descending to show newest first
        data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setBookings(data);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-brand-charcoal-light text-lg">Loading booking requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md max-w-md mx-auto" role="alert">
          <p className="font-bold">Error Loading Bookings</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Please ensure that a `booking-requests.json` file is available in the `public/data/` directory of your application and that your development server is configured to serve files from the `public` directory.</p>
        </div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="bg-brand-slate-light py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue-dark text-center mb-10">
          Submitted Care Requests
        </h1>

        {bookings.length === 0 ? (
          <p className="text-brand-charcoal-light text-center text-lg">No care requests have been submitted yet.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((entry, index) => (
              <div 
                key={entry.submittedAt + '-' + index} 
                className="bg-brand-white p-6 rounded-lg shadow-lg border border-brand-lavender transform hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <p><strong className="text-brand-charcoal">Name:</strong> {entry.name}</p>
                  <p><strong className="text-brand-charcoal">Phone:</strong> {entry.phone}</p>
                  {entry.email && <p><strong className="text-brand-charcoal">Email:</strong> {entry.email}</p>}
                  <p><strong className="text-brand-charcoal">Care Type:</strong> {entry.careType}</p>
                  <p><strong className="text-brand-charcoal">Preferred Date:</strong> {entry.preferredDate ? new Date(entry.preferredDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</p>
                  <p><strong className="text-brand-charcoal">Preferred Time:</strong> {entry.preferredTime || 'N/A'}</p>
                  {entry.referral && <p className="md:col-span-2"><strong className="text-brand-charcoal">Referral:</strong> {entry.referral}</p>}
                </div>
                {entry.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p><strong className="text-brand-charcoal">Notes:</strong></p>
                    <p className="whitespace-pre-wrap text-brand-charcoal-light">{entry.notes}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-4 text-right">
                  <em>Submitted: {new Date(entry.submittedAt).toLocaleString()}</em>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminBookingsView;
