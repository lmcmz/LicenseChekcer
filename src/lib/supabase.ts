import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../env';

const VITE_SUPABASE_URL = env.supabaseUrl;
const VITE_SUPABASE_KEY = env.supabaseKey;

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          apikey: VITE_SUPABASE_KEY,
        },
      },
    })
  : null;

export { isSupabaseConfigured };
