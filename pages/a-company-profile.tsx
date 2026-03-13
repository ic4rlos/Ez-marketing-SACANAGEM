import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";

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
  const supabase = getSupabaseA();

  const { id } = router.query;

  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD COMPANY
  // =========================
  useEffect(() => {

    if (!id) return;

    async function loadCompany() {

      try {

        const { data: companyData } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!companyData) {
          setCompany(null);
          setFormData([]);
          setLoading(false);
          return;
        }

        setCompany(companyData);

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

  if (loading) return null;

  return (
    <PlasmicACompanyProfile
      args={{
        company: company ?? {},
        formData: formData ?? [],
        solutions: formData ?? []
      }}
    />
  );

}
