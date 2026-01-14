export const env = {
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL ?? '').trim(),
  supabaseKey: (import.meta.env.VITE_SUPABASE_KEY ?? '').trim(),
};

export const isSupabaseConfigured = () =>
  Boolean(env.supabaseUrl && env.supabaseKey);
