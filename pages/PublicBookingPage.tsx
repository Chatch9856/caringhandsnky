import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { PublicService, PublicCaregiver, PublicBookingFormData, SubmissionResult } from '../types';
import { fetchPublicServices, fetchActiveCaregiversPublic, submitPublicBooking } from '../services/publicBookingService';
import { ROUTE_HOME, ClipboardDocumentCheckIcon, CheckCircleIcon } from '../constants';
import { supabase } from '../supabaseClient';

const PublicBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const initialFormData: Omit<PublicBookingFormData, 'serviceName'> = {
    fullName: '',
    email: '',
    phone: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    preferredCaregiverId: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [services, setServices] = useState<PublicService[]>([]);
  const [caregivers, setCaregivers] = useState<PublicCaregiver[]>([]);
  
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingCaregivers, setIsLoadingCaregivers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PublicBookingFormData, string>>>({});
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const loadServices = useCallback(async () => {
    if (!supabase) {
      addToast("Service data is currently unavailable. Please try again later.", "error");
      setIsLoadingServices(false);
      return;
    }
    setIsLoadingServices(true);
    try {
      const data = await fetchPublicServices();
      setServices(data);
    } catch (error: any) {
      addToast(`Error loading services: ${error.message}`, 'error');
    } finally {
      setIsLoadingServices(false);
    }
  }, [addToast]);

  const loadCaregivers = useCallback(async () => {
    if (!supabase) {
      // Don't show error toast for optional caregivers if supabase isn't init
      setIsLoadingCaregivers(false);
      return;
    }
    setIsLoadingCaregivers(true);
    try {
      const data = await fetchActiveCaregiversPublic();
      setCaregivers(data);
    } catch (error: any) {
      addToast(`Error loading caregivers: ${error.message}`, 'error');
    } finally {
      setIsLoadingCaregivers(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadServices();
    loadCaregivers();
  }, [loadServices, loadCaregivers]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof PublicBookingFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PublicBookingFormData, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      errors.phone = 'Phone number format is invalid.';
    }
    if (!formData.serviceId) errors.serviceId = 'Please select a service.';
    if (!formData.preferredDate) {
      errors.preferredDate = 'Preferred date is required.';
    } else if (new Date(formData.preferredDate) < new Date(new Date().toDateString())) {
      errors.preferredDate = 'Preferred date cannot be in the past.';
    }
    if (!formData.preferredTime) errors.preferredTime = 'Preferred time is required.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast("Booking system is temporarily unavailable. Please try again later or contact us directly.", "error");
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    const selectedService = services.find(s => s.id === formData.serviceId);
    if (!selectedService) {
        addToast('Selected service is invalid. Please refresh and try again.', 'error');
        setIsSubmitting(false);
        return;
    }

    const fullBookingData: PublicBookingFormData = {
        ...formData,
        serviceName: selectedService.name, // Add serviceName for storing in bookings table
    };

    try {
      const result = await submitPublicBooking(fullBookingData);
      setSubmissionResult({
        success: true,
        bookingId: result.bookingId,
        message: 'Your booking request has been submitted successfully!',
        bookedServiceName: selectedService.name,
        bookedDate: formData.preferredDate,
        bookedTime: formData.preferredTime,
      });
      addToast('Booking request submitted! We will be in touch soon.', 'success');
      // Reset form or navigate as preferred
      // For now, the view will change to confirmation
    } catch (error: any) {
      addToast(`Submission failed: ${error.message}`, 'error');
      setSubmissionResult({ success: false, message: `Submission failed: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetAndBookAnother = () => {
    setFormData(initialFormData);
    setSubmissionResult(null);
    setFormErrors({});
  }

  const today = new Date().toISOString().split('T')[0];
  const inputBaseClass = "mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-150 ease-in-out";
  const labelBaseClass = "block text-sm font-medium text-neutral-dark";

  if (submissionResult?.success) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-lg text-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Booking Submitted!</h1>
          <p className="text-neutral-DEFAULT mb-2">{submissionResult.message}</p>
          <p className="text-neutral-DEFAULT mb-6">A confirmation email would typically be sent to your provided email address.</p>
          
          <div className="bg-primary-light/30 p-6 rounded-lg text-left space-y-2 mb-8 border border-primary-light">
            <h2 className="text-lg font-semibold text-primary-dark mb-2">Your Request Summary:</h2>
            <p><strong>Booking ID:</strong> <span className="font-mono text-accent-dark">{submissionResult.bookingId}</span></p>
            <p><strong>Service:</strong> {submissionResult.bookedServiceName}</p>
            <p><strong>Date:</strong> {new Date(submissionResult.bookedDate || '').toLocaleDateString()}</p>
            <p><strong>Time:</strong> {submissionResult.bookedTime}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetAndBookAnother}
              className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150"
            >
              Book Another Service
            </button>
            <Link
              to={ROUTE_HOME}
              className="block w-full bg-slate-200 hover:bg-slate-300 text-neutral-dark font-semibold py-3 px-6 rounded-lg transition-colors duration-150"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <ClipboardDocumentCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-dark">Book Your Care Service</h1>
          <p className="text-neutral-DEFAULT mt-2">Fill out the form below to request your desired service.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className={labelBaseClass}>Full Name</label>
            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className={`${inputBaseClass} ${formErrors.fullName ? 'border-red-500' : ''}`} required />
            {formErrors.fullName && <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className={labelBaseClass}>Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={`${inputBaseClass} ${formErrors.email ? 'border-red-500' : ''}`} required />
              {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={labelBaseClass}>Phone Number</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className={`${inputBaseClass} ${formErrors.phone ? 'border-red-500' : ''}`} required placeholder="(555) 123-4567"/>
              {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="serviceId" className={labelBaseClass}>Service Type</label>
            <select name="serviceId" id="serviceId" value={formData.serviceId} onChange={handleInputChange} className={`${inputBaseClass} ${formErrors.serviceId ? 'border-red-500' : ''} bg-white`} required disabled={isLoadingServices}>
              <option value="" disabled>{isLoadingServices ? 'Loading services...' : 'Select a service'}</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
            {formErrors.serviceId && <p className="text-xs text-red-600 mt-1">{formErrors.serviceId}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preferredDate" className={labelBaseClass}>Preferred Date</label>
              <input type="date" name="preferredDate" id="preferredDate" value={formData.preferredDate} onChange={handleInputChange} min={today} className={`${inputBaseClass} ${formErrors.preferredDate ? 'border-red-500' : ''}`} required />
              {formErrors.preferredDate && <p className="text-xs text-red-600 mt-1">{formErrors.preferredDate}</p>}
            </div>
            <div>
              <label htmlFor="preferredTime" className={labelBaseClass}>Preferred Time</label>
              <input type="time" name="preferredTime" id="preferredTime" value={formData.preferredTime} onChange={handleInputChange} className={`${inputBaseClass} ${formErrors.preferredTime ? 'border-red-500' : ''}`} required />
              {formErrors.preferredTime && <p className="text-xs text-red-600 mt-1">{formErrors.preferredTime}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="preferredCaregiverId" className={labelBaseClass}>Preferred Caregiver (Optional)</label>
            <select name="preferredCaregiverId" id="preferredCaregiverId" value={formData.preferredCaregiverId} onChange={handleInputChange} className={`${inputBaseClass} bg-white`} disabled={isLoadingCaregivers}>
              <option value="">{isLoadingCaregivers ? 'Loading caregivers...' : 'Any available caregiver'}</option>
              {caregivers.map(cg => (
                <option key={cg.id} value={cg.id}>{cg.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className={labelBaseClass}>Additional Notes (Optional)</label>
            <textarea name="notes" id="notes" rows={4} value={formData.notes} onChange={handleInputChange} className={inputBaseClass} placeholder="Any specific needs, preferences, or instructions for our team..."></textarea>
          </div>

          {submissionResult && !submissionResult.success && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
              {submissionResult.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting || isLoadingServices || !supabase}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Booking Request'}
          </button>
           {!supabase && <p className="text-xs text-red-500 text-center mt-2">Booking system is currently unavailable. Please try again later.</p>}
        </form>
      </div>
    </div>
  );
};

export default PublicBookingPage;
