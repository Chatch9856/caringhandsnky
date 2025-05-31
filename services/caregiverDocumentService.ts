import { supabase } from '../supabaseClient';
import { CaregiverDocument, DocumentType } from '../types';
import { Database } from '../types/supabase';
import { 
    CAREGIVER_DOCUMENTS_BUCKET, 
    ALLOWED_DOCUMENT_TYPES, 
    MAX_DOCUMENT_SIZE_MB 
} from '../constants';

type CaregiverDocumentSupabaseRow = Database['public']['Tables']['caregiver_documents']['Row'];
type CaregiverDocumentSupabaseInsert = Database['public']['Tables']['caregiver_documents']['Insert'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Helper to upload document and get public URL
export const uploadCaregiverDocumentFile = async (
    file: File, 
    caregiverId: string
): Promise<{ publicUrl: string; filePath: string; fileName: string }> => {
  if (!supabase) {
    console.error("uploadCaregiverDocumentFile: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error(`Invalid document file type. Allowed: ${ALLOWED_DOCUMENT_TYPES.join(', ')}.`);
  }
  if (file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024) {
    throw new Error(`Document file size exceeds ${MAX_DOCUMENT_SIZE_MB}MB.`);
  }

  const fileExtension = file.name.split('.').pop() || 'bin';
  // Sanitize original file name for use in path, but keep it simple.
  const safeOriginalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_').substring(0, 50);
  const filePath = `${caregiverId}/${Date.now()}_${safeOriginalName}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(CAREGIVER_DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600', // Cache for 1 hour
      upsert: false, 
    });

  if (uploadError) {
    console.error('Error uploading caregiver document:', uploadError);
    throw new Error(`Document upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(CAREGIVER_DOCUMENTS_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    console.error('Failed to get public URL for caregiver document:', filePath);
    throw new Error('Failed to get public URL for caregiver document.');
  }
  return { publicUrl: data.publicUrl, filePath, fileName: file.name };
};

export const deleteCaregiverDocumentFile = async (filePath: string): Promise<void> => {
  if (!supabase) {
    console.error("deleteCaregiverDocumentFile: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  if (!filePath) return;

  const { error } = await supabase.storage
    .from(CAREGIVER_DOCUMENTS_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting caregiver document file from storage:', filePath, error);
    // Log but don't necessarily throw if DB deletion still needs to proceed or already happened
  }
};


export const getCaregiverDocuments = async (caregiverIdFilter?: string): Promise<CaregiverDocument[]> => {
  if (!supabase) {
    console.warn("getCaregiverDocuments: Supabase client not initialized. Returning empty list.");
    return [];
  }
  
  let query = supabase
    .from('caregiver_documents')
    .select(`
      *,
      caregivers (full_name)
    `)
    .order('uploaded_at', { ascending: false });

  if (caregiverIdFilter) {
    query = query.eq('caregiver_id', caregiverIdFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching caregiver documents:', error);
    throw new Error(`Failed to fetch caregiver documents: ${error.message}`);
  }

  return data.map(doc => {
    const caregiverData = Array.isArray(doc.caregivers) ? doc.caregivers[0] : doc.caregivers;
    const docUrl = doc.doc_url || '';
    // Attempt to extract original filename if stored or infer from URL
    let fileName = docUrl.substring(docUrl.lastIndexOf('/') + 1);
    // Basic heuristic: if it looks like timestamp_filename.ext, try to get filename.ext
    const nameParts = fileName.split('_');
    if (nameParts.length > 1 && /^\d+$/.test(nameParts[0])) {
        fileName = nameParts.slice(1).join('_');
    }

    return {
      ...doc,
      caregiver_full_name: caregiverData?.full_name || 'Unknown Caregiver',
      doc_type: doc.doc_type as DocumentType,
      file_name: fileName, // Store extracted/inferred filename
    } as CaregiverDocument;
  }) || [];
};

export const addCaregiverDocument = async (
  docMetaData: Pick<CaregiverDocument, 'caregiver_id' | 'doc_type' | 'expires_on'>,
  file: File
): Promise<CaregiverDocument> => {
  if (!supabase) {
    console.error("addCaregiverDocument: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  const { publicUrl, filePath, fileName: uploadedFileName } = await uploadCaregiverDocumentFile(file, docMetaData.caregiver_id);

  const dataToInsert: CaregiverDocumentSupabaseInsert = {
    caregiver_id: docMetaData.caregiver_id,
    doc_type: docMetaData.doc_type,
    expires_on: docMetaData.expires_on || null,
    doc_url: publicUrl,
    // uploaded_at is default now() in DB
  };

  const { data, error } = await supabase
    .from('caregiver_documents')
    .insert([dataToInsert])
    .select(`*, caregivers (full_name)`) // Fetch joined data
    .single();

  if (error) {
    console.error('Error adding caregiver document record:', error);
    // Attempt to delete orphaned file from storage
    await deleteCaregiverDocumentFile(filePath);
    throw new Error(`Failed to add caregiver document record: ${error.message}`);
  }
  if (!data) throw new Error("Failed to add caregiver document, no data returned.");
  
  const caregiverData = Array.isArray(data.caregivers) ? data.caregivers[0] : data.caregivers;

  return {
    ...data,
    caregiver_full_name: caregiverData?.full_name || 'Unknown Caregiver',
    doc_type: data.doc_type as DocumentType,
    file_name: uploadedFileName, // Use the original uploaded file name for display
  } as CaregiverDocument;
};

export const deleteCaregiverDocument = async (documentId: string, documentUrl: string): Promise<void> => {
  if (!supabase) {
    console.error("deleteCaregiverDocument: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  // Extract file path from URL for deletion from storage
  // Assumes URL is like: https://<project_ref>.supabase.co/storage/v1/object/public/<bucket_name>/<file_path>
  let filePath = '';
  try {
    const url = new URL(documentUrl);
    const parts = url.pathname.split('/');
    // Find bucket name in path, and take everything after it.
    const bucketIndex = parts.indexOf(CAREGIVER_DOCUMENTS_BUCKET);
    if (bucketIndex !== -1 && bucketIndex < parts.length -1) {
        filePath = parts.slice(bucketIndex + 1).join('/');
    } else {
        console.warn("Could not reliably determine file path from URL for deletion:", documentUrl);
    }
  } catch (e) {
    console.error("Error parsing document URL for storage deletion:", e);
  }


  const { error: dbError } = await supabase
    .from('caregiver_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    console.error('Error deleting caregiver document from database:', dbError);
    throw new Error(`Failed to delete caregiver document from database: ${dbError.message}`);
  }

  // If DB deletion was successful and we have a file path, delete from storage
  if (filePath) {
    await deleteCaregiverDocumentFile(filePath);
  } else {
    console.warn(`Document ${documentId} deleted from DB, but file path for storage deletion was not found or invalid: ${documentUrl}`);
  }
};
