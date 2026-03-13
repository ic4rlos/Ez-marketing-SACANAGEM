import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const SPECIALIZATIONS:any = {

"Service Scheduling and Management Capabilities":[
"Account Manager",
"Client Services Director",
"Project Manager",
"Marketing Automation Specialist"
],

"Influencer and Content Creator Presence":[
"Social Media Manager",
"Content Strategist",
"Copywriter",
"Videographer",
"Public Relations Specialist",
"Influencer Talent Scout"
],

"Commercial Production Capabilities":[
"Creative Director",
"Art Director",
"Graphic Designer",
"Copywriter",
"Videographer"
],

"Online Customer Service":[
"Account Manager",
"Client Services Director"
],

"Specialization in Vertical Sectors":[
"Brand Strategist",
"Marketing Analyst",
"SEO Specialist",
"PPC Specialist",
"Business Development Manager",
"Marketing Coordinator"
],

"Brand Development and Visual Identity Capabilities":[
"Brand Strategist",
"Creative Director",
"Art Director",
"Graphic Designer",
"UX/UI Designer",
"Copywriter"
],

"Event Production and Management Capabilities":[
"Project Manager",
"Public Relations Specialist",
"Content Strategist",
"Digital Marketing Manager"
],

"Performance Campaign Management Capabilities":[
"Digital Marketing Manager",
"PPC Specialist",
"SEO Specialist",
"Marketing Analyst",
"Data Analyst",
"Marketing Automation Specialist"
],

"Audiovisual Content Production":[
"Videographer",
"Creative Director",
"Art Director",
"Copywriter",
"Graphic Designer"
],

"Content Marketing and Blogging":[
"Content Strategist",
"Copywriter",
"SEO Specialist",
"Social Media Manager",
"Graphic Designer",
"Marketing Coordinator"
],

"Lead Generation and Sales Funnel Strategies":[
"Digital Marketing Manager",
"Business Development Manager",
"PPC Specialist",
"Account Manager",
"Marketing Automation Specialist"
],

"Creation of Digital Experiences (UX/UI)":[
"UX/UI Designer",
"Creative Director",
"Project Manager",
"Content Strategist"
],

"Social Media and Engagement Strategies":[
"Social Media Manager",
"Content Strategist",
"Copywriter",
"Graphic Designer",
"Public Relations Specialist"
],

"Public Relations and Image Crisis Management":[
"Public Relations Specialist",
"Social Media Manager",
"Content Strategist",
"Brand Strategist"
],

"E-commerce Management and Optimization":[
"Digital Marketing Manager",
"SEO Specialist",
"PPC Specialist",
"UX/UI Designer",
"Data Analyst"
],

"Data Analysis and Marketing Metrics":[
"Data Analyst",
"Marketing Analyst",
"SEO Specialist",
"PPC Specialist"
],

"Digital Product Marketing":[
"Content Strategist",
"PPC Specialist",
"Social Media Manager",
"Videographer"
],

"Direct Marketing and Email Marketing":[
"Copywriter",
"Marketing Automation Specialist",
"Data Analyst"
],

"Loyalty Strategies Clients":[
"Account Manager",
"Marketing Automation Specialist",
"Content Strategist"
],

"Specialization in Podcasts":[
"Content Strategist",
"Copywriter",
"Social Media Manager",
"Public Relations Specialist",
"Project Manager"
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

  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    members: [],
    trainings: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadUser() {

      const { data } = await supabase.auth.getUser();

      console.log("AUTH USER:", data?.user);

      setUser(data?.user ?? null);

    }

    loadUser();

  }, []);

  useEffect(() => {

    if (!user) {

      console.log("NO USER FOUND");

      setLoading(false);

      return;

    }

    async function loadCommunity() {

      const { data: member } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .maybeSingle();

      if (!member) {

        setLoading(false);

        return;

      }

      const communityId = member.community_id;

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

      console.log("FINAL MEMBERS ARRAY:", members);

      const offices = members.map(m=>m.Office);

      const detected:string[] = [];

      for (const name in SPECIALIZATIONS){

        const roles = SPECIALIZATIONS[name];

        const match = roles.every((r:string)=>offices.includes(r));

        if (match){

          detected.push(name);

        }

      }

      console.log("SPECIALTIES FOUND:", detected);

      await supabase
        .from("Community specialties")
        .delete()
        .eq("community_id", communityId);

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
                educationsRaw?.filter(
                  (ed:any)=>ed["Graduation year"] > today
                ) ?? [];

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

  specialties: specialtiesList

};

      setFormData(finalData);

      setLoading(false);

    }

    loadCommunity();

  }, [user]);

  if (loading) return null;

  return (

    <PlasmicACommunityDashboard
      args={{
        formData: formData,
        setFormData: setFormData
      }}
    />

  );

}
