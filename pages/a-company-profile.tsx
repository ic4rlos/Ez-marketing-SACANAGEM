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

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const { id } = router.query;

  const [viewer, setViewer] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseA.auth.getUser();
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD ALL
  // =========================

  useEffect(() => {
    if (!id) return;

    async function loadAll() {
      try {
        const companyId = Number(id);

        // =========================
        // COMPANY
        // =========================

        const { data: company } = await supabaseC
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .maybeSingle();

        if (!company) {
          setFormData({});
          setLoading(false);
          return;
        }

        // =========================
        // LOGGED PROFILE PIC
        // =========================

        let logged_profile_pic = null;

        if (viewer?.id) {
          const { data: profile } = await supabaseA
            .from("User profile")
            .select('"Profile pic"')
            .eq("user_id", viewer.id)
            .maybeSingle();

          logged_profile_pic = profile?.["Profile pic"] ?? null;
        }

        // =========================
        // CONNECTION
        // =========================

        let connection = null;

        if (viewer?.id) {
          const { data: membership } = await supabaseA
            .from("community_members")
            .select("community_id")
            .eq("user_id", viewer.id)
            .maybeSingle();

          if (membership?.community_id) {
            const { data } = await supabaseA
              .from("CONNECTIONS")
              .select("*")
              .eq("agency_id", membership.community_id)
              .eq("company_id", company.id)
              .maybeSingle();

            connection = data;
          }
        }

        const isConnected = connection?.status === "connected";

        // =========================
        // SOLUTIONS
        // =========================

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
          .eq("Company_id", company.id);

        const solutions =
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

        // =========================
        // REVIEWS
        // =========================

        const { data: reviews } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", company.id);

        const normalize = (r: any) => ({
          rating: Number(r?.rating ?? 0),
          comment: r?.comment ?? ""
        });

        const company_reviews =
          (reviews ?? [])
            .filter((r: any) => r.author_type === "community")
            .map(normalize);

        const company_membersreviews =
          (reviews ?? [])
            .filter((r: any) => r.author_type === "member")
            .map(normalize);

        const company_replies =
          (reviews ?? [])
            .filter((r: any) => r.author_type?.startsWith("company"))
            .map(normalize);

        const total_reviews = company_reviews.length;

        const average_rating =
          total_reviews > 0
            ? company_reviews.reduce(
                (acc: number, r: any) => acc + r.rating,
                0
              ) / total_reviews
            : 0;

        // =========================
        // FINAL OBJECT
        // =========================

        const nextFormData = {
          ...company,

          "Company nature": company?.["Company nature"] ?? "Standard",

          solutions,
          company_reviews,
          company_membersreviews,
          company_replies,

          total_reviews,
          average_rating,

          connection,
          isConnected,

          logged_profile_pic
        };

        setFormData(nextFormData);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadAll();
  }, [id, viewer]);

  // =========================
  // SAVE CONNECTION (ANTI DUPLICAÇÃO)
  // =========================

  async function handleSave(data: any) {
    if (!viewer || !id) return;

    const { data: membership } = await supabaseA
      .from("community_members")
      .select("community_id")
      .eq("user_id", viewer.id)
      .maybeSingle();

    if (!membership) return;

    // 🔥 CHECK EXISTENTE
    const { data: existingConnection } = await supabaseA
      .from("CONNECTIONS")
      .select("id, status")
      .eq("agency_id", membership.community_id)
      .eq("company_id", Number(id))
      .maybeSingle();

    // 🔁 UPDATE SE EXISTIR
    if (existingConnection) {
      await supabaseA
        .from("CONNECTIONS")
        .update({
          status: "agency request",
          short_message: data?.short_message ?? ""
        })
        .eq("id", existingConnection.id);

      return;
    }

    // ➕ INSERT SE NÃO EXISTIR
    await supabaseA
      .from("CONNECTIONS")
      .insert({
        status: "agency request",
        created_by_user_id: viewer.id,
        agency_id: membership.community_id,
        company_id: Number(id),
        short_message: data?.short_message ?? ""
      });
  }

  if (loading) return null;

  return (
    <PlasmicACompanyProfile
      args={{
        formData,
        company: formData,

        solutions: formData?.solutions ?? [],

        company_reviews: formData?.company_reviews ?? [],
        company_membersreviews: formData?.company_membersreviews ?? [],
        company_replies: formData?.company_replies ?? [],

        total_reviews: formData?.total_reviews ?? 0,
        average_rating: formData?.average_rating ?? 0,

        onSave: handleSave
      }}
    />
  );
}
