import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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

      if (!member || member.status !== "connected") {
        console.log("❌ NOT CONNECTED");
        setLoading(false);
        return;
      }

      const communityId = member.community_id;

      // =========================
      // FETCH REVIEWS
      // =========================
      const { data: allReviews } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);

      console.log("📦 ALL REVIEWS:", allReviews);

      // =========================
      // PROFILE MAP
      // =========================
      const profileMap:any = {};

      const userIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>r.author_user_id)
      ));

      const { data: profiles } = await supabase
        .from("User profile")
        .select(`user_id, "Profile pic", "First name"`)
        .in("user_id", userIds);

      profiles?.forEach(p=>{
        profileMap[String(p.user_id)] = p;
      });

      console.log("🧠 PROFILE MAP:", profileMap);

      // =========================
      // COMPANY MAP
      // =========================
      const companyIds = Array.from(new Set(
        (allReviews ?? [])
          .map((r:any)=>Number(r.company_id))
          .filter(Boolean)
      ));

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
      // BUILD ARRAYS
      // =========================
      const community_reviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "company");

      const community_membersreviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "member");

      const community_replies = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && r.company_id
        );

      const community_membersreplies = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && !r.company_id
        );

      console.log("📊 FINAL COUNTS:");
      console.log("community_reviews:", community_reviews.length);
      console.log("community_membersreviews:", community_membersreviews.length);
      console.log("community_replies:", community_replies.length);
      console.log("community_membersreplies:", community_membersreplies.length);

      // =========================
      // SET FORM DATA
      // =========================
      const finalData = {
        community_reviews,
        community_membersreviews,
        community_replies,
        community_membersreplies
      };

      console.log("📦 FORM DATA FINAL:", finalData);

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  if (loading) return null;

  // =========================
  // 🔥 LOG CRÍTICO (ANTES DO RENDER)
  // =========================
  console.log("🚨 PROPS SEND TO PLASMIC:");
  console.log("formData:", formData);
  console.log("SPREAD:", { ...formData });

  return (
    <PlasmicACommunityDashboard
      args={{
        formData,
        ...formData // 🔥 TESTE CRÍTICO
      }}
    />
  );
}
