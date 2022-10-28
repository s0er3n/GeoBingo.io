import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
if (!(SUPABASE_URL && SUPABASE_KEY)) {
  console.warn("no supabase key or/and url");
}
export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      })
    : undefined;
