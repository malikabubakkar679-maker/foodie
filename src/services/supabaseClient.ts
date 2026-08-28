import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://foodie-app.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-foodie-2026';

export const isLiveSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project') &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key') &&
  !import.meta.env.VITE_SUPABASE_URL.includes('foodie-app.supabase.co') &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('mock-anon-key')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
