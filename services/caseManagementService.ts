import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';
import { Case, CaseNote, CaseFile, CaseFormData, CaseNoteFormData, UserType, Patient, Caregiver, CaseStatus } from '../types';
import { CASE_FILES_BUCKET, ALLOWED_CASE_FILE_TYPES, MAX_CASE_FILE_SIZE_MB } from '../constants';

type DbCase = Database['public']['Tables']['cases']['Row'];
type DbCaseInsert = Database['public']['Tables']['cases']['Insert'];
type DbCaseUpdate = Database['public']['Tables']['cases']['Update'];

type DbCaseNote = Database['public']['Tables']['case_notes']['Row'];
type DbCaseNoteInsert = Database['public']['Tables']['case_notes']['Insert'];

type DbCaseFile = Database['public']['Tables']['case_files']['Row'];
type DbCaseFileInsert = Database['public']['Tables']['case_files']['Insert'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Helper to map DB row to Case type, including fetching related patient/staff names
const mapDbCaseToCaseType = async (dbCase: DbCase): Promise<Case> => {
  let patientName = 'Unknown Patient';
  if (dbCase.patient_id && supabase) {
    const { data: patient } = await supabase.from('patients').select('full_name').eq('id', dbCase.patient_id).single();
    if (patient) patientName = patient.full_name;
  }

  let assignedStaffName = 'N/A';
  if (dbCase.assigned_staff_id && supabase) {
    const { data: staff } = await supabase.from('caregivers').select('full_name').eq('id', dbCase.assigned_staff_id).single();
    if (staff) assignedStaffName = staff.full_name;
  }
  
  // Tags are stored as JSONB, parse them if they are a string, or use as is if array
  let tagsArray: string[] = [];
  if (dbCase.tags) {
    if (typeof dbCase.tags === 'string') {
      try {
        tagsArray = JSON.parse(dbCase.tags);
      } catch (e) { console.error("Failed to parse case tags:", e); tagsArray = [dbCase.tags];}
    } else if (Array.isArray(dbCase.tags)) {
      tagsArray = dbCase.tags.map(String);
    }
  }


  return {
    id: dbCase.id,
    patient_id: dbCase.patient_id,
    patient_name: patientName,
    assigned_staff_id: dbCase.assigned_staff_id,
    assigned_staff_name: assignedStaffName,
    title: dbCase.title,
    description: dbCase.description,
    tags: tagsArray,
    status: dbCase.status as CaseStatus,
    created_by_id: dbCase.created_by_id,
    created_by_type: dbCase.created_by_type as UserType || undefined,
    created_at: dbCase.created_at,
    updated_at: dbCase.updated_at,
    resolved_at: dbCase.resolved_at,
    notes: [], // Notes and files will be fetched separately
    files: [],
  };
};

export const getCases = async (filters?: { patientId?: string; status?: CaseStatus | string; assignedStaffId?: string }): Promise<Case[]> => {
  if (!supabase) {
    console.warn("getCases: Supabase client not initialized.");
    return [];
  }
  let query = supabase.from('cases').select('*').order('updated_at', { ascending: false });
  if (filters?.patientId) query = query.eq('patient_id', filters.patientId);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.assignedStaffId) query = query.eq('assigned_staff_id', filters.assignedStaffId);
  
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch cases: ${error.message}`);
  
  return Promise.all(data?.map(mapDbCaseToCaseType) || []);
};

export const getCaseById = async (caseId: string): Promise<Case | null> => {
  if (!supabase) {
    console.warn("getCaseById: Supabase client not initialized.");
    return null;
  }
  const { data, error } = await supabase.from('cases').select('*').eq('id', caseId).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch case ${caseId}: ${error.message}`);
  }
  return data ? mapDbCaseToCaseType(data) : null;
};

export const createCase = async (caseData: CaseFormData, creatorId: string, creatorType: UserType): Promise<Case> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

  const tagsToStore = caseData.tags ? JSON.stringify(caseData.tags.split(',').map(t => t.trim()).filter(t => t)) : null;

  const dbInsert: DbCaseInsert = {
    patient_id: caseData.patient_id,
    title: caseData.title,
    description: caseData.description,
    assigned_staff_id: caseData.assigned_staff_id || null,
    status: caseData.status,
    tags: tagsToStore,
    created_by_id: creatorId,
    created_by_type: creatorType,
    updated_at: new Date().toISOString(), // manual set for consistency as it's not auto-updated by default on insert
  };
  const { data, error } = await supabase.from('cases').insert(dbInsert).select().single();
  if (error || !data) throw new Error(`Failed to create case: ${error?.message || 'No data returned'}`);
  return mapDbCaseToCaseType(data);
};

