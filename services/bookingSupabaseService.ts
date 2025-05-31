import { supabase } from '../supabaseClient';
import { AdminBooking, BookingStatus } from '../types';
import { Database } from '../types/supabase';

type BookingSupabaseRow = Database['public']['Tables']['bookings']['Row'];
type BookingSupabaseInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingSupabaseUpdate = Database['public']['Tables']['bookings']['Update'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

function parsePatientInfoFromNotes(notes: string | null, patientId: string | null): string {
  if (!patientId) return "Patient ID missing";
  
  // Attempt to find structured info in notes, e.g., "Client Name: John Doe; Email: jd@ex.com; Phone: 555-1212"
  // This is a basic parser, can be made more robust.
  let name = `Patient ID: ${patientId}`; // Default to ID
  if (notes) {
    const nameMatch = notes.match(/Client Name:\s*([^;]+)/i);
    const emailMatch = notes.match(/Email:\s*([^;]+)/i);
    const phoneMatch = notes.match(/Phone:\s*([^;]+)/i);

    if (nameMatch && nameMatch[1].trim()) {
      name = nameMatch[1].trim();
      if (emailMatch && emailMatch[1].trim()) name += ` (${emailMatch[1].trim()})`;
      else if (phoneMatch && phoneMatch[1].trim()) name += ` (${phoneMatch[1].trim()})`;
    }
  }
  return name;
}


// Fetch all bookings, joining with caregiver's full name
export const getBookings = async (): Promise<AdminBooking[]> => {
  if (!supabase) {
    console.warn("getBookings (Supabase): Supabase client not initialized. Returning empty list.");
    return [];
  }

  // Select from 'bookings' and join 'caregivers' if caregiver_id is present
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      patient_id,
      caregiver_id,
      caregivers (
        full_name
      ),
      service,
      location,
      booking_date,
      start_time,
      end_time,
      notes,
      status,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings from Supabase:', error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return data.map(booking => {
    const caregiverData = Array.isArray(booking.caregivers) ? booking.caregivers[0] : booking.caregivers;
    
    // Convert Supabase status (text) to BookingStatus enum.
    // Handle potential discrepancies or new statuses gracefully.
    let appStatus: BookingStatus;
    switch (booking.status?.toLowerCase()) {
        case 'pending':
        case 'pending approval':
            appStatus = BookingStatus.PENDING;
            break;
        case 'approved':
        case 'approved & upcoming':
        case 'confirmed': // Default from schema, treat as approved
            appStatus = BookingStatus.APPROVED;
            break;
        case 'completed':
            appStatus = BookingStatus.COMPLETED;
            break;
        case 'rejected':
            appStatus = BookingStatus.REJECTED;
            break;
        case 'cancelled':
            appStatus = BookingStatus.CANCELLED;
            break;
        default:
            console.warn(`Unknown booking status from DB: ${booking.status}, defaulting to Pending.`);
            appStatus = BookingStatus.PENDING; 
    }

    return {
      id: booking.id,
      patient_id: booking.patient_id,
      patient_display_info: parsePatientInfoFromNotes(booking.notes, booking.patient_id),
      caregiver_id: booking.caregiver_id,
      caregiver_full_name: caregiverData?.full_name || null,
      service_name: booking.service || 'Unknown Service',
      location: booking.location,
      booking_date: booking.booking_date || '',
      start_time: booking.start_time || '',
      end_time: booking.end_time,
      notes: booking.notes,
      status: appStatus,
      created_at: booking.created_at || new Date().toISOString(),
    };
  }) || [];
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus): Promise<AdminBooking | null> => {
  if (!supabase) {
    console.error("updateBookingStatus (Supabase): Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  // Map BookingStatus enum back to a string representation that the DB expects
  // This might need adjustment based on exact DB values.
  // For now, using the enum string values directly.
  const statusString = newStatus as string;


  const { data, error } = await supabase
    .from('bookings')
    .update({ status: statusString } as BookingSupabaseUpdate)
    .eq('id', bookingId)
    .select(`
        id,
        patient_id,
        caregiver_id,
        caregivers (
            full_name
        ),
        service,
        location,
        booking_date,
        start_time,
        end_time,
        notes,
        status,
        created_at
    `)
    .single();

  if (error) {
    console.error('Error updating booking status in Supabase:', error);
    throw new Error(`Failed to update booking status: ${error.message}`);
  }
  if (!data) return null;

  const caregiverData = Array.isArray(data.caregivers) ? data.caregivers[0] : data.caregivers;
  
  let appStatus: BookingStatus;
    switch (data.status?.toLowerCase()) {
        case 'pending':
        case 'pending approval':
            appStatus = BookingStatus.PENDING;
            break;
        case 'approved':
        case 'approved & upcoming':
        case 'confirmed':
            appStatus = BookingStatus.APPROVED;
            break;
        case 'completed':
            appStatus = BookingStatus.COMPLETED;
            break;
        case 'rejected':
            appStatus = BookingStatus.REJECTED;
            break;
        case 'cancelled':
            appStatus = BookingStatus.CANCELLED;
            break;
        default:
            appStatus = BookingStatus.PENDING; 
    }

  return {
    id: data.id,
    patient_id: data.patient_id,
    patient_display_info: parsePatientInfoFromNotes(data.notes, data.patient_id),
    caregiver_id: data.caregiver_id,
    caregiver_full_name: caregiverData?.full_name || null,
    service_name: data.service || 'Unknown Service',
    location: data.location,
    booking_date: data.booking_date || '',
    start_time: data.start_time || '',
    end_time: data.end_time,
    notes: data.notes,
    status: appStatus,
    created_at: data.created_at || new Date().toISOString(),
  };
};