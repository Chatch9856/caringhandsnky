
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookingRequest, Service, BookingStatus } from '../types';
// import { addBookingRequest } from '../services/bookingService'; // Replaced with Supabase
import { supabase as supabaseClient } from '../services/supabaseClient';
import { SAMPLE_SERVICES, ROUTE_HOME } from '../constants';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const BookCarePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialServiceId = location.state?.selectedServiceId || '';

  const [formData, setFormData] = useState<Omit<BookingRequest, 'id' | 'status' | 'submittedAt' | 'serviceName'>>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: initialServiceId,
    requestedDate: '',
    requestedTime: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const services: Service[] = SAMPLE_SERVICES; // In a real app, fetch this

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Full name is required.';
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Email is invalid.';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required.';
    } else if (!/^\+?(\d.*){3,}$/.test(formData.clientPhone)) { // Basic phone validation
        newErrors.clientPhone = 'Phone number is invalid.';
    }
    if (!formData.serviceId) newErrors.serviceId = 'Please select a service.';
    if (!formData.requestedDate) newErrors.requestedDate = 'Requested date is required.';
    else if (new Date(formData.requestedDate) < new Date(new Date().toDateString())) { // Compare date part only
        newErrors.requestedDate = 'Requested date cannot be in the past.';
    }
    if (!formData.requestedTime) newErrors.requestedTime = 'Requested time is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof formData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedServiceInstance = services.find(s => s.id === formData.serviceId);
      if (!selectedServiceInstance) {
        setModalMessage('Error: Selected service details could not be found. Please try again.');
        setIsModalOpen(true);
        setIsSubmitting(false); // Ensure submitting state is reset
        return;
      }

      const dataForSupabase = {
        full_name: formData.clientName,
        email: formData.clientEmail,
        phone_number: formData.clientPhone,
        selected_service: selectedServiceInstance.name,
        additional_notes: formData.notes || null,
        service_id: formData.serviceId,
        service_name: selectedServiceInstance.name,
        requested_date: formData.requestedDate,
        requested_time: formData.requestedTime,
        address: formData.address,
        status: BookingStatus.PENDING,
      };
      
      const { error: supabaseError } = await supabaseClient
        .from('booking_requests')
        .insert([dataForSupabase]);

      if (supabaseError) {
        console.error("Supabase submission error object:", supabaseError); // Log the full object for debugging

        let detailedErrorMessage = "There was an error submitting your request.\n\n";

        // Function to safely get string representation of an error part
        const getSafeErrorString = (value: any, defaultValue: string = "N/A"): string => {
          if (typeof value === 'string') {
            return value;
          }
          if (value && typeof value === 'object') {
            try {
              const str = JSON.stringify(value);
              return str.length > 200 ? str.substring(0, 197) + "..." : str; // Truncate long strings
            } catch (e) {
              return "[Complex Object]"; // Fallback for unstringifiable objects
            }
          }
           if (value !== undefined && value !== null) { // Handle numbers, booleans etc.
             return String(value);
          }
          return defaultValue;
        };

        detailedErrorMessage += `Message: ${getSafeErrorString(supabaseError.message, 'An unknown error occurred.')}\n`;
        
        // Check for existence before adding to message to keep it cleaner
        if (supabaseError.details !== undefined && supabaseError.details !== null) {
          detailedErrorMessage += `Details: ${getSafeErrorString(supabaseError.details)}\n`;
        }
        if (supabaseError.hint !== undefined && supabaseError.hint !== null) {
          detailedErrorMessage += `Hint: ${getSafeErrorString(supabaseError.hint)}\n`;
        }
        if (supabaseError.code !== undefined && supabaseError.code !== null) {
          detailedErrorMessage += `Code: ${getSafeErrorString(supabaseError.code)}\n`;
        }
        
        detailedErrorMessage = detailedErrorMessage.trim(); // Remove any trailing newline

        setModalMessage(detailedErrorMessage + "\n\nPlease check your input and try again, or contact support if the issue persists.");
        setIsModalOpen(true);
      } else {
        setModalMessage('Your booking request has been submitted successfully! We will contact you shortly.');
        setIsModalOpen(true);
      }
    } catch (error) { 
      console.error("Booking submission general error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setModalMessage(`There was an unexpected error: ${errorMessage}. Please try again later.`);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalMessage.includes('successfully')) {
      setFormData({
        clientName: '', clientEmail: '', clientPhone: '', serviceId: '',
        requestedDate: '', requestedTime: '', address: '', notes: '',
      });
      navigate(ROUTE_HOME); 
    }
    setModalMessage(''); 
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Book Care Services</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-neutral-dark">Full Name</label>
          <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientName ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" />
          {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-neutral-dark">Email Address</label>
            <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" />
            {errors.clientEmail && <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>}
          </div>
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-neutral-dark">Phone Number</label>
            <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientPhone ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" />
            {errors.clientPhone && <p className="text-xs text-red-500 mt-1">{errors.clientPhone}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-neutral-dark">Service Needed</label>
          <select name="serviceId" id="serviceId" value={formData.serviceId} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.serviceId ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white`} aria-required="true">
            <option value="" disabled>Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          {errors.serviceId && <p className="text-xs text-red-500 mt-1">{errors.serviceId}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="requestedDate" className="block text-sm font-medium text-neutral-dark">Requested Date</label>
            <input type="date" name="requestedDate" id="requestedDate" value={formData.requestedDate} onChange={handleChange} min={today} className={`mt-1 block w-full px-3 py-2 border ${errors.requestedDate ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" />
            {errors.requestedDate && <p className="text-xs text-red-500 mt-1">{errors.requestedDate}</p>}
          </div>
          <div>
            <label htmlFor="requestedTime" className="block text-sm font-medium text-neutral-dark">Requested Time</label>
            <input type="time" name="requestedTime" id="requestedTime" value={formData.requestedTime} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.requestedTime ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true"/>
            {errors.requestedTime && <p className="text-xs text-red-500 mt-1">{errors.requestedTime}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-neutral-dark">Full Address for Service</label>
          <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true"></textarea>
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-dark">Additional Notes (Optional)</label>
          <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
        </div>

        <div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-50"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Request'}
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalMessage.includes('successfully') ? "Success!" : "Submission Error"}>
        <p className="whitespace-pre-wrap">{modalMessage}</p>
        <button onClick={handleModalClose} className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md transition-colors">
          OK
        </button>
      </Modal>
    </div>
  );
};

export default BookCarePage;
