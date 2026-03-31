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

      if (!member || member.status !== "connected") {
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
      console.log("❌ ERROR REVIEWS:", error);

      // =========================
      // USER IDS
      // =========================
      const userIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>r.author_user_id)
      ));

      console.log("👤 USER IDS:", userIds);

      // =========================
      // PROFILES
      // =========================
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

      // 🚨 DETECTAR FALTANTES
      const missingProfiles = userIds.filter(id => !profileMap[String(id)]);
      console.log("🚨 MISSING PROFILES:", missingProfiles);

      // =========================
      // COMPANIES
      // =========================
      const companyIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>Number(r.company_id))
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
      // FILTERS
      // =========================
      const community_reviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "company")
        .map((r:any)=>{
          const company = companyMap[Number(r.company_id)];
          return {
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "/default-company.png",
            "Company name": company?.["Company name"] ?? "Empresa",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          };
        });

      const community_membersreviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "member")
        .map((r:any)=>{
          const profile = profileMap[String(r.author_user_id)];

          console.log("🔍 MEMBER REVIEW PROFILE:", r.author_user_id, profile);

          return {
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "/default-user.png",
            "First name": profile?.["First name"] ?? "Usuário",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          };
        });

      const community_replies = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "community" && r.company_id)
        .map((r:any)=>{
          const company = companyMap[Number(r.company_id)];
          return {
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "/default-company.png",
            "Company name": company?.["Company name"] ?? "Empresa",
            comment: r.comment ?? ""
          };
        });

      const community_membersreplies = (allReviews ?? [])
        .filter((r:any)=>["community ethics","community technical"].includes(r.author_type))
        .map((r:any)=>{
          const profile = profileMap[String(r.author_user_id)];

          console.log("🔍 MEMBER REPLY PROFILE:", r.author_user_id, profile);

          return {
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "/default-user.png",
            "First name": profile?.["First name"] ?? "Usuário",
            comment: r.comment ?? ""
          };
        });

      console.log("📊 FINAL COUNTS:");
      console.log("community_reviews:", community_reviews.length);
      console.log("community_membersreviews:", community_membersreviews.length);
      console.log("community_replies:", community_replies.length);
      console.log("community_membersreplies:", community_membersreplies.length);

      const finalData = {
        community_reviews,
        community_replies,
        community_membersreviews,
        community_membersreplies
      };

      console.log("📦 FORM DATA FINAL:", finalData);

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  async function handleSave(payload:any){

    const { rating, comment } = payload;

    if (!rating || !user) return;

    const { data: member } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", user.id)
      .maybeSingle();

    await supabase.from("community_reviews").insert({
      rating: Number(rating),
      comment: comment ?? "",
      community_id: member?.community_id,
      author_user_id: user.id,
      author_type: "member"
    });

    location.reload();
  }

  if (loading) return null;

  console.log("🚨 PROPS SEND TO PLASMIC:", formData);

  return (
    <PlasmicACommunityDashboard
      args={{
        formData,
        setFormData,
        onSave: handleSave
      }}
    />
  );
}
