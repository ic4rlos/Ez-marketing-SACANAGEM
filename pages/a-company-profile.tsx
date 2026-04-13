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
  const [solutions, setSolutions] = useState<any[]>([]);
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
  // LOAD CORE (SEM SOLUTIONS)
  // =========================

  useEffect(() => {
    if (!id) return;

    async function loadCore() {
      try {
        const companyId = Number(id);

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

        // PROFILE PIC
        let logged_profile_pic = null;

        if (viewer?.id) {
          const { data: profile } = await supabaseA
            .from("User profile")
            .select('"Profile pic"')
            .eq("user_id", viewer.id)
            .maybeSingle();

          logged_profile_pic = profile?.["Profile pic"] ?? null;
        }

        // CONNECTION
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

        // REVIEWS
        const { data: reviews } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", company.id);

        const communityIds = Array.from(
          new Set(
            (reviews ?? [])
              .map((r: any) => Number(r.community_id))
              .filter(Boolean)
          )
        );

        let communityMap: any = {};

        if (communityIds.length) {
          const { data: communities } = await supabaseA
            .from("Community")
            .select("id, community_name, community_logo")
            .in("id", communityIds);

          communities?.forEach((c: any) => {
            communityMap[Number(c.id)] = c;
          });
        }

        const normalize = (r: any) => {
          const community = communityMap[Number(r.community_id)];

          return {
            agency_id: Number(r.community_id),
            rating: Number(r?.rating ?? 0),
            comment: r?.comment ?? "",
            community_name: community?.community_name ?? "",
            community_logo: community?.community_logo ?? ""
          };
        };

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

        setFormData({
          ...company,

          "Company nature":
            company?.["Company nature"] ?? "Standard",

          company_reviews,
          company_membersreviews,
          company_replies,

          total_reviews,
          average_rating,

          connection,
          isConnected,

          logged_profile_pic
        });

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadCore();
  }, [id, viewer]);

  // =========================
  // LOAD SOLUTIONS (SEPARADO 🔥)
  // =========================

  useEffect(() => {
    if (!id) return;

    async function loadSolutions() {
      const companyId = Number(id);

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
                  (a.Step_order ?? 0) -
                  (b.Step_order ?? 0)
              )
              .map((s: any) => ({
                id: s.id,
                step_text: s.step_text ?? ""
              })) ?? [],
        })) ?? [];

      setSolutions(structuredSolutions);
    }

    loadSolutions();
  }, [id]);

  // =========================
  // SAVE
  // =========================

  async function handleSave(data: any) {
    if (!viewer || !id) return;

    const { data: membership } = await supabaseA
      .from("community_members")
      .select("community_id")
      .eq("user_id", viewer.id)
      .maybeSingle();

    if (!membership) return;

    const { data: existingConnection } = await supabaseA
      .from("CONNECTIONS")
      .select("id")
      .eq("agency_id", membership.community_id)
      .eq("company_id", Number(id))
      .maybeSingle();

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

        // 🔥 AGORA FUNCIONA IGUAL AO C
        solutions: solutions ?? [],

        company_reviews: formData?.company_reviews ?? [],
        company_membersreviews:
          formData?.company_membersreviews ?? [],
        company_replies: formData?.company_replies ?? [],

        total_reviews: formData?.total_reviews ?? 0,
        average_rating: formData?.average_rating ?? 0,

        onSave: handleSave
      }}
    />
  );
}
