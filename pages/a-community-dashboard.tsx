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

  // USER
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
        console.log("❌ NOT CONNECTED");
        setLoading(false);
        return;
      }

      const communityId = member.community_id;
      console.log("🏢 COMMUNITY ID:", communityId);

      // =========================
      // 🔥 FETCH ALL REVIEWS
      // =========================
      const { data: allReviews, error } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);

      console.log("📦 ALL REVIEWS:", allReviews);
      console.log("❌ ERROR REVIEWS:", error);
      console.log("📊 TOTAL:", allReviews?.length);

      // TIPOS
      const types = {};
      (allReviews ?? []).forEach((r:any)=>{
        types[r.author_type] = (types[r.author_type] || 0) + 1;
      });
      console.log("📊 TYPES:", types);

      // =========================
      // 👤 PROFILE MAP
      // =========================
      const userIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>r.author_user_id)
      ));

      console.log("👤 USER IDS:", userIds);

      const { data: profiles } = await supabase
        .from("User profile")
        .select(`user_id, "Profile pic", "First name"`)
        .in("user_id", userIds);

      console.log("👤 PROFILES:", profiles);

      const profileMap:any = {};
      profiles?.forEach(p=>{
        profileMap[String(p.user_id)] = p;
      });

      console.log("🧠 PROFILE MAP:", profileMap);

      // =========================
      // 🏢 COMPANY MAP
      // =========================
      const companyIds = Array.from(new Set(
        (allReviews ?? [])
          .map((r:any)=>Number(r.company_id))
          .filter(Boolean)
      ));

      console.log("🏢 COMPANY IDS:", companyIds);

      const { data: companies } = await supabaseC
        .from("companies")
        .select("*")
        .in("id", companyIds);

      console.log("🏢 COMPANIES:", companies);

      const companyMap:any = {};
      companies?.forEach(c=>{
        companyMap[Number(c.id)] = c;
      });

      console.log("🧠 COMPANY MAP:", companyMap);

      // =========================
      // 🔵 COMPANY REVIEWS
      // =========================
      const community_reviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "company");

      console.log("🔵 COMPANY REVIEWS RAW:", community_reviews);

      const community_reviews_final = community_reviews.map((r:any)=>{
        const company = companyMap[Number(r.company_id)];
        const item = {
          id: r.id,
          "Company Logo": company?.["Company Logo"] ?? "",
          "Company name": company?.["Company name"] ?? "",
          comment: r.comment ?? "",
          rating: r.rating ?? 0
        };
        console.log("➡️ COMPANY REVIEW ITEM:", item);
        return item;
      });

      console.log("✅ COMPANY REVIEWS FINAL:", community_reviews_final);

      // =========================
      // 🟢 MEMBER REVIEWS
      // =========================
      const memberReviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "member");

      console.log("🟢 MEMBER REVIEWS RAW:", memberReviews);

      const community_membersreviews = memberReviews.map((r:any)=>{
        const profile = profileMap[String(r.author_user_id)];
        const item = {
          id: r.id,
          "Profile pic": profile?.["Profile pic"] ?? "",
          "First name": profile?.["First name"] ?? "",
          comment: r.comment ?? "",
          rating: r.rating ?? 0
        };
        console.log("➡️ MEMBER REVIEW ITEM:", item);
        return item;
      });

      console.log("✅ MEMBER REVIEWS FINAL:", community_membersreviews);

      // =========================
      // 🟡 COMMUNITY → COMPANY
      // =========================
      const companyRepliesRaw = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && r.company_id
        );

      console.log("🟡 COMPANY REPLIES RAW:", companyRepliesRaw);

      const community_replies = companyRepliesRaw.map((r:any)=>{
        const company = companyMap[Number(r.company_id)];
        const item = {
          id: r.id,
          "Company Logo": company?.["Company Logo"] ?? "",
          "Company name": company?.["Company name"] ?? "",
          comment: r.comment ?? ""
        };
        console.log("➡️ COMPANY REPLY ITEM:", item);
        return item;
      });

      console.log("✅ COMPANY REPLIES FINAL:", community_replies);

      // =========================
      // 🟣 COMMUNITY → MEMBER
      // =========================
      const memberRepliesRaw = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && !r.company_id
        );

      console.log("🟣 MEMBER REPLIES RAW:", memberRepliesRaw);

      const community_membersreplies = memberRepliesRaw.map((r:any)=>{
        const profile = profileMap[String(r.author_user_id)];
        const item = {
          id: r.id,
          "Profile pic": profile?.["Profile pic"] ?? "",
          "First name": profile?.["First name"] ?? "",
          comment: r.comment ?? ""
        };
        console.log("➡️ MEMBER REPLY ITEM:", item);
        return item;
      });

      console.log("✅ MEMBER REPLIES FINAL:", community_membersreplies);

      console.log("========== 🧨 END DEBUG ==========");

      setFormData({
        community_reviews: community_reviews_final,
        community_replies,
        community_membersreviews,
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
        formData,
        setFormData
      }}
    />
  );
}