export const updateCase = async (caseId: string, caseUpdateData: Partial<Omit<Case, 'id'|'patient_name'|'assigned_staff_name'|'notes'|'files'>>): Promise<Case> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  
  const dbUpdate: DbCaseUpdate = {
    ...caseUpdateData,
    tags: caseUpdateData.tags ? JSON.stringify(caseUpdateData.tags) : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('cases').update(dbUpdate).eq('id', caseId).select().single();
  if (error || !data) throw new Error(`Failed to update case ${caseId}: ${error?.message || 'No data returned'}`);
  return mapDbCaseToCaseType(data);
};


// Case Notes
export const getCaseNotes = async (caseId: string): Promise<CaseNote[]> => {
  if (!supabase) {
    console.warn("getCaseNotes: Supabase client not initialized.");
    return [];
  }
  const { data, error } = await supabase.from('case_notes').select('*').eq('case_id', caseId).order('created_at', { ascending: true });
  if (error) throw new Error(`Failed to fetch notes for case ${caseId}: ${error.message}`);
  return data?.map(n => ({ ...n, author_type: n.author_type as UserType })) || [];
};

export const addCaseNote = async (noteData: CaseNoteFormData, authorId: string, authorType: UserType, authorName: string): Promise<CaseNote> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  const dbInsert: DbCaseNoteInsert = {
    case_id: noteData.case_id,
    note: noteData.note,
    visible_to_patient: noteData.visible_to_patient,
    author_id: authorId,
    author_type: authorType,
    author_name: authorName,
  };
  const { data, error } = await supabase.from('case_notes').insert(dbInsert).select().single();
  if (error || !data) throw new Error(`Failed to add note: ${error?.message || 'No data returned'}`);
  return { ...data, author_type: data.author_type as UserType };
};


// Case Files
export const getCaseFiles = async (caseId: string): Promise<CaseFile[]> => {
  if (!supabase) {
    console.warn("getCaseFiles: Supabase client not initialized.");
    return [];
  }
  const { data, error } = await supabase.from('case_files').select('*').eq('case_id', caseId).order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch files for case ${caseId}: ${error.message}`);
  
  return data?.map(f => {
    // Construct public URL for the file from its path
    const { data: urlData } = supabase.storage.from(CASE_FILES_BUCKET).getPublicUrl(f.file_path);
    return { 
      ...f, 
      file_url: urlData?.publicUrl || '',
      uploader_type: f.uploader_type as UserType,
      file_size: f.file_size || 0
    };
  }) || [];
};

export const uploadCaseFile = async (
  caseId: string, file: File, uploaderId: string, uploaderType: UserType, uploaderName: string, visibleToPatient: boolean
): Promise<CaseFile> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

  if (!ALLOWED_CASE_FILE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_CASE_FILE_TYPES.join(', ')}.`);
  }
  if (file.size > MAX_CASE_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds ${MAX_CASE_FILE_SIZE_MB}MB.`);
  }

  const fileExtension = file.name.split('.').pop() || 'bin';
  const filePath = `${caseId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage.from(CASE_FILES_BUCKET).upload(filePath, file);
  if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage.from(CASE_FILES_BUCKET).getPublicUrl(filePath);

  const dbInsert: DbCaseFileInsert = {
    case_id: caseId,
    uploader_id: uploaderId,
    uploader_type: uploaderType,
    uploader_name: uploaderName,
    file_name: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    visible_to_patient: visibleToPatient,
  };
  const { data, error: dbError } = await supabase.from('case_files').insert(dbInsert).select().single();
  if (dbError || !data) {
    // Attempt to delete orphaned file from storage
    await supabase.storage.from(CASE_FILES_BUCKET).remove([filePath]);
    throw new Error(`Failed to record file metadata: ${dbError?.message || 'No data returned'}`);
  }
  return { ...data, file_url: urlData?.publicUrl || '', uploader_type: data.uploader_type as UserType, file_size: data.file_size || 0 };
};

export const deleteCaseFile = async (fileId: string, filePath: string): Promise<void> => {
  if (!supabase) throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);

  const { error: storageError } = await supabase.storage.from(CASE_FILES_BUCKET).remove([filePath]);
  if (storageError) {
    // Log error but proceed to try deleting DB record, as it might be an orphan
    console.error(`Error deleting file from storage (${filePath}): ${storageError.message}`);
  }

  const { error: dbError } = await supabase.from('case_files').delete().eq('id', fileId);
  if (dbError) throw new Error(`Failed to delete file record ${fileId}: ${dbError.message}`);
  
  // If DB delete succeeded but storage delete failed earlier, the file is orphaned.
  // If storage delete succeeded but DB delete failed, that's worse (data inconsistency).
};