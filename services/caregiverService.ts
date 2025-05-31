
import { supabase } from '../supabaseClient';
import { Caregiver, CaregiverFormData, PredefinedSkill, PredefinedCertification, CaregiverStatus } from '../types';
import { CAREGIVER_PHOTO_BUCKET } from '../constants';

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Helper to upload image and get public URL
export const uploadProfileImage = async (file: File, caregiverId?: string): Promise<string | null> => {
  if (!supabase) {
    console.error("uploadProfileImage: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  if (!file) return null;

  const fileName = caregiverId ? `caregiver_${caregiverId}_${Date.now()}_${file.name}` : `caregiver_${Date.now()}_${file.name}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(CAREGIVER_PHOTO_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600', // Cache for 1 hour
      upsert: true, // Overwrite if file with same name exists (useful for updates)
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(CAREGIVER_PHOTO_BUCKET).getPublicUrl(filePath);
  return data?.publicUrl || null;
};


// Fetch all caregivers
export const getCaregivers = async (): Promise<Caregiver[]> => {
  if (!supabase) {
    console.warn("getCaregivers: Supabase client not initialized. Returning empty list.");
    // Depending on strictness, could throw Error(RETHROW_UNINITIALIZED_ERROR_MSG)
    return [];
  }
  const { data, error } = await supabase
    .from('caregivers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching caregivers:', error);
    throw new Error(`Failed to fetch caregivers: ${error.message}`);
  }
  // Ensure skills and certifications are arrays, even if null/undefined from DB
  return data.map(cg => ({
      ...cg,
      skills: Array.isArray(cg.skills) ? cg.skills as PredefinedSkill[] : [],
      certifications: Array.isArray(cg.certifications) ? cg.certifications as PredefinedCertification[] : [],
      status: cg.status as CaregiverStatus, // Cast status
  })) || [];
};

// Add a new caregiver
export const addCaregiver = async (caregiverData: CaregiverFormData, imageFile?: File): Promise<Caregiver> => {
  if (!supabase) {
    console.error("addCaregiver: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  let imageUrl: string | null = null;
  if (imageFile) {
    // For a new caregiver, we don't have an ID yet for the filename, so use a timestamp approach.
    imageUrl = await uploadProfileImage(imageFile); // uploadProfileImage already checks for supabase client
  }

  const dataToInsert = {
    ...caregiverData,
    profile_image_url: imageUrl,
  };

  const { data, error } = await supabase
    .from('caregivers')
    .insert([dataToInsert])
    .select()
    .single(); // Assuming you want the inserted record back

  if (error) {
    console.error('Error adding caregiver:', error);
    if (imageUrl) console.warn("Orphaned image might exist in storage due to DB insert failure:", imageUrl);
    throw new Error(`Failed to add caregiver: ${error.message}`);
  }
  if (!data) throw new Error("Failed to add caregiver, no data returned.");
  
  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills as PredefinedSkill[] : [],
    certifications: Array.isArray(data.certifications) ? data.certifications as PredefinedCertification[] : [],
    status: data.status as CaregiverStatus,
  };
};

// Update an existing caregiver
export const updateCaregiver = async (id: string, caregiverData: Partial<CaregiverFormData>, imageFile?: File | null): Promise<Caregiver> => {
  if (!supabase) {
    console.error("updateCaregiver: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  let imageUrl = caregiverData.profile_image_url; // Keep existing if not changed

  if (imageFile) { // If a new file is provided
    imageUrl = await uploadProfileImage(imageFile, id);
  } else if (imageFile === null) { // If imageFile is explicitly null, it means remove the image
    imageUrl = null; 
    // Consider deleting old image from storage if caregiverData.profile_image_url had a value.
    // This is complex as it requires the old URL. For simplicity, handled by direct URL update for now.
  }
  // If imageFile is undefined, it means no change to the image, so imageUrl (from caregiverData.profile_image_url) is used.

  const dataToUpdate = {
    ...caregiverData,
    profile_image_url: imageUrl,
  };
  // Remove id from dataToUpdate if it exists, as it's used in .eq()
  if ('id' in dataToUpdate) delete (dataToUpdate as any).id;


  const { data, error } = await supabase
    .from('caregivers')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating caregiver:', error);
    throw new Error(`Failed to update caregiver: ${error.message}`);
  }
  if (!data) throw new Error("Failed to update caregiver, no data returned.");
  
  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills as PredefinedSkill[] : [],
    certifications: Array.isArray(data.certifications) ? data.certifications as PredefinedCertification[] : [],
    status: data.status as CaregiverStatus,
  };
};

// Delete a caregiver
export const deleteCaregiver = async (id: string): Promise<void> => {
  if (!supabase) {
    console.error("deleteCaregiver: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  
  const { data: caregiverToDelete, error: fetchError } = await supabase
    .from('caregivers')
    .select('profile_image_url')
    .eq('id', id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row to retrieve was not found"
     console.warn('Could not fetch caregiver for image deletion, or caregiver already deleted:', fetchError);
  }

  const { error } = await supabase
    .from('caregivers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting caregiver:', error);
    throw new Error(`Failed to delete caregiver: ${error.message}`);
  }

  // If caregiver had an image and was successfully deleted from DB, delete from storage
  if (caregiverToDelete?.profile_image_url) {
    try {
        const urlParts = caregiverToDelete.profile_image_url.split('/');
        const imageFileNameWithBucket = urlParts.slice(urlParts.indexOf(CAREGIVER_PHOTO_BUCKET)).join('/');
        const imagePath = imageFileNameWithBucket.substring(CAREGIVER_PHOTO_BUCKET.length + 1); // remove bucket name and leading slash

        if (imagePath) {
            const { error: storageError } = await supabase.storage
                .from(CAREGIVER_PHOTO_BUCKET)
                .remove([imagePath]);
            if (storageError) {
                console.error('Error deleting caregiver image from storage:', imagePath, storageError);
            }
        }
    } catch (e) {
        console.error("Error parsing image URL for deletion:", e);
    }
  }
};