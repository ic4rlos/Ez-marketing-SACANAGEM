import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseB } from "../lib/b-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACompanyProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACompanyProfile"
    ).then((m) => m.PlasmicACompanyProfile),
  { ssr: false }
);

export default function ACompanyProfile() {

  const router = useRouter();

  const supabaseA = getSupabaseA(); // agencies
  const supabaseB = getSupabaseB(); // companies

  const { id } = router.query;

  const [viewer, setViewer] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH (AGENCIES)
  // =========================

  useEffect(() => {

    async function loadUser() {

      const { data } = await supabaseA.auth.getUser();

      setViewer(data?.user ?? null);

    }

    loadUser();

  }, []);

  // =========================
  // LOAD COMPANY (COMPANIES DB)
  // =========================

  useEffect(() => {

    if (!id) return;

    async function loadCompany() {

      try {

        const companyId = Number(id);

        const { data: companyData } = await supabaseB
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .maybeSingle();

        if (!companyData) {

          setCompany(null);
          setFormData([]);
          setLoading(false);
          return;

        }

        setCompany(companyData);

        const { data: solutionsData } = await supabaseB
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
                  step_text: s.step_text ?? ""
                })) ?? []
          })) ?? [];

        setFormData(structuredSolutions);

      } catch (err) {

        console.error("Load company error:", err);

      }

      setLoading(false);

    }

    loadCompany();

  }, [id]);

  // =========================
  // SAVE CONNECTION (AGENCIES DB)
  // =========================

  async function handleSave(data:any) {

    if (!viewer || !id) return;

    try {

      await supabaseA
        .from("CONNECTIONS")
        .insert({
          agency_id: viewer.id,
          company_id: id,
          short_message: data.short_message ?? ""
        });

    } catch (err) {

      console.error("Connection error:", err);

    }

  }

  if (loading) return null;

  return (
    <PlasmicACompanyProfile
      args={{
        company: company ?? {},
        formData: formData ?? [],
        solutions: formData ?? [],
        onSave: handleSave
      }}
    />
  );

}
