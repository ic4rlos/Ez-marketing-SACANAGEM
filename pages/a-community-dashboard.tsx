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
      // 🔥 CONNECTIONS (COMPANIES)
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

        const companyIds = Array.from(
          new Set(connections.map((c:any)=>Number(c.company_id)))
        );

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
              rate_avg: stats.count ? stats.sum / stats.count : 0,
              rate_count: stats.count
            };
          });

        connectedCompanies = format(connected);
        companyRequests = format(requests);
      }

      // =========================
      // 🔥 LINKED MEMBERS (NOVO)
      // =========================
      const { data: memberConnections } = await supabase
        .from("community_members")
        .select("id, user_id, status")
        .eq("community_id", communityId);

      let linkedMembers:any[] = [];
      let memberRequests:any[] = [];

      if (memberConnections?.length) {

        const connected = memberConnections.filter((m:any)=>m.status === "connected");
        const requests = memberConnections.filter((m:any)=>m.status === "pending");

        const userIds = memberConnections.map((m:any)=>m.user_id);

        const { data: profiles } = await supabase
          .from("User profile")
          .select('id, user_id, "Profile pic", "First name"')
          .in("user_id", userIds);

        const { data: offices } = await supabase
          .from("Multicharge")
          .select('"User profile_id", Office');

        const officeMap:any = {};

        offices?.forEach((o:any)=>{
          const key = o["User profile_id"];
          if (!officeMap[key]) officeMap[key] = [];
          officeMap[key].push(o.Office);
        });

        const format = (list:any[]) =>
          list.map((conn:any)=>{
            const profile = profiles?.find((p:any)=>p.user_id === conn.user_id);

            return {
              id: conn.id,
              user_id: conn.user_id,
              "Profile pic": profile?.["Profile pic"] ?? "",
              "First name": profile?.["First name"] ?? "",
              offices: profile ? officeMap[profile.id] ?? [] : []
            };
          });

        linkedMembers = format(connected);
        memberRequests = format(requests);
      }

      const finalData = {
        ...member,
        connected_companies: connectedCompanies,
        company_requests: companyRequests,
        linked_members: linkedMembers,
        member_requests: memberRequests,
        "Profile pic": myProfile?.["Profile pic"] ?? null,
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

    if (action === "disconnect_member"){
      await supabase
        .from("community_members")
        .delete()
        .eq("id", connectionId);
    }

    if (action === "accept_member"){
      await supabase
        .from("community_members")
        .update({ status: "connected" })
        .eq("id", connectionId);
    }

    if (action === "reject_member"){
      await supabase
        .from("community_members")
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
