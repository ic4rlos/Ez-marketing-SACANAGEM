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
      console.log("👤 USER:", data?.user);
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
      console.log("=================================");
      console.log("🚀 LOAD ALL START");

      setLoading(true);

      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🏢 COMPANY:", companyData);

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

      console.log("🔗 CONNECTIONS:", connections);

      let connectedAgencies: any[] = [];
      let agencyRequests: any[] = [];

      if (connections?.length) {
        const agencyIds = connections.map((c: any) =>
          Number(c.agency_id)
        );

        console.log("🧠 AGENCY IDS:", agencyIds);

        const { data: communities } = await supabaseA
          .from("Community")
          .select("*")
          .in("id", agencyIds);

        console.log("🏘️ COMMUNITIES:", communities);

        const { data: members } = await supabaseA
          .from("community_members")
          .select("community_id")
          .eq("status", "connected")
          .in("community_id", agencyIds);

        console.log("👥 MEMBERS RAW:", members);

        const memberCountMap: any = {};
        members?.forEach((m: any) => {
          const key = Number(m.community_id);
          memberCountMap[key] = (memberCountMap[key] || 0) + 1;
        });

        console.log("📊 MEMBER MAP:", memberCountMap);

        const { data: specialties } = await supabaseA
          .from("Community specialties")
          .select("*");

        console.log("🎯 SPECIALTIES RAW:", specialties);

        const specialtiesMap: any = {};
        specialties?.forEach((s: any) => {
          const key = Number(s.community_id);
          if (!specialtiesMap[key]) specialtiesMap[key] = [];
          specialtiesMap[key].push(
            s["Professional specialty"]
          );
        });

        console.log("🧩 SPECIALTIES MAP:", specialtiesMap);

        const format = (list: any[]) =>
          list.map((conn: any) => {
            const community = communities?.find(
              (c: any) =>
                Number(c.id) === Number(conn.agency_id)
            );

            return {
              id: conn.id,
              agency_id: conn.agency_id,
              community_name: community?.["community_name"] ?? "",
              community_logo: community?.["community_logo"] ?? "",
              short_message: conn.short_message ?? "",
              members:
                memberCountMap[Number(conn.agency_id)] ?? 0,
              specialties:
                specialtiesMap[Number(conn.agency_id)] ?? [],
            };
          });

        connectedAgencies = format(
          connections.filter((c) => c.status === "connected")
        );

        agencyRequests = format(
          connections.filter((c) => c.status === "agency request")
        );
      }

      // =========================
      // REVIEWS
      // =========================

      const { data: reviewsRaw, error } = await supabaseA
        .from("community_reviews")
        .select("*")
        .eq("company_id", Number(companyData.id));

      console.log("🧾 REVIEWS RAW:", reviewsRaw);
      console.log("❌ REVIEWS ERROR:", error);

      const communityIds = Array.from(
        new Set(
          (reviewsRaw ?? [])
            .map((r: any) => Number(r.community_id))
            .filter(Boolean)
        )
      );

      console.log("🧠 COMMUNITY IDS:", communityIds);

      const { data: communitiesReviews } = await supabaseA
        .from("Community")
        .select('id, "community_logo", "community_name"')
        .in("id", communityIds);

      console.log("🏘️ COMMUNITIES REVIEWS:", communitiesReviews);

      const communityMap: any = {};
      communitiesReviews?.forEach((c: any) => {
        communityMap[Number(c.id)] = c;
      });

      const enrich = (r: any) => {
        const community = communityMap[Number(r.community_id)];

        return {
          ...r,
          community_logo: community?.["community_logo"] ?? "",
          community_name: community?.["community_name"] ?? "",
        };
      };

      const company_reviews = (reviewsRaw ?? [])
        .filter(
          (r) =>
            r.author_type?.toLowerCase().trim() === "community"
        )
        .map(enrich);

      const company_replies = (reviewsRaw ?? [])
        .filter(
          (r) =>
            r.author_type?.toLowerCase().trim() === "company"
        )
        .map(enrich);

      console.log("⭐ COMPANY REVIEWS:", company_reviews);
      console.log("💬 COMPANY REPLIES:", company_replies);

      const totalReviews = company_reviews.length;

      const averageRating =
        totalReviews > 0
          ? company_reviews.reduce(
              (acc: number, r: any) =>
                acc + Number(r.rating || 0),
              0
            ) / totalReviews
          : 0;

      console.log("📊 TOTAL:", totalReviews);
      console.log("📊 AVG:", averageRating);

      const enrichedCompany = {
        ...companyData,
        connected_agencies: connectedAgencies,
        agency_requests: agencyRequests,
        company_reviews,
        company_replies,
        total_reviews: totalReviews,
        average_rating: averageRating,
      };

      console.log("🏁 FINAL COMPANY:", enrichedCompany);

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
        .eq("Company_id", companyData.id);

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
    } catch (err) {
      console.error("💥 LOAD ERROR:", err);
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
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
