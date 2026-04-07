import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCCompanyProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCCompanyProfile"
    ),
  { ssr: false }
);

export default function CCompanyProfile() {
  const router = useRouter();

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseC.auth.getUser();
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user === null && !loading) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // =========================
  // LOAD ALL
  // =========================

  async function loadAll() {
    if (!user) return;

    try {
      setLoading(true);

      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!companyData) {
        setCompany(null);
        setLoading(false);
        return;
      }

      // =========================
      // CONNECTIONS
      // =========================

      const { data: connections } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData.id);

      let connectedAgencies: any[] = [];
      let agencyRequests: any[] = [];

      if (connections?.length) {
        const connected = connections.filter(
          (c: any) => c.status === "connected"
        );

        const requests = connections.filter(
          (c: any) => c.status === "agency request"
        );

        const agencyIds = connections.map((c: any) =>
          Number(c.agency_id)
        );

        const { data: communities } = await supabaseA
          .from("Community")
          .select("*")
          .in("id", agencyIds);

        const { data: members } = await supabaseA
          .from("community_members")
          .select("community_id")
          .eq("status", "connected")
          .in("community_id", agencyIds);

        const memberCountMap: any = {};
        members?.forEach((m: any) => {
          const key = Number(m.community_id);
          memberCountMap[key] = (memberCountMap[key] || 0) + 1;
        });

        const { data: specialties } = await supabaseA
          .from("Community specialties")
          .select("*");

        const specialtiesMap: any = {};
        specialties?.forEach((s: any) => {
          const key = Number(s.community_id);
          if (!specialtiesMap[key]) specialtiesMap[key] = [];
          specialtiesMap[key].push(s["Professional specialty"]);
        });

        const format = (list: any[]) =>
          list.map((conn: any) => {
            const community = communities?.find(
              (c: any) =>
                Number(c.id) === Number(conn.agency_id)
            );

            return {
              id: conn.id,
              agency_id: Number(conn.agency_id) || 0, // ✅ FIX LINK
              short_message: conn.short_message ?? "",
              community_name: community?.community_name ?? "",
              community_logo: community?.community_logo ?? "",
              members:
                memberCountMap[Number(conn.agency_id)] ?? 0,
              specialties:
                specialtiesMap[Number(conn.agency_id)] ?? [],
            };
          });

        connectedAgencies = format(connected);
        agencyRequests = format(requests);
      }

      // =========================
      // REVIEWS
      // =========================

      const { data: allReviews } = await supabaseA
        .from("community_reviews")
        .select("*")
        .eq("company_id", companyData.id);

      const communityIds = Array.from(
        new Set(
          (allReviews ?? [])
            .map((r: any) => Number(r.community_id))
            .filter(Boolean)
        )
      );

      const { data: communitiesReviews } = await supabaseA
        .from("Community")
        .select("id, community_name, community_logo")
        .in("id", communityIds);

      const communityMap: any = {};
      communitiesReviews?.forEach((c: any) => {
        communityMap[Number(c.id)] = c;
      });

      // ✅ FIX RATING + COMMENT
      const enrich = (r: any) => {
        const community =
          communityMap[Number(r.community_id)];

        let rating = 0;

        if (typeof r.rating === "number") {
          rating = r.rating;
        } else if (typeof r.rating === "string") {
          rating = Number(r.rating);
        } else if (r.rating?.value) {
          rating = Number(r.rating.value);
        }

        return {
          agency_id: Number(r.community_id), // 🔥 ESSENCIAL PRO LINK
          community_name:
            community?.community_name ?? "",
          community_logo:
            community?.community_logo ?? "",
          comment: r.comment ?? "",
          rating: rating, // 🔥 já aproveita e normaliza
        };
      };

      const company_reviews = (allReviews ?? [])
        .filter((r: any) => r.author_type === "community")
        .map(enrich);

      const company_membersreviews = (allReviews ?? [])
        .filter((r: any) => r.author_type === "member")
        .map(enrich);

      const company_replies = (allReviews ?? [])
        .filter(
          (r: any) =>
            r.author_type?.startsWith("company") &&
            r.community_id
        )
        .map(enrich);

      const company_membersreplies = (allReviews ?? [])
        .filter(
          (r: any) =>
            r.author_type?.startsWith("company") &&
            !r.community_id
        )
        .map(enrich);

      const total_reviews = company_reviews.length;

      const average_rating =
        total_reviews > 0
          ? company_reviews.reduce(
              (acc: number, r: any) =>
                acc + (r.rating || 0),
              0
            ) / total_reviews
          : 0;

      // =========================
      // FINAL COMPANY
      // =========================

      const enrichedCompany = {
        ...companyData,
        connected_agencies: connectedAgencies,
        agency_requests: agencyRequests,

        company_reviews,
        company_membersreviews,
        company_replies,
        company_membersreplies,

        total_reviews,
        average_rating,
      };

      setCompany(enrichedCompany);

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
                  (a.Step_order ?? 0) -
                  (b.Step_order ?? 0)
              )
              .map((s: any) => ({
                id: s.id,
                step_text: s.step_text ?? "",
              })) ?? [],
        })) ?? [];

      setSolutions(structuredSolutions);
    } catch (err) {
      console.error("Load error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  // =========================
  // ACTIONS
  // =========================

  async function handleSave(payload: any) {
    const { action, connectionId } = payload;

    if (!connectionId) return;

    if (action === "accept") {
      await supabaseA
        .from("CONNECTIONS")
        .update({ status: "connected" })
        .eq("id", connectionId);
    }

    if (action === "reject" || action === "disconnect") {
      await supabaseA
        .from("CONNECTIONS")
        .delete()
        .eq("id", connectionId);
    }

    loadAll();
  }

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  // =========================
  // RENDER
  // =========================

  if (user === undefined) return null;
  if (loading) return null;

  return (
    <PlasmicCCompanyProfile
      args={{
        company: company ?? {},
        formData: solutions ?? [],
        solutions: solutions ?? [],

        company_reviews: company?.company_reviews ?? [],
        company_membersreviews:
          company?.company_membersreviews ?? [],
        company_replies: company?.company_replies ?? [],
        company_membersreplies:
          company?.company_membersreplies ?? [],

        average_rating: company?.average_rating ?? 0,
        total_reviews: company?.total_reviews ?? 0,

        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
