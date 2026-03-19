import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCCompanyProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCCompanyProfile"
    ),
  { ssr: false }
);

export default function CCompanyProfile() {
  const router = useRouter();

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [connectedAgencies, setConnectedAgencies] = useState<any[]>([]);
  const [agencyRequests, setAgencyRequests] = useState<any[]>([]);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      console.log("🔐 AUTH START");

      const { data, error } = await supabaseC.auth.getUser();

      console.log("👤 USER:", data?.user);
      console.log("❌ AUTH ERROR:", error);

      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (user === null && !loading) {
      console.log("🚪 REDIRECT TRIGGERED");
      router.replace("/");
    }
  }, [user, loading]);

  // =========================
  // LOAD ALL
  // =========================

  async function loadAll() {
    if (!user) {
      console.log("⛔ LOAD BLOCKED — NO USER");
      return;
    }

    console.log("=================================");
    console.log("🚀 LOAD ALL START");
    console.log("🆔 USER ID:", user.id);

    try {
      setLoading(true);

      // =========================
      // COMPANY
      // =========================

      const { data: companyData, error: companyError } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🏢 COMPANY DATA:", companyData);
      console.log("❌ COMPANY ERROR:", companyError);

      if (!companyData) {
        console.log("⚠️ NO COMPANY FOUND");

        setConnectedAgencies([]);
        setAgencyRequests([]);
        setLoading(false);
        return;
      }

      console.log("🆔 COMPANY ID:", companyData.id);

      setCompany(companyData);

      // =========================
      // 🔥 TEST CONNECTIONS (SEM FILTRO)
      // =========================

      const { data: allConnections } = await supabaseA
        .from("CONNECTIONS")
        .select("*");

      console.log("🌐 ALL CONNECTIONS (NO FILTER):", allConnections);

      // =========================
      // 🔥 CONNECTIONS FILTRADAS
      // =========================

      const { data: connections, error: connError } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData.id);

      console.log("🔗 FILTERED CONNECTIONS:", connections);
      console.log("❌ CONNECTION ERROR:", connError);

      if (!connections || connections.length === 0) {
        console.log("🚨 NO CONNECTIONS FOR THIS COMPANY");

        // 🔥 DEBUG EXTRA
        console.log("🔍 POSSIBLE COMPANY IDs IN DB:");
        allConnections?.forEach((c: any) => {
          console.log("→ connection company_id:", c.company_id);
        });

        setConnectedAgencies([]);
        setAgencyRequests([]);
        setLoading(false);
        return;
      }

      // =========================
      // FILTER
      // =========================

      const connected = connections.filter(
        (c: any) => c.status === "connected"
      );

      const requests = connections.filter(
        (c: any) => c.status === "agency request"
      );

      console.log("✅ CONNECTED:", connected);
      console.log("📩 REQUESTS:", requests);

      const agencyIds = connections.map((c: any) => c.agency_id);

      console.log("🆔 AGENCY IDS:", agencyIds);

      // =========================
      // COMMUNITIES
      // =========================

      const { data: communities, error: commError } = await supabaseA
        .from("Community")
        .select("*")
        .in("id", agencyIds);

      console.log("🏘️ COMMUNITIES:", communities);
      console.log("❌ COMMUNITY ERROR:", commError);

      // =========================
      // MEMBERS
      // =========================

      const { data: members } = await supabaseA
        .from("community_members")
        .select("community_id");

      const memberCountMap: any = {};

      members?.forEach((m: any) => {
        memberCountMap[m.community_id] =
          (memberCountMap[m.community_id] || 0) + 1;
      });

      console.log("👥 MEMBER MAP:", memberCountMap);

      // =========================
      // SPECIALTIES
      // =========================

      const { data: specialties } = await supabaseA
        .from("community speciallties")
        .select("*");

      const specialtiesMap: any = {};

      specialties?.forEach((s: any) => {
        if (!specialtiesMap[s.community_id]) {
          specialtiesMap[s.community_id] = [];
        }

        specialtiesMap[s.community_id].push(s["Specialty"]);
      });

      console.log("🧠 SPECIALTIES MAP:", specialtiesMap);

      // =========================
      // FORMAT
      // =========================

      const format = (list: any[], label: string) =>
        list.map((conn: any) => {
          const community = communities?.find(
            (c: any) => c.id === conn.agency_id
          );

          console.log(`🔎 ${label} MATCH`, {
            connection: conn,
            foundCommunity: community,
          });

          return {
            id: conn.id,
            agency_id: conn.agency_id,
            short_message: conn.short_message ?? "",
            community_name: community?.["Community name"] ?? "❌ NO NAME",
            community_logo: community?.["Community logo"] ?? "",
            members: memberCountMap[conn.agency_id] ?? 0,
            specialties: specialtiesMap[conn.agency_id] ?? [],
          };
        });

      const finalConnected = format(connected, "CONNECTED");
      const finalRequests = format(requests, "REQUEST");

      console.log("🎯 FINAL CONNECTED:", finalConnected);
      console.log("🎯 FINAL REQUESTS:", finalRequests);

      setConnectedAgencies(finalConnected);
      setAgencyRequests(finalRequests);
    } catch (err) {
      console.error("💥 LOAD ERROR:", err);
    }

    console.log("🏁 LOAD ALL END");
    console.log("=================================");

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  // =========================
  // ACTIONS (LOGS)
  // =========================

  async function handleConfirmConnection(connectionId: string) {
    console.log("✅ CONFIRM CLICK:", connectionId);

    const { error } = await supabaseA
      .from("CONNECTIONS")
      .update({ status: "connected" })
      .eq("id", connectionId);

    console.log("📡 CONFIRM RESULT:", error);

    loadAll();
  }

  async function handleCancelRequest(connectionId: string) {
    console.log("❌ CANCEL CLICK:", connectionId);

    const { error } = await supabaseA
      .from("CONNECTIONS")
      .delete()
      .eq("id", connectionId);

    console.log("📡 CANCEL RESULT:", error);

    loadAll();
  }

  async function handleDisconnect(connectionId: string, reason: string) {
    console.log("🔌 DISCONNECT:", { connectionId, reason });

    const { error } = await supabaseA
      .from("CONNECTIONS")
      .update({
        status: "company disconnected",
        short_message: reason,
      })
      .eq("id", connectionId);

    console.log("📡 DISCONNECT RESULT:", error);

    loadAll();
  }

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    console.log("🚪 LOGOUT CLICK");
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  // =========================
  // RENDER
  // =========================

  if (user === undefined) return null;
  if (loading) return null;

  console.log("🎨 FINAL RENDER DATA:", {
    connectedAgencies,
    agencyRequests,
  });

  return (
    <PlasmicCCompanyProfile
      args={{
        company: company ?? {},
        formData: solutions ?? [],
        solutions: solutions ?? [],

        connectedAgencies: connectedAgencies ?? [],
        agencyRequests: agencyRequests ?? [],

        onConfirmConnection: handleConfirmConnection,
        onCancelRequest: handleCancelRequest,
        onDisconnect: handleDisconnect,

        onLogout: handleLogout,
      }}
    />
  );
}
