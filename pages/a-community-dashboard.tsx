// imports
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

// =========================
// SPECIALIZATIONS
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
  const [formData, setFormData] = useState<any>({});
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
  // SAVE
  // =========================
  async function onSave(data:any){

    if (data?.action === "confirm_community_rate"){

      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      const year = now.getFullYear();
      const periodKey = `${year}-Q${quarter + 1}`;

      const rating = data?.rating?.value ?? data?.rating;
      const comment = data?.comment?.value ?? data?.comment ?? "";

      if (!rating) return;

      // bloqueio duplicado
      const { data: existing } = await supabase
        .from("community_reviews")
        .select("id")
        .eq("community_id", formData.id)
        .eq("author_user_id", user.id)
        .eq("author_type", "member")
        .eq("period_key", periodKey)
        .maybeSingle();

      if (existing){
        alert("Você já avaliou neste período");
        return;
      }

      // pega member_id correto
      const { data: profile } = await supabase
        .from("User profile")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error } = await supabase
        .from("community_reviews")
        .insert({
          community_id: formData.id,
          author_user_id: user.id,
          member_id: profile?.id,
          author_type: "member",
          rating: Number(rating),
          comment,
          period_key: periodKey
        });

      if (error){
        console.error(error);
        alert("Erro ao salvar avaliação");
        return;
      }

      router.reload();
    }
  }
 // 👇 COLE EXATAMENTE AQUI
  if (data?.action === "leave_community"){

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("user_id", user.id)
      .eq("community_id", formData.id);

    if (error){
      console.error(error);
      alert("Erro ao sair da comunidade");
      return;
    }

    const { data: remaining } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", formData.id);

    if (!remaining || remaining.length === 0){
      await supabase
        .from("Community")
        .delete()
        .eq("id", formData.id);
    }

    router.push("/a-find-community");
  }
}
  // =========================
  // LOAD
  // =========================
  useEffect(() => {

    if (!user){
      setLoading(false);
      return;
    }

    async function loadCommunity(){

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

if (!member || member.status !== "connected"){
  router.push("/a-find-community");
  return;
}

      const communityId = member.community_id;

      // COMMUNITY
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      const communityName =
        community?.["Community name"] ??
        community?.community_name ??
        community?.name ??
        null;

      // =========================
      // CONNECTIONS
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      let connectedCompanies:any[] = [];
      let companyRequests:any[] = [];

      if (connections?.length){

        const companyIds = Array.from(
          new Set(connections.map((c:any)=>Number(c.company_id)))
        );

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        const format = (list:any[]) =>
          list.map(conn=>{
            const company = companies?.find(c=>Number(c.id) === Number(conn.company_id));
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
      // MEMBERS + OFFICES
      // =========================
      const { data: membersRaw } = await supabase
        .from("community_members")
        .select("id, user_id, status, short_message")
        .eq("community_id", communityId);

      let connectedMembers:any[] = [];
      let memberRequests:any[] = [];
      let members:any[] = [];
      let trainings:any[] = [];
      let specialtiesList:string[] = [];

      const userIds = membersRaw?.map(m=>m.user_id) ?? [];

      const { data: profiles } = await supabase
        .from("User profile")
        .select('id, user_id, "Profile pic", "First name", "Last name", "Birthday"')
        .in("user_id", userIds);

      const profileMap:any = {};
      profiles?.forEach(p=>{
        profileMap[String(p.user_id)] = p;
      });

      const profileIds = profiles?.map(p=>p.id) ?? [];

      const { data: offices } = await supabase
        .from("Multicharge")
        .select('Office, "User profile_id"')
        .in("User profile_id", profileIds);

      const officesMap:any = {};
      offices?.forEach(o=>{
        const key = Number(o["User profile_id"]);
        if (!officesMap[key]) officesMap[key] = [];
        officesMap[key].push(o.Office);
      });

      const formatMembers = (list:any[]) =>
        list.map(m=>{
          const profile = profileMap[String(m.user_id)];
          return {
            id: m.id,
            user_id: m.user_id,
            status: m.status,
            short_message: m.short_message ?? "",
            "Profile pic": profile?.["Profile pic"] ?? "",
            "First name": profile?.["First name"] ?? "",
            "Last name": profile?.["Last name"] ?? "",
            Birthday: profile?.Birthday ?? "",
            offices: profile?.id ? officesMap[profile.id] ?? [] : []
          };
        });

      connectedMembers = formatMembers(membersRaw?.filter(m=>m.status==="connected") ?? []);
      memberRequests = formatMembers(membersRaw?.filter(m=>m.status!=="connected") ?? []);

      // =========================
      // MEMBERS FLAT (igual antes)
      // =========================
      const officesFlat:string[] = [];

      members = connectedMembers
        .map(m=>{
          const profile = profileMap[String(m.user_id)];
          if (!profile) return null;

          const offices = m.offices ?? [];

          offices.forEach(o=>officesFlat.push(o));

          return offices.map(o=>({
            "Profile pic": profile["Profile pic"],
            Office: o
          }));
        })
        .flat()
        .filter(Boolean);

      // =========================
      // SPECIALTIES
      // =========================
      const detected:string[] = [];

      for (const name in SPECIALIZATIONS){
        const roles = SPECIALIZATIONS[name];
        if (roles.every(r=>officesFlat.includes(r))){
          detected.push(name);
        }
      }

      await supabase.from("Community specialties")
        .delete()
        .eq("community_id", communityId);

      if (detected.length){
        await supabase.from("Community specialties").insert(
          detected.map(s=>({
            community_id: communityId,
            "Professional specialty": s
          }))
        );
      }

      specialtiesList = detected;

      // =========================
      // TRAININGS
      // =========================
      const today = new Date().toISOString().split("T")[0];

      trainings = (
        await Promise.all(
          connectedMembers.map(async (m:any)=>{
            const profile = profileMap[String(m.user_id)];
            if (!profile) return null;

            const { data: educationsRaw } = await supabase
              .from("Education")
              .select('University, "Graduation year"')
              .eq("User profile_id", profile.id);

            const valid =
              educationsRaw?.filter(ed=>ed["Graduation year"] > today) ?? [];

            if (!valid.length) return null;

            return valid.map(ed=>({
              "Profile pic": profile["Profile pic"],
              "First name": profile["First name"],
              University: ed.University,
              "Graduation year": ed["Graduation year"]
            }));
          })
        )
      ).flat().filter(Boolean);

      // =========================
      // REVIEWS
      // =========================
      const { data: allReviews } = await supabase
        .from("community_reviews")
        .select("*")
        .eq("community_id", communityId);
const { data: myRating } = await supabase
  .from("community_reviews")
  .select("rating")
  .eq("community_id", communityId)
  .eq("author_user_id", user.id)
  .eq("author_type", "member")
  .eq("period_key", `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth()/3)+1}`)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
      
      const companyIdsReviews = Array.from(
        new Set((allReviews ?? [])
          .map((r:any)=>Number(r.company_id))
          .filter(Boolean))
      );

      const { data: companiesReviews } = await supabaseC
        .from("companies")
        .select('id, "Company Logo", "Company name"')
        .in("id", companyIdsReviews);

      const companyMap:any = {};
      companiesReviews?.forEach(c=>{
        companyMap[Number(c.id)] = c;
      });

      const enrich = (r:any)=>{
        const company = companyMap[Number(r.company_id)];
        const profile = profiles?.find(p=>Number(p.id) === Number(r.member_id));

        return {
          ...r,
          "Company Logo": company?.["Company Logo"] ?? null,
          "Company name": company?.["Company name"] ?? null,
          community_name: communityName,
          "Profile pic": profile?.["Profile pic"] ?? null,
          "First name": profile?.["First name"] ?? null
        };
      };

      const community_reviews = (allReviews ?? []).filter(r=>r.author_type==="company").map(enrich);
      const community_membersreviews = (allReviews ?? []).filter(r=>r.author_type==="member").map(enrich);
      const community_replies = (allReviews ?? []).filter(r=>r.author_type?.startsWith("community") && r.company_id).map(enrich);
      const community_membersreplies = (allReviews ?? []).filter(r=>r.author_type?.startsWith("community") && !r.company_id).map(enrich);

      // =========================
      // FINAL
      // =========================
      setFormData({
        ...community,
        community_name: communityName,
        current_user_rating: myRating?.rating ?? 0,
        "Profile pic": myProfile?.["Profile pic"] ?? null,
        connected_companies: connectedCompanies,
        company_requests: companyRequests,
        connected_members: connectedMembers,
        member_requests: memberRequests,
        members,
        trainings,
        specialties: specialtiesList,
        community_reviews,
        community_membersreviews,
        community_replies,
        community_membersreplies,
        isAdmin: member.role === "admin"
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
        ...formData,
        onSave
      }}
    />
  );
}
