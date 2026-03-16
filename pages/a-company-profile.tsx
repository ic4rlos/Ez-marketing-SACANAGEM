import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

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

  console.log("PAGE RENDER");

  const router = useRouter();

  console.log("Router query:", router.query);

  const supabaseA = getSupabaseA(); // agencies
  const supabaseC = getSupabaseC(); // companies

  const { id } = router.query;

  console.log("Router id:", id);

  const [viewer, setViewer] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("STATE SNAPSHOT");
  console.log("viewer:", viewer);
  console.log("company:", company);
  console.log("solutions:", formData);
  console.log("loading:", loading);

  // =========================
  // AUTH (AGENCIES)
  // =========================

  useEffect(() => {

    async function loadUser() {

      console.log("Loading viewer from Supabase A...");

      const { data, error } = await supabaseA.auth.getUser();

      console.log("Auth response:", data);
      console.log("Auth error:", error);

      const resolvedUser = data?.user ?? null;

      console.log("Viewer resolved:", resolvedUser);

      setViewer(resolvedUser);

    }

    loadUser();

  }, []);

  // =========================
  // LOAD COMPANY (COMPANIES DB)
  // =========================

  useEffect(() => {

    console.log("Company loader triggered");
    console.log("Current id:", id);

    if (!id) {
      console.log("No ID yet — router probably not ready");
      return;
    }

    async function loadCompany() {

      try {

        const companyId = Number(id);

        console.log("Converted companyId:", companyId);
        console.log("Querying companies table (Supabase C)...");

        const { data: companyData, error: companyError } = await supabaseC
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .maybeSingle();

        console.log("Company query result:", companyData);
        console.log("Company query error:", companyError);

        if (!companyData) {

          console.log("Company not found");

          setCompany(null);
          setFormData([]);
          setLoading(false);
          return;

        }

        console.log("Company found:", companyData);

        setCompany(companyData);

        console.log("Loading company solutions...");

        const { data: solutionsData, error: solutionsError } = await supabaseC
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

        console.log("Solutions result:", solutionsData);
        console.log("Solutions error:", solutionsError);

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

        console.log("Structured solutions:", structuredSolutions);

        setFormData(structuredSolutions);

      } catch (err) {

        console.error("Load company exception:", err);

      }

      setLoading(false);

    }

    loadCompany();

  }, [id]);

  // =========================
  // SAVE CONNECTION (AGENCIES DB)
  // =========================

  async function handleSave(data:any) {

    console.log("SAVE BUTTON TRIGGERED");
    console.log("Incoming form data:", data);

    console.log("Current viewer:", viewer);
    console.log("Current router id:", id);

    if (!viewer || !id) {

      console.log("Save blocked — viewer or id missing");
      return;

    }

    const payload = {

      agency_id: viewer.id,
      company_id: Number(id),
      short_message: data?.short_message ?? ""

    };

    console.log("Payload being sent to CONNECTIONS:");
    console.log(payload);

    try {

      const { data: insertResult, error: insertError } = await supabaseA
        .from("CONNECTIONS")
        .insert(payload)
        .select();

      console.log("INSERT RESULT:", insertResult);
      console.log("INSERT ERROR:", insertError);

    } catch (err) {

      console.error("Connection exception:", err);

    }

  }

  if (loading) {

    console.log("Still loading — render blocked");

    return null;

  }

  console.log("Rendering Plasmic component");

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
