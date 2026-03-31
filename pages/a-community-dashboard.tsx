import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACommunityDashboard = dynamic(
  () =>
    import("../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACommunityDashboard")
      .then((m) => m.PlasmicACommunityDashboard),
  { ssr: false }
);

export default function ACommunityDashboard() {

  const router = useRouter();
  const supabase = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    community_reviews: [],
    community_replies: [],
    community_membersreviews: [],
    community_membersreplies: []
  });
  const [loading, setLoading] = useState(true);

  // =========================
  // USER
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      console.log("👤 USER:", data?.user);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  useEffect(() => {

    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCommunity() {

      console.log("========== 🚀 LOAD COMMUNITY START ==========");

      const { data: member } = await supabase
        .from("community_members")
        .select("community_id, role, status")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("👤 MEMBER:", member);

      if (!member || member.status !== "connected") {
        console.warn("❌ USER NÃO ESTÁ CONNECTED");
        setLoading(false);
        return;
      }

      const communityId = member.community_id;
      console.log("🏢 COMMUNITY ID:", communityId);

      // =========================
      // 🔥 BUSCAR TODAS REVIEWS
      // =========================
      const { data: allReviews, error } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);

      console.log("📦 ALL REVIEWS:", allReviews);
      console.log("❌ ERROR REVIEWS:", error);
      console.log("📊 TOTAL:", allReviews?.length);

      if (!allReviews?.length) {
        console.warn("⚠️ SEM REVIEWS");
      }

      // =========================
      // 🔍 ANALISAR TYPES
      // =========================
      const typeCounter:any = {};
      (allReviews ?? []).forEach((r:any)=>{
        typeCounter[r.author_type] = (typeCounter[r.author_type] || 0) + 1;
      });

      console.log("📊 TYPES:", typeCounter);

      // =========================
      // 🔍 USER IDS
      // =========================
      const userIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>r.author_user_id)
      ));

      console.log("👤 USER IDS:", userIds);

      let profileMap:any = {};

      if (userIds.length){
        const { data: profiles } = await supabase
          .from("User profile")
          .select(`user_id, "Profile pic", "First name"`)
          .in("user_id", userIds);

        console.log("👤 PROFILES:", profiles);

        profiles?.forEach(p=>{
          profileMap[String(p.user_id)] = p;
        });
      }

      console.log("🧠 PROFILE MAP:", profileMap);

      // =========================
      // 🔍 COMPANY IDS
      // =========================
      const companyIds = Array.from(new Set(
        (allReviews ?? [])
          .map((r:any)=>Number(r.company_id))
          .filter(Boolean)
      ));

      console.log("🏢 COMPANY IDS:", companyIds);

      let companyMap:any = {};

      if (companyIds.length){
        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        console.log("🏢 COMPANIES:", companies);

        companies?.forEach(c=>{
          companyMap[Number(c.id)] = c;
        });
      }

      console.log("🧠 COMPANY MAP:", companyMap);

      // =========================
      // 🔵 COMPANY REVIEWS
      // =========================
      const companyReviewsRaw = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "company");

      console.log("🔵 COMPANY REVIEWS RAW:", companyReviewsRaw);

      const community_reviews = companyReviewsRaw.map((r:any)=>{
        console.log("➡️ COMPANY REVIEW ITEM:", r);

        const company = companyMap[Number(r.company_id)];

        return {
          id: r.id,
          "Company Logo": company?.["Company Logo"] ?? "",
          "Company name": company?.["Company name"] ?? "",
          comment: r.comment ?? "",
          rating: r.rating ?? 0
        };
      });

      console.log("✅ COMPANY REVIEWS FINAL:", community_reviews);

      // =========================
      // 🟢 MEMBER REVIEWS
      // =========================
      const memberReviewsRaw = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "member");

      console.log("🟢 MEMBER REVIEWS RAW:", memberReviewsRaw);

      const community_membersreviews = memberReviewsRaw.map((r:any)=>{
        console.log("➡️ MEMBER REVIEW ITEM:", r);

        const profile = profileMap[String(r.author_user_id)];

        return {
          id: r.id,
          "Profile pic": profile?.["Profile pic"] ?? "",
          "First name": profile?.["First name"] ?? "",
          comment: r.comment ?? "",
          rating: r.rating ?? 0
        };
      });

      console.log("✅ MEMBER REVIEWS FINAL:", community_membersreviews);

      // =========================
      // 🟡 COMPANY REPLIES
      // =========================
      const companyRepliesRaw = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "community" && r.company_id);

      console.log("🟡 COMPANY REPLIES RAW:", companyRepliesRaw);

      const community_replies = companyRepliesRaw.map((r:any)=>{
        console.log("➡️ COMPANY REPLY ITEM:", r);

        const company = companyMap[Number(r.company_id)];

        return {
          id: r.id,
          "Company Logo": company?.["Company Logo"] ?? "",
          "Company name": company?.["Company name"] ?? "",
          comment: r.comment ?? ""
        };
      });

      console.log("✅ COMPANY REPLIES FINAL:", community_replies);

      // =========================
      // 🟣 MEMBER REPLIES
      // =========================
      const memberRepliesRaw = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "community" && !r.company_id);

      console.log("🟣 MEMBER REPLIES RAW:", memberRepliesRaw);

      const community_membersreplies = memberRepliesRaw.map((r:any)=>{
        console.log("➡️ MEMBER REPLY ITEM:", r);

        const profile = profileMap[String(r.author_user_id)];

        return {
          id: r.id,
          "Profile pic": profile?.["Profile pic"] ?? "",
          "First name": profile?.["First name"] ?? "",
          comment: r.comment ?? ""
        };
      });

      console.log("✅ MEMBER REPLIES FINAL:", community_membersreplies);

      console.log("========== 🧨 END DEBUG ==========");

      setFormData({
        community_reviews,
        community_membersreviews,
        community_replies,
        community_membersreplies
      });

      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  if (loading) return null;

  return (
    <PlasmicACommunityDashboard
      args={{
        formData
      }}
    />
  );
}
