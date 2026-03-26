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
      console.log("🔐 LOADING USER...");
      const { data, error } = await supabase.auth.getUser();
      console.log("👤 USER:", data?.user);
      console.log("❌ USER ERROR:", error);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // 🔹 COMMUNITY LOAD
  // =========================
  useEffect(() => {

    if (!user) {
      console.warn("⚠️ NO USER");
      setLoading(false);
      return;
    }

    async function loadCommunity() {

      console.log("=================================");
      console.log("🏗️ LOADING COMMUNITY");

      const { data: myProfile } = await supabase
        .from("User profile")
        .select('"Profile pic"')
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("👤 myProfile:", myProfile);

      const { data: member } = await supabase
        .from("community_members")
        .select("community_id, role, status")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🏷️ MEMBER RECORD:", member);

      if (!member || member.status !== "connected") {
        console.warn("❌ USER NOT CONNECTED");
        setLoading(false);
        return;
      }

      const communityId = member.community_id;
      console.log("🏢 communityId:", communityId);

      // =========================
      // 🔵 COMPANIES DEBUG
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      console.log("🔵 CONNECTIONS RAW:", connections);

      let connectedCompanies:any[] = [];
      let companyRequests:any[] = [];

      if (connections?.length) {

        const companyIds = Array.from(
          new Set(connections.map((c:any)=>Number(c.company_id)))
        );

        console.log("🏢 companyIds:", companyIds);

        const { data: companies } = await supabaseC
          .from("companies")
          .select("*")
          .in("id", companyIds);

        console.log("🏢 companies:", companies);

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
      // 🔴 MEMBERS DEBUG EXTREMO
      // =========================
      console.log("=================================");
      console.log("🔴 LOADING MEMBERS");

      const { data: membersRaw, error: membersError } = await supabase
        .from("community_members")
        .select("id, user_id, status, short_message")
        .eq("community_id", communityId);

      console.log("📦 membersRaw:", membersRaw);
      console.log("❌ membersError:", membersError);

      let connectedMembers:any[] = [];
      let memberRequests:any[] = [];

      if (membersRaw?.length) {

        console.log("📊 TOTAL MEMBERS:", membersRaw.length);

        membersRaw.forEach((m:any, i:number)=>{
          console.log(`👤 MEMBER[${i}]`, {
            id: m.id,
            user_id: m.user_id,
            status: m.status,
            id_type: typeof m.id,
            user_id_type: typeof m.user_id
          });
        });

        const userIds = membersRaw.map(m => m.user_id);
        console.log("🧠 userIds:", userIds);

        const { data: memberProfiles } = await supabase
          .from("User profile")
          .select(`id, user_id, "Profile pic", "First name", "Last name"`)
          .in("user_id", userIds);

        console.log("📦 memberProfiles:", memberProfiles);

        const format = (list:any[]) =>
          list.map((m:any)=>{
            const profile = memberProfiles?.find(p => p.user_id === m.user_id);

            console.log("🔗 MATCH:", {
              member_id: m.id,
              user_id: m.user_id,
              profile_found: !!profile
            });

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

        connectedMembers = format(
          membersRaw.filter(m => m.status === "connected")
        );

        memberRequests = format(
          membersRaw.filter(m => m.status !== "connected")
        );

        console.log("✅ connectedMembers:", connectedMembers);
        console.log("🟡 memberRequests:", memberRequests);
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

      console.log("📦 FINAL DATA:", finalData);

      setFormData(finalData);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  // =========================
  // 🔥 HANDLE SAVE DEBUG
  // =========================
  async function handleSave(payload:any){

    console.log("=================================");
    console.log("🔥 HANDLE SAVE");
    console.log("📦 PAYLOAD:", payload);

    const { action, connectionId, reason } = payload;

    console.log("🧠 PARSED:", { action, connectionId, reason, type: typeof connectionId });

    if (!connectionId) {
      console.warn("❌ NO connectionId");
      return;
    }

    // 🔍 CHECK BEFORE
    const before = await supabase
      .from("community_members")
      .select("*")
      .eq("id", connectionId);

    console.log("🔍 BEFORE:", before);

    if (action === "reject_member" || action === "disconnect_member"){

      console.log("➡️ DELETE MEMBER");

      const res = await supabase
        .from("community_members")
        .delete()
        .eq("id", connectionId)
        .select();

      console.log("📡 DELETE RESPONSE:", res);

      const after = await supabase
        .from("community_members")
        .select("*")
        .eq("id", connectionId);

      console.log("🔍 AFTER:", after);
    }

    if (action === "accept_member"){

      console.log("➡️ ACCEPT MEMBER");

      const res = await supabase
        .from("community_members")
        .update({ status: "connected" })
        .eq("id", connectionId)
        .select();

      console.log("📡 UPDATE RESPONSE:", res);
    }

    // 🔵 COMPANY DEBUG
    if (action === "reject"){
      const res = await supabase
        .from("CONNECTIONS")
        .delete()
        .eq("id", connectionId)
        .select();

      console.log("🔵 COMPANY DELETE:", res);
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
