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
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACommunityDashboard"
    ).then((m) => m.PlasmicACommunityDashboard),
  { ssr: false }
);

export default function ACommunityDashboard() {

  const router = useRouter();
  const supabase = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    members: [],
    trainings: []
  });

  const [loading, setLoading] = useState(true);

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
        .select("community_id, role")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .maybeSingle();

      if (!member) {
        setLoading(false);
        return;
      }

      const communityId = member.community_id;

      // =========================
      // 🔥 CONNECTIONS (NOVO BLOCO)
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      let connectedCompanies:any[] = [];
      let companyRequests:any[] = [];

      if (connections?.length) {

        const connected = connections.filter((c:any)=>c.status === "connected");
        const requests = connections.filter((c:any)=>c.status === "company request");

        const companyIds = [...new Set(connections.map((c:any)=>Number(c.company_id)))];

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        const { data: reviews } = await supabaseC
          .from("company_reviews")
          .select("company_id, rating")
          .eq("author_type", "community")
          .in("company_id", companyIds);

        const reviewMap:any = {};

        reviews?.forEach((r:any)=>{
          const key = Number(r.company_id);
          if (!reviewMap[key]) reviewMap[key] = { sum: 0, count: 0 };
          reviewMap[key].sum += Number(r.rating || 0);
          reviewMap[key].count += 1;
        });

        const format = (list:any[]) =>
          list.map((conn:any)=>{
            const company = companies?.find((c:any)=>Number(c.id) === Number(conn.company_id));
            const stats = reviewMap[Number(conn.company_id)] || { sum: 0, count: 0 };

            return {
              id: conn.id,
              company_id: conn.company_id,
              short_message: conn.short_message ?? "",
              "Company Logo": company?.["Company Logo"] ?? "",
              "Company name": company?.["Company name"] ?? "",
              "Company type": company?.["Company type"] ?? "",
              Area: company?.Area ?? "",
              "Sub area": company?.["Sub area"] ?? "",
              Location: company?.Location ?? "",
              rate_avg: stats.count ? stats.sum / stats.count : 0,
              rate_count: stats.count
            };
          });

        connectedCompanies = format(connected);
        companyRequests = format(requests);
      }

      // =========================
      // 🔹 COMMUNITY
      // =========================
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      const { data: membersDb } = await supabase
        .from("community_members")
        .select("user_id")
        .eq("community_id", communityId)
        .eq("status", "connected");

      let members:any[] = [];

      if (membersDb?.length) {
        members = (
          await Promise.all(
            membersDb.map(async (m:any)=>{
              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              if (!profile) return null;

              const { data: offices } = await supabase
                .from("Multicharge")
                .select("Office")
                .eq("User profile_id", profile.id);

              if (!offices) return null;

              return offices.map((o:any)=>({
                "Profile pic": profile["Profile pic"],
                Office: o.Office
              }));
            })
          )
        ).flat().filter(Boolean);
      }

      const offices = members.map(m=>m.Office);

      const detected:string[] = [];

      for (const name in SPECIALIZATIONS){
        const roles = SPECIALIZATIONS[name];
        if (roles.every((r:string)=>offices.includes(r))){
          detected.push(name);
        }
      }

      await supabase.from("Community specialties").delete().eq("community_id", communityId);

      for (const s of detected){
        await supabase.from("Community specialties").insert({
          community_id: communityId,
          "Professional specialty": s
        });
      }

      const { data: specialties } = await supabase
        .from("Community specialties")
        .select('"Professional specialty"')
        .eq("community_id", communityId);

      const specialtiesList =
        specialties?.map((s:any)=>s["Professional specialty"]) ?? [];

      const today = new Date().toISOString().split("T")[0];

      let trainings:any[] = [];

      if (membersDb?.length) {
        trainings = (
          await Promise.all(
            membersDb.map(async (m:any)=>{
              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", "First name", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              if (!profile) return null;

              const { data: educationsRaw } = await supabase
                .from("Education")
                .select('University, "Graduation year", "User profile_id"')
                .eq("User profile_id", profile.id);

              const educations =
                educationsRaw?.filter((ed:any)=>ed["Graduation year"] > today) ?? [];

              if (!educations.length) return null;

              return educations.map((ed:any)=>({
                "Profile pic": profile["Profile pic"],
                "First name": profile["First name"],
                University: ed.University,
                "Graduation year": ed["Graduation year"]
              }));
            })
          )
        ).flat().filter(Boolean);
      }

      const finalData = {
        ...community,
        members,
        trainings,
        specialties: specialtiesList,
        "Profile pic": myProfile?.["Profile pic"] ?? null,
        connected_companies: connectedCompanies,
        company_requests: companyRequests,
        isAdmin: member.role === "admin"
      };

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  async function handleSave(payload:any){

    const { action, connectionId, reason } = payload;

    if (!connectionId) return;

    if (action === "disconnect"){
      await supabase.from("CONNECTIONS")
        .update({
          status: "agency disconnected",
          short_message: reason
        })
        .eq("id", connectionId);
    }

    if (action === "accept"){
      await supabase.from("CONNECTIONS")
        .update({ status: "connected" })
        .eq("id", connectionId);
    }

    if (action === "reject"){
      await supabase.from("CONNECTIONS")
        .delete()
        .eq("id", connectionId);
    }

    location.reload();
  }

  if (loading) return null;

  return (
    <PlasmicACommunityDashboard
      args={{
        formData: formData,
        setFormData: setFormData,
        onSave: handleSave
      }}
    />
  );
}
