import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import supabase from "../lib/c-supabaseClient";

console.log("🔥 CCompanyProfile module loaded");

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCCompanyProfile = dynamic(
  async () => {
    console.log("🔥 Attempting dynamic import of Plasmic component...");
    const mod = await import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCCompanyProfile"
    );
    console.log("🔥 Plasmic component module loaded:", mod);
    return mod;
  },
  { ssr: false }
);

export default function CCompanyProfile() {
  console.log("🔥 CCompanyProfile render start");

  const router = useRouter();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("🔥 Current state snapshot:", {
    user,
    company,
    solutions,
    loading,
    pathname: router.pathname,
  });

  // =========================
  // ROUTER EVENTS
  // =========================

  useEffect(() => {
    console.log("🔥 Router initialized:", router);

    const handleStart = (url: string) => {
      console.log("🚨 ROUTE CHANGE START:", url);
    };

    const handleComplete = (url: string) => {
      console.log("✅ ROUTE CHANGE COMPLETE:", url);
    };

    const handleError = (err: any, url: string) => {
      console.error("💥 ROUTE CHANGE ERROR:", url, err);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    console.log("🔥 Starting loadUser()");

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        console.log("🔥 Supabase getUser result:", {
          data,
          error,
        });

        setUser(data?.user ?? null);
      } catch (err) {
        console.error("💥 loadUser crash:", err);
      }
    }

    loadUser();
  }, []);

  // =========================
  // REDIRECT IF NOT LOGGED
  // =========================

  useEffect(() => {
    console.log("🔥 Redirect check:", {
      user,
      loading,
      pathname: router.pathname,
    });

    if (user === null && !loading) {
      console.warn("⚠️ User is null. Considering redirect.");

      if (router.pathname !== "/") {
        console.warn("⚠️ Redirecting to /");
        router.replace("/");
      } else {
        console.warn("⚠️ Already on /. Skipping redirect.");
      }
    }
  }, [user, loading, router]);

  // =========================
  // LOAD COMPANY + SOLUTIONS
  // =========================

  useEffect(() => {
    console.log("🔥 loadAll trigger check:", { user });

    if (!user) {
      console.log("🔥 No user yet. Skipping loadAll.");
      return;
    }

    async function loadAll() {
      console.log("🔥 Starting loadAll()");

      try {
        setLoading(true);

        console.log("🔥 Fetching company...");

        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        console.log("🔥 Company query result:", {
          companyData,
          companyError,
        });

        if (!companyData) {
          console.warn("⚠️ No company found for user");

          setCompany(null);
          setSolutions([]);
          setLoading(false);
          return;
        }

        setCompany(companyData);

        console.log("🔥 Fetching solutions for company:", companyData.id);

        const { data: solutionsData, error: solutionsError } = await supabase
          .from("solutions")
          .select(`
            id,
            Title,
            Description,
            Price,
            solutions_steps (
              id,
              step_text,
              Step_order
            )
          `)
          .eq("Company_id", companyData.id)
          .order("id", { ascending: true });

        console.log("🔥 Solutions query result:", {
          solutionsData,
          solutionsError,
        });

        const structuredSolutions =
          solutionsData?.map((sol: any) => {
            console.log("🔥 Processing solution:", sol);

            return {
              id: sol.id,
              title: sol.Title ?? "",
              description: sol.Description ?? "",
              price: sol.Price ?? "",
              steps:
                sol.solutions_steps
                  ?.sort(
                    (a: any, b: any) =>
                      (a.Step_order ?? 0) - (b.Step_order ?? 0)
                  )
                  .map((s: any) => ({
                    id: s.id,
                    step_text: s.step_text ?? "",
                  })) ?? [],
            };
          }) ?? [];

        console.log("🔥 Structured solutions:", structuredSolutions);

        setSolutions(structuredSolutions);
      } catch (err) {
        console.error("💥 loadAll crash:", err);
      }

      console.log("🔥 loadAll finished");

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    console.warn("⚠️ Logout triggered");

    try {
      await supabase.auth.signOut();
      console.warn("⚠️ Logout success. Redirecting.");
      router.replace("/");
    } catch (err) {
      console.error("💥 Logout error:", err);
    }
  }

  // =========================
  // RENDER GUARDS
  // =========================

  if (user === undefined) {
    console.log("🔥 Render blocked: user undefined");
    return null;
  }

  if (loading) {
    console.log("🔥 Render blocked: loading true");
    return null;
  }

  console.log("🔥 FINAL RENDER", {
    company,
    solutions,
  });

  return (
    <PlasmicCCompanyProfile
      args={{
        company: company ?? {},
        formData: solutions ?? [],
        solutions: solutions ?? [],
        onLogout: handleLogout,
      }}
    />
  );
}
