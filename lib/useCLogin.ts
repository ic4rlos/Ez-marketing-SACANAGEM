import { useState } from "react";
import getSupabaseC from "./c-supabaseClient";
import { useRouter } from "next/router";

export function useCLogin() {
  const supabase = getSupabaseC();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/find-a-affiliate");
  }

  return { login, loading, error };
}
