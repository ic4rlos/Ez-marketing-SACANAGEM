import { createClient } from "@supabase/supabase-js";

const COMPANY_URL = process.env.NEXT_PUBLIC_SUPABASE_COMPANY_URL;
const COMPANY_ANON = process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ANON_KEY;

if (!COMPANY_URL || !COMPANY_ANON) {
  throw new Error("Supabase Company environment variables are missing.");
}

let supabaseC = null;

export function getSupabaseC() {
  if (!supabaseC) {
    supabaseC = createClient(COMPANY_URL, COMPANY_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseC;
}

export default getSupabaseC();
