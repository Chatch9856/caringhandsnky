import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL
const supabaseUrl = 'https://C-HATCH-9856-PROJECT.supabase.co'; 

// Replace with your actual Supabase anonymous key (this is safe to expose in browser)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlc3Vnb3Z3ZXZ5enVoeGFuYXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTEzNDYsImV4cCI6MjA2NDEyNzM0Nn0.6666nN-QDSo6t3eLF6Djobj-AbMQdJXnULTaNxpqvDI';

if (!supabaseUrl) {
  throw new Error("Supabase URL is not defined. Please check your environment variables or configuration.");
}

if (!supabaseKey) {
  throw new Error("Supabase anonymous key is not defined. Please check your environment variables or configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);