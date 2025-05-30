import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookingRequest, Service, BookingStatus } from '../types';
import { supabase as supabaseClient } from '../services/supabaseClient';
import { SAMPLE_SERVICES, ROUTE_BOOKING_SUCCESS } from '../constants';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const BookCarePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialServiceId = location.state?.selectedServiceId || '';

  const initialFormState = {
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: initialServiceId,
    requestedDate: '',
    requestedTime: '',
    address: '',
    notes: '',
  };

  const [formData, setFormData] = useState<Omit<BookingRequest, 'id' | 'status' | 'submittedAt' | 'serviceName'>>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
  const services: Service[] = SAMPLE_SERVICES; // In a real app, fetch this

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  // --- Validation Functions ---
  const validateClientNameField = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required.';
    return undefined;
  };

  const validateEmailField = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid.';
    return undefined;
  };

  const validatePhoneField = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required.';
    const cleanedPhone = phone.replace(/[\s-()+]/g, ''); // Remove common separators
    if (!/^\d{10}$/.test(cleanedPhone)) {
      return 'Phone number must be 10 digits (e.g., 1234567890 or 123-456-7890).';
    }
    return undefined;
  };

  const validateServiceIdField = (serviceId: string): string | undefined => {
    if (!serviceId) return 'Please select a service.';
    return undefined;
  };

  const validateRequestedDateField = (dateStr: string): string | undefined => {
    if (!dateStr) return 'Requested date is required.';
    if (new Date(dateStr) < new Date(new Date().toDateString())) {
      return 'Requested date cannot be in the past.';
    }
    return undefined;
  };

  const validateRequestedTimeField = (time: string): string | undefined => {
    if (!time) return 'Requested time is required.';
    return undefined;
  };

  const validateAddressField = (address: string): string | undefined => {
    if (!address.trim()) return 'Address is required.';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    newErrors.clientName = validateClientNameField(formData.clientName);
    newErrors.clientEmail = validateEmailField(formData.clientEmail);
    newErrors.clientPhone = validatePhoneField(formData.clientPhone);
    newErrors.serviceId = validateServiceIdField(formData.serviceId);
    newErrors.requestedDate = validateRequestedDateField(formData.requestedDate);
    newErrors.requestedTime = validateRequestedTimeField(formData.requestedTime);
    newErrors.address = validateAddressField(formData.address);
    // No validation for formData.notes as it's optional
    
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, value]) => value !== undefined)
    ) as Partial<Record<keyof typeof formData, string>>;

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  useEffect(() => {
    const hasValidationErrors = Object.values(errors).some(error => !!error);

    const requiredFieldsAreFilled =
      formData.clientName.trim() !== '' &&
      formData.clientEmail.trim() !== '' &&
      formData.clientPhone.trim() !== '' &&
      formData.serviceId !== '' &&
      formData.requestedDate !== '' &&
      formData.requestedTime !== '' &&
      formData.address.trim() !== '';

    setIsSubmitDisabled(!requiredFieldsAreFilled || hasValidationErrors);
  }, [formData, errors]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let fieldError: string | undefined;
    switch (name) {
      case 'clientName':
        fieldError = validateClientNameField(value);
        break;
      case 'clientEmail':
        fieldError = validateEmailField(value);
        break;
      case 'clientPhone':
        fieldError = validatePhoneField(value);
        break;
      case 'serviceId':
        fieldError = validateServiceIdField(value);
        break;
      case 'requestedDate':
        fieldError = validateRequestedDateField(value);
        break;
      case 'requestedTime':
        fieldError = validateRequestedTimeField(value);
        break;
      case 'address':
        fieldError = validateAddressField(value);
        break;
      default:
        fieldError = undefined;
    }
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setModalMessage(''); 

    try {
      const selectedServiceInstance = services.find(s => s.id === formData.serviceId);
      if (!selectedServiceInstance) {
        setModalMessage('Error: Selected service details could not be found. Please try again.');
        setIsModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      const dataForSupabase = { 
        full_name: formData.clientName,
        email: formData.clientEmail,
        phone_number: formData.clientPhone,
        service_id: formData.serviceId,
        selected_service: selectedServiceInstance.name, 
        requested_date: formData.requestedDate,
        requested_time: formData.requestedTime,
        address: formData.address,
        additional_notes: formData.notes || null, // Send null if notes is empty, or empty string
        status: BookingStatus.PENDING,
      };
      
      const { error: supabaseError } = await supabaseClient
        .from('booking_requests')
        .insert([dataForSupabase]);

      if (supabaseError) {
        console.error("DEBUG: Supabase submission error details:", JSON.stringify(supabaseError, null, 2)); 

        let detailedErrorMessage = "There was an error submitting your request.\n\n";
        const getSafeErrorString = (val: any, defaultVal: string = "N/A"): string => {
          if (typeof val === 'string') return val;
          if (val && typeof val === 'object') try { const s = JSON.stringify(val); return s === '{}' || s === 'null' ? defaultVal : s.length > 200 ? s.substring(0,197)+"..." : s; } catch (e) { return "[Complex Object]"; }
          return val !== undefined && val !== null ? String(val) : defaultVal;
        };
        detailedErrorMessage += `Message: ${getSafeErrorString(supabaseError.message, 'An unknown error occurred.')}\n`;
        if (supabaseError.details !== undefined && supabaseError.details !== null) detailedErrorMessage += `Details: ${getSafeErrorString(supabaseError.details)}\n`;
        if (supabaseError.hint !== undefined && supabaseError.hint !== null) detailedErrorMessage += `Hint: ${getSafeErrorString(supabaseError.hint)}\n`;
        if (supabaseError.code !== undefined && supabaseError.code !== null) detailedErrorMessage += `Code: ${getSafeErrorString(supabaseError.code)}\n`;
        
        setModalMessage(detailedErrorMessage.trim() + "\n\nPlease check your input and try again, or contact support if the issue persists.");
        setIsModalOpen(true);
      } else {
        setFormData(initialFormState); 
        if (initialServiceId) {
          setFormData(prev => ({ ...initialFormState, serviceId: initialServiceId }));
        } else {
          setFormData(initialFormState);
        }
        navigate(ROUTE_BOOKING_SUCCESS);
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
    setModalMessage(''); 
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Book Care Services</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-neutral-dark">Full Name</label>
          <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientName ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.clientName} />
          {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-neutral-dark">Email Address</label>
            <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.clientEmail} />
            {errors.clientEmail && <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>}
          </div>
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-neutral-dark">Phone Number</label>
            <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.clientPhone ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.clientPhone} />
            {errors.clientPhone && <p className="text-xs text-red-500 mt-1">{errors.clientPhone}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-neutral-dark">Service Needed</label>
          <select name="serviceId" id="serviceId" value={formData.serviceId} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.serviceId ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white`} aria-required="true" aria-invalid={!!errors.serviceId}>
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
            <input type="date" name="requestedDate" id="requestedDate" value={formData.requestedDate} onChange={handleChange} min={today} className={`mt-1 block w-full px-3 py-2 border ${errors.requestedDate ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.requestedDate} />
            {errors.requestedDate && <p className="text-xs text-red-500 mt-1">{errors.requestedDate}</p>}
          </div>
          <div>
            <label htmlFor="requestedTime" className="block text-sm font-medium text-neutral-dark">Requested Time</label>
            <input type="time" name="requestedTime" id="requestedTime" value={formData.requestedTime} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.requestedTime ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.requestedTime}/>
            {errors.requestedTime && <p className="text-xs text-red-500 mt-1">{errors.requestedTime}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-neutral-dark">Full Address for Service</label>
          <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} aria-required="true" aria-invalid={!!errors.address}></textarea>
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-dark">Additional Notes (Optional)</label>
          <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
        </div>

        <div>
          <button 
            type="submit" 
            disabled={isSubmitting || isSubmitDisabled}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
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