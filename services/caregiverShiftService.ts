
import { supabase } from '../supabaseClient';
import { CaregiverShift, CaregiverShiftFormData, ShiftStatus } from '../types';
import { Database } from '../types/supabase';

type CaregiverShiftSupabaseRow = Database['public']['Tables']['caregiver_shifts']['Row'];
type CaregiverShiftSupabaseInsert = Database['public']['Tables']['caregiver_shifts']['Insert'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Fetch all caregiver shifts, joining with caregiver's full name
export const getCaregiverShifts = async (): Promise<CaregiverShift[]> => {
  if (!supabase) {
    console.warn("getCaregiverShifts: Supabase client not initialized. Returning empty list.");
    return [];
  }
  const { data, error } = await supabase
    .from('caregiver_shifts')
    .select(`
      *,
      caregivers (
        full_name
      )
    `)
    .order('shift_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching caregiver shifts:', error);
    throw new Error(`Failed to fetch caregiver shifts: ${error.message}`);
  }

  return data.map(shift => {
    const caregiverData = Array.isArray(shift.caregivers) ? shift.caregivers[0] : shift.caregivers;
    return {
      ...shift,
      shift_date: shift.shift_date || '', // Ensure no null dates
      start_time: shift.start_time || '', // Ensure no null times
      end_time: shift.end_time || '',
      caregiver_full_name: caregiverData?.full_name || 'Unknown Caregiver',
      status: (shift.status as ShiftStatus) || ShiftStatus.SCHEDULED, // Cast and default status
    } as CaregiverShift;
  }) || [];
};

// Add a new caregiver shift
export const addCaregiverShift = async (shiftData: CaregiverShiftFormData): Promise<CaregiverShift> => {
  if (!supabase) {
    console.error("addCaregiverShift: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  let notesToSave = shiftData.notes || '';
  if (shiftData.patient_identifier_notes) {
    notesToSave = `Patient: ${shiftData.patient_identifier_notes}${notesToSave ? `\n${notesToSave}` : ''}`;
  }

  const dataToInsert: CaregiverShiftSupabaseInsert = {
    caregiver_id: shiftData.caregiver_id,
    // patient_id will be null if not provided a direct UUID. The 'patient_identifier_notes' goes into 'notes'.
    patient_id: shiftData.patient_id, // This should be a UUID if available from a patient system, else null.
    shift_date: shiftData.shift_date,
    start_time: shiftData.start_time,
    end_time: shiftData.end_time,
    location: shiftData.location,
    notes: notesToSave,
    status: shiftData.status || ShiftStatus.SCHEDULED,
  };

  const { data, error } = await supabase
    .from('caregiver_shifts')
    .insert([dataToInsert])
    .select(`
      *,
      caregivers (
        full_name
      )
    `)
    .single();

  if (error) {
    console.error('Error adding caregiver shift:', error);
    throw new Error(`Failed to add caregiver shift: ${error.message}`);
  }
  if (!data) throw new Error("Failed to add caregiver shift, no data returned.");

  const caregiverData = Array.isArray(data.caregivers) ? data.caregivers[0] : data.caregivers;

  return {
    ...data,
    shift_date: data.shift_date || '',
    start_time: data.start_time || '',
    end_time: data.end_time || '',
    caregiver_full_name: caregiverData?.full_name || 'Unknown Caregiver',
    status: (data.status as ShiftStatus) || ShiftStatus.SCHEDULED,
  } as CaregiverShift;
};
