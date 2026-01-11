import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are missing and log helpful error message
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey;

if (isMissingCredentials) {
  console.error(
    '❌ CRITICAL: Supabase credentials are missing!\n\n' +
    'Required environment variables:\n' +
    '  - VITE_SUPABASE_URL: ' + (supabaseUrl ? '✅ configured' : '❌ MISSING') + '\n' +
    '  - VITE_SUPABASE_ANON_KEY: ' + (supabaseAnonKey ? '✅ configured' : '❌ MISSING') + '\n\n' +
    'Auth features (login, registration, profile, cart, orders, wishlist) will NOT work until these are configured.\n' +
    'Public pages (home, categories, products) will continue to work normally.\n\n' +
    'Contact your infrastructure team to add these variables to the production environment.'
  );
}

// Create client with fallback values to prevent crashes
// Even with empty strings, the client will be created but auth operations will fail gracefully
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// Export flag to check if Supabase is properly configured
export const isSupabaseConfigured = !isMissingCredentials;
