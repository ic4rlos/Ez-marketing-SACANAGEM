import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

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
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔹 USER
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // 🔹 COMMUNITY
  // =========================
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

      // =========================
      // 🔵 COMPANIES
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      let connectedCompanies:any[] = [];
      let companyRequests:any[] = [];

      if (connections?.length) {

        const companyIds = [...new Set(connections.map((c:any)=>Number(c.company_id)))];

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        const format = (list:any[]) =>
          list.map((conn:any)=>{
            const company = companies?.find((c:any)=>Number(c.id) === Number(conn.company_id));
            return {
              id: conn.id,
              company_id: conn.company_id,
              short_message: conn.short_message ?? "",
              "Company Logo": company?.["Company Logo"] ?? "",
              "Company name": company?.["Company name"] ?? "",
              "Company type": company?.["Company type"] ?? ""
            };
          });

        connectedCompanies = format(connections.filter((c:any)=>c.status === "connected"));
        companyRequests = format(connections.filter((c:any)=>c.status === "company request"));
      }

      // =========================
      // 🔴 MEMBERS
      // =========================
      const { data: membersRaw } = await supabase
        .from("community_members")
        .select("id, user_id, status, short_message")
        .eq("community_id", communityId);

      let connectedMembers:any[] = [];
      let memberRequests:any[] = [];

      if (membersRaw?.length) {

        const userIds = membersRaw.map(m => m.user_id);

        const { data: memberProfiles } = await supabase
          .from("User profile")
          .select(`id, user_id, "Profile pic", "First name", "Last name"`)
          .in("user_id", userIds);

        const format = (list:any[]) =>
          list.map((m:any)=>{
            const profile = memberProfiles?.find(p => p.user_id === m.user_id);

            return {
              id: m.id,
              user_id: m.user_id,
              status: m.status,
              short_message: m.short_message ?? "",
              "Profile pic": profile?.["Profile pic"] ?? "",
              "First name": profile?.["First name"] ?? "",
              "Last name": profile?.["Last name"] ?? ""
            };
          });

        connectedMembers = format(membersRaw.filter(m => m.status === "connected"));
        memberRequests = format(membersRaw.filter(m => m.status !== "connected"));
      }

      // =========================
      // 🔹 COMMUNITY INFO
      // =========================
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      const finalData = {
        ...community,
        "Profile pic": myProfile?.["Profile pic"] ?? null,

        connected_companies: connectedCompanies,
        company_requests: companyRequests,

        connected_members: connectedMembers,
        member_requests: memberRequests,

        isAdmin: member.role === "admin"
      };

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  // =========================
  // 🔹 ACTIONS
  // =========================
  async function handleSave(payload:any){

    console.log("🔥 HANDLE SAVE:", payload);

    const { action, connectionId, reason } = payload;

    if (!connectionId) {
      console.warn("❌ NO connectionId");
      return;
    }

    if (action === "disconnect"){
      const res = await supabase.from("CONNECTIONS")
        .update({
          status: "agency disconnected",
          short_message: reason
        })
        .eq("id", connectionId)
        .select();

      console.log("DISCONNECT RES:", res);
    }

    if (action === "accept"){
      const res = await supabase.from("CONNECTIONS")
        .update({ status: "connected" })
        .eq("id", connectionId)
        .select();

      console.log("ACCEPT RES:", res);
    }

    if (action === "reject"){
      const res = await supabase.from("CONNECTIONS")
        .delete()
        .eq("id", connectionId)
        .select();

      console.log("DELETE RES:", res);
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
