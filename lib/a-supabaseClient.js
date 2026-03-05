import { createClient } from "@supabase/supabase-js";

const AGENCY_URL = process.env.NEXT_PUBLIC_SUPABASE_AGENCY_URL;
const AGENCY_ANON = process.env.NEXT_PUBLIC_SUPABASE_AGENCY_ANON_KEY;

if (!AGENCY_URL || !AGENCY_ANON) {
  throw new Error("Supabase Agency environment variables are missing.");
}

let supabaseA = null;

export function getSupabaseA() {
  if (!supabaseA) {
    supabaseA = createClient(AGENCY_URL, AGENCY_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseA;
}

export default getSupabaseA();
