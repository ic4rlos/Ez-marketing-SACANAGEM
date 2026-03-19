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
      console.log("🔐 LOAD USER...");
      const { data, error } = await supabaseC.auth.getUser();

      console.log("👤 USER DATA:", data);
      console.log("❌ USER ERROR:", error);

      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user === null && !loading) {
      console.log("🚪 USER NULL → REDIRECT");
      router.replace("/");
    }
  }, [user, loading, router]);

  // =========================
  // LOAD ALL (DEBUG MODE)
  // =========================

  async function loadAll() {
    if (!user) return;

    try {
      console.log("=================================");
      console.log("🚀 LOAD ALL START");

      setLoading(true);

      // COMPANY
      const { data: companyData, error: companyError } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🏢 COMPANY:", companyData);
      console.log("❌ COMPANY ERROR:", companyError);

      if (!companyData) {
        console.log("⚠️ NO COMPANY FOUND");
        setConnectedAgencies([]);
        setAgencyRequests([]);
        setLoading(false);
        return;
      }

      setCompany(companyData);

      // SOLUTIONS
      const { data: solutionsData } = await supabaseC
        .from("solutions")
        .select(`
          id,
          Title,
          Description,
          Price,
          solutions_steps (
            id,
            step_text,
            Step_order
          )
        `)
        .eq("Company_id", companyData.id);

      console.log("🧩 SOLUTIONS RAW:", solutionsData);

      const structuredSolutions =
        solutionsData?.map((sol: any) => ({
          id: sol.id,
          title: sol.Title ?? "",
          description: sol.Description ?? "",
          price: sol.Price ?? "",
          steps:
            sol.solutions_steps
              ?.sort((a: any, b: any) => (a.Step_order ?? 0) - (b.Step_order ?? 0))
              .map((s: any) => ({
                id: s.id,
                step_text: s.step_text ?? "",
              })) ?? [],
        })) ?? [];

      console.log("🧩 SOLUTIONS STRUCTURED:", structuredSolutions);

      setSolutions(structuredSolutions);

      // CONNECTIONS
      const { data: connections, error: connError } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData.id);

      console.log("🔗 CONNECTIONS RAW:", connections);
      console.log("❌ CONNECTION ERROR:", connError);

      if (!connections || connections.length === 0) {
        console.log("⚠️ NO CONNECTIONS");
        setConnectedAgencies([]);
        setAgencyRequests([]);
        setLoading(false);
        return;
      }

      // FILTER
      const connected = connections.filter(
        (c: any) => c.status === "connected"
      );

      const requests = connections.filter(
        (c: any) => c.status === "agency request"
      );

      console.log("✅ CONNECTED FILTER:", connected);
      console.log("📩 REQUEST FILTER:", requests);

      const agencyIds = connections.map((c: any) => c.agency_id);

      console.log("🆔 AGENCY IDS:", agencyIds);

      // COMMUNITIES
      const { data: communities, error: commError } = await supabaseA
        .from("Community")
        .select("*")
        .in("id", agencyIds);

      console.log("🏘️ COMMUNITIES:", communities);
      console.log("❌ COMMUNITIES ERROR:", commError);

      // MEMBERS
      const { data: members } = await supabaseA
        .from("community_members")
        .select("community_id");

      const memberCountMap: any = {};
      members?.forEach((m: any) => {
        memberCountMap[m.community_id] =
          (memberCountMap[m.community_id] || 0) + 1;
      });

      console.log("👥 MEMBER MAP:", memberCountMap);

      // SPECIALTIES
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

      // FORMAT
      const format = (list: any[], label: string) =>
        list.map((conn: any) => {
          const community = communities?.find(
            (c: any) => c.id === conn.agency_id
          );

          console.log(`🔎 MATCH ${label}`, {
            connection: conn,
            communityFound: community,
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

      console.log("=================================");
    } catch (err) {
      console.error("💥 LOAD ERROR:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  // =========================
  // ACTIONS (DEBUG)
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
    console.log("🔌 DISCONNECT CLICK:", {
      connectionId,
      reason,
    });

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
    console.log("🚪 LOGOUT");
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  // =========================
  // RENDER
  // =========================

  if (user === undefined) return null;
  if (loading) return null;

  console.log("🎨 RENDER DATA:", {
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
