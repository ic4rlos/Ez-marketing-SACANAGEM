import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import supabase from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCCompanyProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCCompanyProfile"
    ).then((m) => m.PlasmicCCompanyProfile),
  { ssr: false }
);

export default function CCompanyProfile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  // =========================
  // LOAD COMPANY DATA
  // =========================

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      router.replace("/");
      return;
    }

    async function loadAll() {
      try {
        // =========================
        // COMPANY
        // =========================

        const { data: companyData } = await supabase
          .from("companies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!companyData) {
          setLoading(false);
          return;
        }

        setCompany(companyData);

        const companyId = companyData.id;

        // =========================
        // SOLUTIONS + STEPS
        // =========================

        const { data: solutionsData } = await supabase
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
          .eq("Company_id", companyId)
          .order("id", { ascending: true });

        const structuredSolutions =
          solutionsData?.map((sol: any) => ({
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
          })) ?? [];

        setSolutions(structuredSolutions);

        setLoading(false);
      } catch (err) {
        console.error("Load error:", err);
        setLoading(false);
      }
    }

    loadAll();
  }, [user, router]);

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) return null;

  return (
    <PlasmicCCompanyProfile
      args={{
        company: company,
        formData: solutions,
        solutions: solutions,
        onLogout: handleLogout,
      }}
    />
  );
}
