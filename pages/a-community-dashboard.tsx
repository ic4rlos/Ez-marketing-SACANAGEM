import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACommunityDashboard = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACommunityDashboard"
    ).then((m) => m.PlasmicACommunityDashboard),
  { ssr: false }
);

export default function ACommunityDashboard() {
  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseA.auth.getUser();
      console.log("👤 USER:", data?.user);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD COMMUNITY DATA
  // =========================
  useEffect(() => {
    async function loadAll() {
      if (user === undefined) return;

      console.log("========== 🚀 LOAD COMMUNITY ==========");

      try {
        setLoading(true);

        // COMMUNITY
        const { data: member } = await supabaseA
          .from("community_members")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "connected")
          .maybeSingle();

        console.log("👤 MEMBER:", member);

        if (!member?.community_id) {
          setFormData({});
          setLoading(false);
          return;
        }

        const communityId = member.community_id;

        // REVIEWS
        const { data: reviews, error } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("community_id", communityId);

        console.log("📦 ALL REVIEWS:", reviews);
        console.log("❌ ERROR:", error);

        if (!reviews) {
          setFormData({});
          setLoading(false);
          return;
        }

        // =========================
        // USERS (SEM SET ❌)
        // =========================
        const userIds: any[] = [];

        reviews.forEach((r: any) => {
          if (r.author_user_id && !userIds.includes(r.author_user_id)) {
            userIds.push(r.author_user_id);
          }
        });

        console.log("👤 AUTHOR USER IDS:", userIds);

        const { data: profiles } = await supabaseA
          .from("User profile")
          .select("*")
          .in("user_id", userIds);

        console.log("👤 PROFILES RAW:", profiles);

        const profileMap: any = {};
        profiles?.forEach((p: any) => {
          profileMap[p.user_id] = p;
        });

        console.log("🧠 PROFILE MAP:", profileMap);

        // =========================
        // COMPANIES (SEM SET ❌)
        // =========================
        const companyIds: any[] = [];

        reviews.forEach((r: any) => {
          if (r.company_id && !companyIds.includes(r.company_id)) {
            companyIds.push(r.company_id);
          }
        });

        console.log("🏢 COMPANY IDS:", companyIds);

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        const companyMap: any = {};
        companies?.forEach((c: any) => {
          companyMap[c.id] = c;
        });

        console.log("🧠 COMPANY MAP:", companyMap);

        // =========================
        // BUILD DATA
        // =========================
        const community_reviews: any[] = [];
        const community_membersreviews: any[] = [];
        const community_replies: any[] = [];
        const community_membersreplies: any[] = [];

        reviews.forEach((r: any) => {
          const profile = profileMap[r.author_user_id];
          const company = companyMap[r.company_id];

          const base = {
            id: r.id,
            rating: r.rating,
            comment: r.comment,

            "First name": profile?.["First name"] ?? "Unknown",
            "Profile pic":
              profile?.["Profile pic"] ??
              "https://via.placeholder.com/40",

            "Company name": company?.["Company name"] ?? "",
            "Company Logo": company?.["Company Logo"] ?? "",
          };

          console.log("➡️ ITEM:", base);

          if (r.author_type === "community") {
            community_reviews.push(base);
          }

          if (r.author_type === "company") {
            community_replies.push(base);
          }

          if (
            r.author_type === "community ethics" ||
            r.author_type === "community technical"
          ) {
            community_membersreviews.push(base);
          }

          if (r.author_type === "member") {
            community_membersreplies.push(base);
          }
        });

        const finalData = {
          community_reviews,
          community_membersreviews,
          community_replies,
          community_membersreplies,
          isAdmin: member.role === "admin",
        };

        console.log("📊 FINAL COUNTS:");
        console.log("community_reviews:", community_reviews.length);
        console.log("community_membersreviews:", community_membersreviews.length);
        console.log("community_replies:", community_replies.length);
        console.log(
          "community_membersreplies:",
          community_membersreplies.length
        );

        console.log("📦 FINAL DATA:", finalData);

        setFormData(finalData);
      } catch (err) {
        console.error("🔥 LOAD ERROR:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // RENDER GUARD
  // =========================
  if (user === undefined) return null;
  if (loading) return null;

  const hasData =
    formData &&
    (
      formData.community_reviews?.length > 0 ||
      formData.community_replies?.length > 0 ||
      formData.community_membersreviews?.length > 0 ||
      formData.community_membersreplies?.length > 0
    );

  if (!hasData) {
    console.log("🚫 BLOQUEADO: sem dados ainda", formData);
    return null;
  }

  console.log("🔥 RENDER FINAL COM DADOS");

  return (
    <PlasmicACommunityDashboard
      key={JSON.stringify(formData)}
      args={{
        ...formData,
      }}
    />
  );
}
