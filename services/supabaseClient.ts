
import { createClient } from '@supabase/supabase-js';

// Fallback values if environment variables are not set
const FALLBACK_SUPABASE_URL = 'https://resugovwevyzuhxanapc.supabase.co'; 
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlc3Vnb3Z3ZXZ5enVoeGFuYXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTEzNDYsImV4cCI6MjA2NDEyNzM0Nn0.6666nN-QDSo6t3eLF6Djobj-AbMQdJXnULTaNxpqvDI';

// Read from environment variables, or use fallbacks
const supabaseUrl = process.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;


if (!supabaseUrl) {
  // This case should ideally not be reached if fallbacks are non-empty
  throw new Error("Supabase URL is not defined. Please check your environment variables (VITE_SUPABASE_URL) or configuration.");
}

if (!supabaseKey) {
  // This case should ideally not be reached if fallbacks are non-empty
  throw new Error("Supabase anonymous key is not defined. Please check your environment variables (VITE_SUPABASE_ANON_KEY) or configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
