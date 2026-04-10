import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCFindAffiliate = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCFindAffiliate"
    ).then((m) => m.PlasmicCFindAffiliate),
  { ssr: false }
);

// 🔥 MESMO MAPA
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

export default function CFindAffiliate() {

  const supabase = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [communitiesBySpecialty, setCommunitiesBySpecialty] = useState<any>({});
  const [loggedProfilePic, setLoggedProfilePic] = useState<any>(null);
  const [companyLogo, setCompanyLogo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {

      setLoading(true);

      // =========================
      // USER (COMPANY)
      // =========================
      const { data: userData } = await supabaseC.auth.getUser();

      // 🔥 COMPANY LOGO
      const { data: companyData } = await supabaseC
        .from("companies")
        .select('"Company Logo"')
        .eq("user_id", userData?.user?.id)
        .maybeSingle();

      setCompanyLogo(companyData?.["Company Logo"] ?? "");

      // 🔥 PROFILE PIC
      const { data: myProfile } = await supabase
        .from("User profile")
        .select('"Profile pic"')
        .eq("user_id", userData?.user?.id)
        .maybeSingle();

      setLoggedProfilePic(myProfile?.["Profile pic"] ?? null);

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
      // SPECIALTIES
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
      // FORMAT
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
      // GROUP BY SPECIALTY
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
    <PlasmicCFindAffiliate
      args={{
        communities: communitiesBySpecialty,
        company: {
          "Company Logo": companyLogo ?? ""
        },
        formData: {
          logged_profile_pic: loggedProfilePic
        }
      }}
    />
  );
}
