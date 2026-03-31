import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

// =========================
// SPECIALIZATIONS (ATIVO)
// =========================
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

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // MAIN LOAD
  // =========================
  useEffect(() => {

    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCommunity() {

      // PROFILE
      const { data: myProfile } = await supabase
        .from("User profile")
        .select('"Profile pic"')
        .eq("user_id", user.id)
        .maybeSingle();

      // MEMBER
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

      // =========================
      // CONNECTIONS
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      let connectedCompanies:any[] = [];
      let companyRequests:any[] = [];

      if (connections?.length) {

        const companyIds = Array.from(
          new Set(connections.map((c:any) => Number(c.company_id)))
        );

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        const format = (list:any[]) =>
          list.map(conn=>{
            const company = companies?.find(c => Number(c.id) === Number(conn.company_id));
            return {
              id: conn.id,
              company_id: conn.company_id,
              short_message: conn.short_message ?? "",
              "Company Logo": company?.["Company Logo"] ?? "",
              "Company name": company?.["Company name"] ?? "",
              "Company type": company?.["Company type"] ?? ""
            };
          });

        connectedCompanies = format(connections.filter(c=>c.status==="connected"));
        companyRequests = format(connections.filter(c=>c.status==="company request"));
      }

      // =========================
      // MEMBERS + OFFICES + TRAININGS + SPECIALTIES
      // =========================
      const { data: membersRaw } = await supabase
        .from("community_members")
        .select("id, user_id, status, short_message")
        .eq("community_id", communityId);

      let profileMap:any = {};
      let officesMap:any = {};
      let members:any[] = [];
      let trainings:any[] = [];
      let specialtiesList:string[] = [];

      if (membersRaw?.length) {

        const userIds = membersRaw.map(m => m.user_id);

        const { data: memberProfiles } = await supabase
          .from("User profile")
          .select(`id, user_id, "Profile pic", "First name"`)
          .in("user_id", userIds);

        memberProfiles?.forEach(p=>{
          profileMap[String(p.user_id)] = p;
        });

        const profileIds = memberProfiles?.map(p=>p.id) ?? [];

        const { data: offices } = await supabase
          .from("Multicharge")
          .select('Office, "User profile_id"')
          .in("User profile_id", profileIds);

        offices?.forEach(o=>{
          const key = Number(o["User profile_id"]);
          if (!officesMap[key]) officesMap[key] = [];
          officesMap[key].push(o.Office);
        });

        const officesFlat:string[] = [];

        members = memberProfiles?.map(p=>{
          const offices = officesMap[Number(p.id)] ?? [];
          offices.forEach(o=>officesFlat.push(o));
          return offices.map(o=>({
            "Profile pic": p["Profile pic"],
            Office: o
          }));
        }).flat().filter(Boolean);

        // SPECIALTIES
        const detected:string[] = [];

        for (const name in SPECIALIZATIONS){
          const roles = SPECIALIZATIONS[name];
          if (roles.every(r => officesFlat.includes(r))){
            detected.push(name);
          }
        }

        await supabase.from("Community specialties")
          .delete()
          .eq("community_id", communityId);

        if (detected.length){
          await supabase.from("Community specialties").insert(
            detected.map(s => ({
              community_id: communityId,
              "Professional specialty": s
            }))
          );
        }

        specialtiesList = detected;

        // TRAININGS
        const today = new Date().toISOString().split("T")[0];

        trainings = (
          await Promise.all(
            memberProfiles.map(async (p:any)=>{
              const { data: edu } = await supabase
                .from("Education")
                .select('University, "Graduation year"')
                .eq("User profile_id", p.id);

              const valid = edu?.filter(e=>e["Graduation year"] > today) ?? [];

              return valid.map(e=>({
                "Profile pic": p["Profile pic"],
                "First name": p["First name"],
                University: e.University,
                "Graduation year": e["Graduation year"]
              }));
            })
          )
        ).flat().filter(Boolean);
      }

      // =========================
// REVIEWS + REPLIES (FIXED)
// =========================
const { data: reviewsRaw } = await supabase
  .from("community_reviews")
  .select("*")
  .eq("community_id", communityId);

const { data: repliesRaw } = await supabase
  .from("community_replies")
  .select("*")
  .eq("community_id", communityId);

const safeReviews = reviewsRaw ?? [];
const safeReplies = repliesRaw ?? [];

// =========================
// 🔵 COMPANIES MAP
// =========================
const companyIds = Array.from(new Set([
  ...safeReviews.map((r:any)=>Number(r.company_id)).filter(Boolean),
  ...safeReplies.map((r:any)=>Number(r.company_id)).filter(Boolean)
]));

const { data: companies } = await supabaseC
  .from("companies")
  .select("*")
  .in("id", companyIds);

const companyMap:any = {};
companies?.forEach(c=>{
  companyMap[Number(c.id)] = c;
});

// =========================
// 🟣 USERS MAP (CRÍTICO)
// =========================
const userIds = Array.from(new Set([
  ...safeReviews.map((r:any)=>r.author_user_id),
  ...safeReplies.map((r:any)=>r.author_user_id)
].filter(Boolean)));

let usersMap:any = {};

if (userIds.length){
  const { data: users } = await supabase
    .from("User profile")
    .select(`user_id, "Profile pic", "First name"`)
    .in("user_id", userIds);

  users?.forEach(u=>{
    usersMap[String(u.user_id)] = u;
  });
}

// =========================
// 🟢 COMMUNITY REVIEWS (EMPRESAS)
// =========================
const community_reviews = safeReviews
  .filter(r => r.author_type === "company")
  .map(r => {
    const c = companyMap[Number(r.company_id)];
    return {
      id: r.id,
      "Company Logo": c?.["Company Logo"] ?? "",
      "Company name": c?.["Company name"] ?? "",
      community_name: c?.["Company name"] ?? "Company",
      comment: r.comment ?? "",
      rating: r.rating ?? 0
    };
  });

// =========================
// 🟢 COMMUNITY MEMBERS REVIEWS (MEMBROS)
// =========================
const community_membersreviews = safeReviews
  .filter(r => r.author_type === "member")
  .map(r => {
    const u = usersMap[String(r.author_user_id)];
    return {
      id: r.id,
      "Profile pic": u?.["Profile pic"] ?? "",
      "First name": u?.["First name"] ?? "",
      community_name: u?.["First name"] ?? "Member",
      comment: r.comment ?? "",
      rating: r.rating ?? 0
    };
  });

// =========================
// 🔴 COMMUNITY REPLIES (COMUNIDADE → EMPRESA)
// =========================
const community_replies = safeReplies
  .filter(r => r.author_type === "community" && r.company_id)
  .map(r => {
    const c = companyMap[Number(r.company_id)];
    return {
      id: r.id,
      "Company Logo": c?.["Company Logo"] ?? "",
      "Company name": c?.["Company name"] ?? "",
      community_name: "Community",
      comment: r.comment ?? "",
      rating: r.rating ?? 0
    };
  });

// =========================
// 🔴 COMMUNITY MEMBERS REPLIES (COMUNIDADE → MEMBRO)
// =========================
const community_membersreplies = safeReplies
  .filter(r => r.author_type === "community" && r.member_id)
  .map(r => {
    const u = usersMap[String(r.member_id)];
    return {
      id: r.id,
      "Profile pic": u?.["Profile pic"] ?? "",
      "First name": u?.["First name"] ?? "",
      community_name: "Community",
      comment: r.comment ?? "",
      rating: r.rating ?? 0
    };
  });
  // =========================
  // ADMIN ACTIONS + SAVE
  // =========================
  async function handleSave(payload:any){

    const { action, connectionId, rating, comment } = payload;

    if (action === "accept_company"){
      await supabase.from("CONNECTIONS")
        .update({ status: "connected" })
        .eq("id", connectionId);
    }

    if (action === "reject_company"){
      await supabase.from("CONNECTIONS")
        .delete()
        .eq("id", connectionId);
    }

    if (rating){
      const { data: member } = await supabase
        .from("community_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      await supabase.from("community_reviews").insert({
        rating: Number(rating),
        comment: comment ?? "",
        community_id: member?.community_id,
        author_user_id: user.id,
        author_type: "member"
      });
    }

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
