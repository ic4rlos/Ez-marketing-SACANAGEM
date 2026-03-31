// 🔥 DEBUG VERSION - MAX LOGS (REVIEWS / REPLIES FOCUSED)

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

      console.log("========== 🚀 LOAD COMMUNITY ==========");

      const { data: member } = await supabase
        .from("community_members")
        .select("community_id, role, status")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("👤 MEMBER:", member);

      if (!member?.community_id) {
        setLoading(false);
        return;
      }

      const communityId = member.community_id;

      // =========================
      // 🔥 REVIEWS
      // =========================
      const { data: allReviews, error } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);

      console.log("📦 ALL REVIEWS:", allReviews);
      console.log("❌ ERROR:", error);

      if (!allReviews?.length) {
        console.log("⚠️ NO REVIEWS FOUND");
      }

      // =========================
      // 🔥 AUTHOR IDS
      // =========================
      const userIds = Array.from(new Set(
        allReviews.map((r:any)=>r.author_user_id).filter(Boolean)
      ));

      console.log("👤 AUTHOR USER IDS:", userIds);

      // =========================
      // 🔥 PROFILES FETCH
      // =========================
      const { data: profiles } = await supabase
        .from("User profile")
        .select(`user_id, "Profile pic", "First name"`)
        .in("user_id", userIds);

      console.log("👤 PROFILES RAW:", profiles);

      const profileMap:any = {};
      profiles?.forEach(p=>{
        profileMap[String(p.user_id)] = p;
      });

      console.log("🧠 PROFILE MAP:", profileMap);

      // =========================
      // 🔥 DETECT MISSING PROFILES
      // =========================
      const missingProfiles = userIds.filter(
        id => !profileMap[String(id)]
      );

      console.log("🚨 MISSING PROFILES:", missingProfiles);

      // =========================
      // 🔥 COMPANY MAP
      // =========================
      const companyIds = Array.from(new Set(
        allReviews.map((r:any)=>Number(r.company_id)).filter(Boolean)
      ));

      console.log("🏢 COMPANY IDS:", companyIds);

      const { data: companies } = await supabaseC
        .from("companies")
        .select("*")
        .in("id", companyIds);

      const companyMap:any = {};
      companies?.forEach(c=>{
        companyMap[Number(c.id)] = c;
      });

      console.log("🧠 COMPANY MAP:", companyMap);

      // =========================
      // 🔥 BUILD ARRAYS
      // =========================

      const community_reviews:any[] = [];
      const community_membersreviews:any[] = [];
      const community_replies:any[] = [];
      const community_membersreplies:any[] = [];

      allReviews.forEach((r:any)=>{

        console.log("➡️ REVIEW ITEM:", r);

        const profile = profileMap[String(r.author_user_id)];
        const company = companyMap[Number(r.company_id)];

        console.log("🔍 MATCH PROFILE:", r.author_user_id, profile);
        console.log("🔍 MATCH COMPANY:", r.company_id, company);

        // =========================
        // COMPANY REVIEW
        // =========================
        if (r.author_type === "company") {
          community_reviews.push({
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "",
            "Company name": company?.["Company name"] ?? "",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          });
        }

        // =========================
        // MEMBER REVIEW
        // =========================
        if (r.author_type === "member") {
          community_membersreviews.push({
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "❌ NO PIC",
            "First name": profile?.["First name"] ?? "❌ NO NAME",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          });
        }

        // =========================
        // COMMUNITY → COMPANY
        // =========================
        if (r.author_type === "community" && r.company_id) {
          community_replies.push({
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "",
            "Company name": company?.["Company name"] ?? "",
            comment: r.comment ?? ""
          });
        }

        // =========================
        // COMMUNITY → MEMBER
        // =========================
        if (
          ["community ethics", "community technical"].includes(r.author_type) &&
          !r.company_id
        ) {
          community_membersreplies.push({
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "❌ NO PIC",
            "First name": profile?.["First name"] ?? "❌ NO NAME",
            comment: r.comment ?? ""
          });
        }

      });

      console.log("📊 FINAL COUNTS:");
      console.log("community_reviews:", community_reviews.length);
      console.log("community_membersreviews:", community_membersreviews.length);
      console.log("community_replies:", community_replies.length);
      console.log("community_membersreplies:", community_membersreplies.length);

      const finalData = {
        community_reviews,
        community_membersreviews,
        community_replies,
        community_membersreplies,
        isAdmin: member.role === "admin"
      };

      console.log("📦 FINAL DATA:", finalData);

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  if (loading) return null;

  console.log("🚨 PROPS SEND TO PLASMIC:", formData);

  return (
    <PlasmicACommunityDashboard
      args={{
        formData,
        setFormData,
      }}
    />
  );
}
