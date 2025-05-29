import React, { useState, FormEvent } from 'react';
import { BookingFormData } from '../types';
import Button from './Button';
import useScrollAnimation from '../hooks/useScrollAnimation';

const careTypeOptions = [
  "Hourly Caregiving",
  "Skilled Medical Support",
  "Specialty Care Plans",
  "End-of-Life Care",
  "Other (Please specify in notes)"
];

const BookingForm: React.FC = () => {
  const sectionRef = useScrollAnimation<HTMLElement>({ animationClass: 'animate-fade-in-up' });
  const initialFormData: BookingFormData = {
    name: '',
    phone: '',
    email: '',
    careType: careTypeOptions[0],
    preferredDate: '',
    preferredTime: '',
    referral: '',
    notes: '',
  };

  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    const payload = {
      ...formData,
      datetimePreferred: `${formData.preferredDate}T${formData.preferredTime}`
    };

    try {
      const res = await fetch('/api/submitBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmissionStatus('success');
        setFormData(initialFormData); // Reset form
      } else {
        const errorData = await res.json().catch(() => ({ message: 'An unexpected error occurred.' }));
        setErrorMessage(errorData.message || 'Failed to submit booking. Please try again.');
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setErrorMessage('An error occurred while connecting to the server. Please check your internet connection and try again.');
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="book-care" ref={sectionRef} className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal text-center mb-4">
          Request In-Home Care
        </h2>
        <p className="text-brand-charcoal-light text-center mb-10 md:mb-12 max-w-xl mx-auto">
          Fill out the form below to request a consultation or book care. We'll get back to you shortly to confirm details.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-brand-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
          {submissionStatus === 'success' && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Request Submitted!</p>
              <p>Thank you for your request. We will contact you soon.</p>
            </div>
          )}
          {submissionStatus === 'error' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Submission Failed</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-charcoal-light mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal-light mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" placeholder="(555) 123-4567"/>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-charcoal-light mb-1">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" placeholder="you@example.com"/>
          </div>

          <div>
            <label htmlFor="careType" className="block text-sm font-medium text-brand-charcoal-light mb-1">Type of Care Needed <span className="text-red-500">*</span></label>
            <select name="careType" id="careType" value={formData.careType} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors bg-white">
              {careTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-brand-charcoal-light mb-1">Preferred Start Date <span className="text-red-500">*</span></label>
              <input type="date" name="preferredDate" id="preferredDate" value={formData.preferredDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-brand-charcoal-light mb-1">Preferred Time <span className="text-red-500">*</span></label>
              <input type="time" name="preferredTime" id="preferredTime" value={formData.preferredTime} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" />
            </div>
          </div>

          <div>
            <label htmlFor="referral" className="block text-sm font-medium text-brand-charcoal-light mb-1">How did you hear about us? (Optional)</label>
            <input type="text" name="referral" id="referral" value={formData.referral} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-brand-charcoal-light mb-1">Additional Notes or Needs (Optional)</label>
            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple transition-colors" placeholder="Any specific requirements or questions..."></textarea>
          </div>

          <div>
            <Button type="submit" variant="primary" size="large" fullWidth disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
           <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to be contacted by CaringHandsNKY. We respect your privacy.
          </p>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
