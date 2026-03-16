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

  const router = useRouter();

  const supabaseA = getSupabaseA(); // agencies DB
  const supabaseC = getSupabaseC(); // companies DB

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

        const { data: companyData } = await supabaseC
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

        const { data: solutionsData } = await supabaseC
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

  async function handleSave(data: any) {

  console.log("handleSave recebeu:", data);
  console.log("short_message:", data?.short_message);
    
    if (!viewer || !id) return;

    try {

      console.log("Starting connection flow");

      const userId = viewer.id;

      // descobrir agency do usuário
      const { data: membership, error: membershipError } = await supabaseA
        .from("community_members")
        .select("community_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (membershipError) {

        console.error("Community lookup error:", membershipError);
        return;

      }

      if (!membership) {

        console.error("User not part of any community");
        return;

      }

      const agencyId = membership.community_id;

      console.log("Agency found:", agencyId);

      const payload = {

        status: "agency request",
        acceptade_at: new Date().toISOString(),
        created_by_user_id: userId,
        agency_id: agencyId,
        short_message: data?.short_message ?? "",
        company_id: Number(id)

      };

      console.log("Payload being sent:", payload);

      const { error: insertError } = await supabaseA
        .from("CONNECTIONS")
        .insert(payload);

      if (insertError) {

        console.error("Insert error:", insertError);

      } else {

        console.log("Connection created successfully");

      }

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
