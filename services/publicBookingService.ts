import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';
import { PublicService, PublicCaregiver, PublicBookingFormData, Patient } from '../types';

type PatientRow = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type ServiceRow = Database['public']['Tables']['services']['Row'];


const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

export const fetchPublicServices = async (): Promise<PublicService[]> => {
  if (!supabase) {
    console.warn("fetchPublicServices: Supabase client not initialized. Returning empty list.");
    return [];
  }
  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .eq('is_active', true) // Assuming services can be active/inactive
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching public services:', error);
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
  return data || [];
};

export const fetchActiveCaregiversPublic = async (): Promise<PublicCaregiver[]> => {
  if (!supabase) {
    console.warn("fetchActiveCaregiversPublic: Supabase client not initialized. Returning empty list.");
    return [];
  }
  const { data, error } = await supabase
    .from('caregivers')
    .select('id, full_name')
    .eq('status', 'Active') // Assuming 'Active' is the status string for active caregivers
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching active caregivers:', error);
    throw new Error(`Failed to fetch active caregivers: ${error.message}`);
  }
  return data || [];
};

export const submitPublicBooking = async (
  bookingData: PublicBookingFormData
): Promise<{ bookingId: string }> => {
  if (!supabase) {
    console.error("submitPublicBooking: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  // Step 1: Find or create patient
  let patientId: string;
  const { data: existingPatient, error: patientSelectError } = await supabase
    .from('patients')
    .select('id')
    .eq('email', bookingData.email)
    .single();

  if (patientSelectError && patientSelectError.code !== 'PGRST116') { // PGRST116: Row to retrieve was not found
    console.error('Error checking for existing patient:', patientSelectError);
    throw new Error(`Error finding patient: ${patientSelectError.message}`);
  }

  if (existingPatient) {
    patientId = existingPatient.id;
  } else {
    const patientToInsert: PatientInsert = {
      full_name: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
    };
    const { data: newPatient, error: patientInsertError } = await supabase
      .from('patients')
      .insert(patientToInsert)
      .select('id')
      .single();

    if (patientInsertError || !newPatient) {
      console.error('Error creating new patient:', patientInsertError);
      throw new Error(`Failed to create patient profile: ${patientInsertError?.message || 'Unknown error'}`);
    }
    patientId = newPatient.id;
  }

  // Step 2: Prepare booking data (service name is already in bookingData.serviceName)
  const bookingToInsert: BookingInsert = {
    patient_id: patientId,
    service: bookingData.serviceName, // Storing service name as per current bookings.service schema (text)
    booking_date: bookingData.preferredDate,
    start_time: bookingData.preferredTime,
    notes: bookingData.notes,
    caregiver_id: bookingData.preferredCaregiverId || null,
    status: 'Pending', // Default status for new public bookings
    // location: could be part of notes or a separate field if added to form/schema
  };
  
  // Step 3: Insert booking
  const { data: newBooking, error: bookingInsertError } = await supabase
    .from('bookings')
    .insert(bookingToInsert)
    .select('id')
    .single();

  if (bookingInsertError || !newBooking) {
    console.error('Error creating new booking:', bookingInsertError);
    throw new Error(`Failed to submit booking request: ${bookingInsertError?.message || 'Unknown error'}`);
  }

  return { bookingId: newBooking.id };
};
