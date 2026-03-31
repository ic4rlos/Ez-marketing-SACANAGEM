import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const SPECIALIZATIONS:any = {
  "Service Scheduling and Management Capabilities":[
    "Account Manager","Client Services Director","Project Manager","Marketing Automation Specialist"
  ],
  "Influencer and Content Creator Presence":[
    "Social Media Manager","Content Strategist","Copywriter","Videographer","Public Relations Specialist","Influencer Talent Scout"
  ],
  "Commercial Production Capabilities":[
    "Creative Director","Art Director","Graphic Designer","Copywriter","Videographer"
  ],
  "Online Customer Service":[
    "Account Manager","Client Services Director"
  ],
  "Specialization in Vertical Sectors":[
    "Brand Strategist","Marketing Analyst","SEO Specialist","PPC Specialist","Business Development Manager","Marketing Coordinator"
  ],
  "Brand Development and Visual Identity Capabilities":[
    "Brand Strategist","Creative Director","Art Director","Graphic Designer","UX/UI Designer","Copywriter"
  ],
  "Event Production and Management Capabilities":[
    "Project Manager","Public Relations Specialist","Content Strategist","Digital Marketing Manager"
  ],
  "Performance Campaign Management Capabilities":[
    "Digital Marketing Manager","PPC Specialist","SEO Specialist","Marketing Analyst","Data Analyst","Marketing Automation Specialist"
  ],
  "Audiovisual Content Production":[
    "Videographer","Creative Director","Art Director","Copywriter","Graphic Designer"
  ],
  "Content Marketing and Blogging":[
    "Content Strategist","Copywriter","SEO Specialist","Social Media Manager","Graphic Designer","Marketing Coordinator"
  ],
  "Lead Generation and Sales Funnel Strategies":[
    "Digital Marketing Manager","Business Development Manager","PPC Specialist","Account Manager","Marketing Automation Specialist"
  ],
  "Creation of Digital Experiences (UX/UI)":[
    "UX/UI Designer","Creative Director","Project Manager","Content Strategist"
  ],
  "Social Media and Engagement Strategies":[
    "Social Media Manager","Content Strategist","Copywriter","Graphic Designer","Public Relations Specialist"
  ],
  "Public Relations and Image Crisis Management":[
    "Public Relations Specialist","Social Media Manager","Content Strategist","Brand Strategist"
  ],
  "E-commerce Management and Optimization":[
    "Digital Marketing Manager","SEO Specialist","PPC Specialist","UX/UI Designer","Data Analyst"
  ],
  "Data Analysis and Marketing Metrics":[
    "Data Analyst","Marketing Analyst","SEO Specialist","PPC Specialist"
  ],
  "Digital Product Marketing":[
    "Content Strategist","PPC Specialist","Social Media Manager","Videographer"
  ],
  "Direct Marketing and Email Marketing":[
    "Copywriter","Marketing Automation Specialist","Data Analyst"
  ],
  "Loyalty Strategies Clients":[
    "Account Manager","Marketing Automation Specialist","Content Strategist"
  ],
  "Specialization in Podcasts":[
    "Content Strategist","Copywriter","Social Media Manager","Public Relations Specialist","Project Manager"
  ]
};

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
    members: [],
    trainings: [],
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

      const { data: myProfile } = await supabase
        .from("User profile")
        .select('"Profile pic"')
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: member } = await supabase
        .from("community_members")
        .select("community_id, role, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member || member.status !== "connected") {
        setLoading(false);
        return;
      }

      const communityId = member.community_id;

      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      // =========================
      // REVIEWS + REPLIES (FIX FINAL)
      // =========================
      const { data: allReviews } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);

      const profileMap:any = {};

      const userIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>r.author_user_id)
      ));

      if (userIds.length){
        const { data: profiles } = await supabase
          .from("User profile")
          .select(`user_id, "Profile pic", "First name"`)
          .in("user_id", userIds);

        profiles?.forEach(p=>{
          profileMap[String(p.user_id)] = p;
        });
      }

      const companyIds = Array.from(new Set(
        (allReviews ?? []).map((r:any)=>Number(r.company_id)).filter(Boolean)
      ));

      const { data: companies } = await supabaseC
        .from("companies")
        .select("*")
        .in("id", companyIds);

      const companyMap:any = {};
      companies?.forEach(c=>{
        companyMap[Number(c.id)] = c;
      });

      // ✅ COMPANY REVIEWS
      const community_reviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "company")
        .map((r:any)=>{
          const company = companyMap[Number(r.company_id)];
          return {
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "",
            "Company name": company?.["Company name"] ?? "",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          };
        });

      // ✅ MEMBER REVIEWS
      const community_membersreviews = (allReviews ?? [])
        .filter((r:any)=>r.author_type === "member")
        .map((r:any)=>{
          const profile = profileMap[String(r.author_user_id)];
          return {
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "",
            "First name": profile?.["First name"] ?? "",
            comment: r.comment ?? "",
            rating: r.rating ?? 0
          };
        });

      // ✅ COMMUNITY → COMPANY
      const community_replies = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && r.company_id
        )
        .map((r:any)=>{
          const company = companyMap[Number(r.company_id)];
          return {
            id: r.id,
            "Company Logo": company?.["Company Logo"] ?? "",
            "Company name": company?.["Company name"] ?? "",
            comment: r.comment ?? ""
          };
        });

      // ✅ COMMUNITY → MEMBER
      const community_membersreplies = (allReviews ?? [])
        .filter((r:any)=>
          r.author_type?.startsWith("community") && !r.company_id
        )
        .map((r:any)=>{
          const profile = profileMap[String(r.author_user_id)];
          return {
            id: r.id,
            "Profile pic": profile?.["Profile pic"] ?? "",
            "First name": profile?.["First name"] ?? "",
            comment: r.comment ?? ""
          };
        });

      const finalData = {
        ...community,
        "Profile pic": myProfile?.["Profile pic"] ?? null,
        community_reviews,
        community_replies,
        community_membersreviews,
        community_membersreplies,
        isAdmin: member.role === "admin"
      };

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

    if (!member?.community_id) return;

    await supabase.from("community_reviews").insert({
      rating: Number(rating),
      comment: comment ?? "",
      community_id: member.community_id,
      author_user_id: user.id,
      author_type: "member"
    });

    location.reload();
  }

  if (loading) return null;

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
