import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicAFindCommunity = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicAFindCommunity"
    ).then((m) => m.PlasmicAFindCommunity),
  { ssr: false }
);

// 🔥 MESMO MAPA DO DASHBOARD
const SPECIALIZATIONS: any = {
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
  "Social Media and Engagement Strategies":[
    "Social Media Manager","Content Strategist","Copywriter","Graphic Designer","Public Relations Specialist"
  ],
  "Lead Generation and Sales Funnel Strategies":[
    "Digital Marketing Manager","Business Development Manager","PPC Specialist","Account Manager","Marketing Automation Specialist"
  ],
  "Creation of Digital Experiences (UX/UI)":[
    "UX/UI Designer","Creative Director","Project Manager","Content Strategist"
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

export default function AFindCommunity() {

  const supabase = getSupabaseA();

  const [communitiesBySpecialty, setCommunitiesBySpecialty] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {

      setLoading(true);
const { data: userData } = await supabase.auth.getUser();

const { data: myProfile } = await supabase
  .from("User profile")
  .select('"Profile pic"')
  .eq("user_id", userData?.user?.id)
  .maybeSingle();
      // =========================
      // COMMUNITIES
      // =========================
      const { data: communitiesData } = await supabase
        .from("Community")
        .select("*");

      // =========================
      // MEMBERS COUNT
      // =========================
      const { data: members } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("status", "connected");

      const memberCountMap: any = {};
      members?.forEach((m: any) => {
        const key = Number(m.community_id);
        memberCountMap[key] = (memberCountMap[key] || 0) + 1;
      });

      // =========================
      // SPECIALTIES (BANCO)
      // =========================
      const { data: specialties } = await supabase
        .from("Community specialties")
        .select("*");

      const specialtiesMap: any = {};
      specialties?.forEach((s: any) => {
        const key = Number(s.community_id);
        if (!specialtiesMap[key]) specialtiesMap[key] = [];
        specialtiesMap[key].push(s["Professional specialty"]);
      });

      // =========================
      // FORMAT COMMUNITIES
      // =========================
      const formatted = (communitiesData ?? []).map((c: any) => ({
        id: c.id,
        agency_id: c.id,
        community_name: c?.community_name ?? "",
        community_logo: c?.community_logo ?? "",
        members: memberCountMap[Number(c.id)] ?? 0,
        specialties: specialtiesMap[Number(c.id)] ?? []
      }));

      // =========================
      // 🔥 GROUP BY SPECIALTY (AQUI É O SEGREDO)
      // =========================
      const grouped: any = {};

      Object.keys(SPECIALIZATIONS).forEach((spec) => {
        grouped[spec] = formatted.filter((c: any) =>
          c.specialties?.includes(spec)
        );
      });

      setCommunitiesBySpecialty(grouped);

      setLoading(false);
    }

    loadAll();
  }, []);

  if (loading) return null;

  return (
    <PlasmicAFindCommunity
      args={{
        communities: communitiesBySpecialty
      }}
    />
  );
}
