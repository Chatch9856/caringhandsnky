
import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';
import { AppPaymentGateway } from '../types';
import { PAYMENT_QR_CODES_BUCKET, ALLOWED_QR_IMAGE_TYPES, MAX_QR_IMAGE_SIZE_MB } from '../constants';

type PaymentGatewaySupabaseRow = Database['public']['Tables']['payment_gateways']['Row'];
type PaymentGatewaySupabaseInsert = Database['public']['Tables']['payment_gateways']['Insert'];
type PaymentGatewaySupabaseUpdate = Database['public']['Tables']['payment_gateways']['Update'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Helper to upload QR code image and get public URL
export const uploadQrCodeImage = async (file: File, gatewayType: string): Promise<{ publicUrl: string; filePath: string } | null> => {
  if (!supabase) {
    console.error("uploadQrCodeImage: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  if (!file) return null;

  // Validate file type and size
  if (!ALLOWED_QR_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid QR code image type. Allowed: ${ALLOWED_QR_IMAGE_TYPES.join(', ')}.`);
  }
  if (file.size > MAX_QR_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`QR code image size exceeds ${MAX_QR_IMAGE_SIZE_MB}MB.`);
  }

  const fileExtension = file.name.split('.').pop() || 'png';
  const fileName = `qr_${gatewayType.toLowerCase()}_${Date.now()}.${fileExtension}`;
  const filePath = `${fileName}`; // Public folder within bucket not specified, so uploads to root.

  const { error: uploadError } = await supabase.storage
    .from(PAYMENT_QR_CODES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600', // Cache for 1 hour
      upsert: true, // Overwrite if file with same name exists (useful for updates)
    });

  if (uploadError) {
    console.error('Error uploading QR code image:', uploadError);
    throw new Error(`QR code image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(PAYMENT_QR_CODES_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    console.error('Failed to get public URL for QR code image:', filePath);
    throw new Error('Failed to get public URL for QR code image.');
  }
  return { publicUrl: data.publicUrl, filePath };
};

export const deleteQrCodeImage = async (filePath: string): Promise<void> => {
  if (!supabase) {
    console.error("deleteQrCodeImage: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }
  if (!filePath) return;

  const { error } = await supabase.storage
    .from(PAYMENT_QR_CODES_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting QR code image from storage:', filePath, error);
    // Don't throw an error that stops the gateway update, but log it.
    // The main operation (DB update) might still succeed.
  }
};


export const getPaymentGateways = async (): Promise<AppPaymentGateway[]> => {
  if (!supabase) {
    console.warn("getPaymentGateways: Supabase client not initialized. Returning empty list.");
    return [];
  }
  const { data, error } = await supabase
    .from('payment_gateways')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching payment gateways:', error);
    throw new Error(`Failed to fetch payment gateways: ${error.message}`);
  }

  return data.map(row => ({
    dbId: row.id,
    type: row.type || 'Unknown',
    identifier: row.handle || '',
    instructions: row.instructions || '',
    qrCodeUrl: row.qr_url,
    isEnabled: row.is_active,
    currentQrPath: row.qr_url ? row.qr_url.substring(row.qr_url.lastIndexOf('/') + 1) : null // Basic path extraction
  })) || [];
};

export const upsertPaymentGateway = async (
  gatewayData: AppPaymentGateway
): Promise<AppPaymentGateway> => {
  if (!supabase) {
    console.error("upsertPaymentGateway: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  let newQrCodeUrl = gatewayData.qrCodeUrl;
  let newQrCodePath = gatewayData.currentQrPath;

  // Handle QR code upload if a new file is provided
  if (gatewayData.qrCodeFile) {
    // If there's an old QR code, delete it first
    if (gatewayData.currentQrPath) {
      await deleteQrCodeImage(gatewayData.currentQrPath);
    }
    const uploadResult = await uploadQrCodeImage(gatewayData.qrCodeFile, gatewayData.type);
    if (uploadResult) {
      newQrCodeUrl = uploadResult.publicUrl;
      newQrCodePath = uploadResult.filePath;
    } else {
      // Upload failed, keep old URL if exists or set to null
      newQrCodeUrl = gatewayData.dbId ? gatewayData.qrCodeUrl : null; // Revert to old if update, else null
      newQrCodePath = gatewayData.dbId ? gatewayData.currentQrPath : null;
    }
  } else if (gatewayData.qrCodeFile === null && gatewayData.currentQrPath) {
    // Explicitly remove QR code (qrCodeFile is null, currentQrPath exists)
    await deleteQrCodeImage(gatewayData.currentQrPath);
    newQrCodeUrl = null;
    newQrCodePath = null;
  }
  // If qrCodeFile is undefined, no change to QR code is intended unless newQrCodeUrl was directly set to null.

  const supabaseData: PaymentGatewaySupabaseInsert | PaymentGatewaySupabaseUpdate = {
    type: gatewayData.type,
    handle: gatewayData.identifier,
    instructions: gatewayData.instructions,
    qr_url: newQrCodeUrl,
    is_active: gatewayData.isEnabled,
  };

  let savedRow: PaymentGatewaySupabaseRow | null = null;

  if (gatewayData.dbId) { // Update existing
    const { data, error } = await supabase
      .from('payment_gateways')
      .update(supabaseData as PaymentGatewaySupabaseUpdate)
      .eq('id', gatewayData.dbId)
      .select()
      .single();
    if (error) throw new Error(`Failed to update payment gateway ${gatewayData.type}: ${error.message}`);
    savedRow = data;
  } else { // Insert new
    const { data, error } = await supabase
      .from('payment_gateways')
      .insert(supabaseData as PaymentGatewaySupabaseInsert)
      .select()
      .single();
    if (error) throw new Error(`Failed to add payment gateway ${gatewayData.type}: ${error.message}`);
    savedRow = data;
  }

  if (!savedRow) throw new Error(`Failed to save payment gateway ${gatewayData.type}, no data returned.`);

  return {
    dbId: savedRow.id,
    type: savedRow.type || 'Unknown',
    identifier: savedRow.handle || '',
    instructions: savedRow.instructions || '',
    qrCodeUrl: savedRow.qr_url,
    isEnabled: savedRow.is_active,
    currentQrPath: newQrCodePath, // Return the potentially updated path
  };
};
