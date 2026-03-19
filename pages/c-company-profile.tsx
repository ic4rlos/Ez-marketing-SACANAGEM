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

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseC.auth.getUser();
      console.log("👤 USER:", data?.user);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  async function loadAll() {
    if (!user) return;

    try {
      console.log("=================================");
      console.log("🚀 LOAD ALL START");

      setLoading(true);

      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("🏢 COMPANY:", companyData);

      if (!companyData) {
        setCompany(null);
        setLoading(false);
        return;
      }

      // =========================
      // CONNECTIONS
      // =========================

      const { data: connections } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData.id);

      console.log("🔗 CONNECTIONS RAW:", connections);

      let connectedAgencies: any[] = [];
      let agencyRequests: any[] = [];

      if (connections && connections.length > 0) {
        const connected = connections.filter(
          (c: any) => c.status === "connected"
        );

        const requests = connections.filter(
          (c: any) => c.status === "agency request"
        );

        console.log("✅ CONNECTED:", connected);
        console.log("📩 REQUESTS:", requests);

        const agencyIds = connections.map((c: any) => c.agency_id);

        console.log("🧠 AGENCY IDS:", agencyIds);

        // =========================
        // COMMUNITIES
        // =========================

        const { data: communities } = await supabaseA
          .from("Community")
          .select("*")
          .in("id", agencyIds);

        console.log("🏘️ COMMUNITIES RAW:", communities);

        // =========================
        // MEMBERS
        // =========================

        const { data: members } = await supabaseA
          .from("community_members")
          .select("community_id");

        console.log("👥 MEMBERS RAW:", members);

        const memberCountMap: any = {};

        members?.forEach((m: any) => {
          memberCountMap[m.community_id] =
            (memberCountMap[m.community_id] || 0) + 1;
        });

        console.log("📊 MEMBER COUNT MAP:", memberCountMap);

        // =========================
        // SPECIALTIES
        // =========================

        const { data: specialties } = await supabaseA
          .from("Community specialties")
          .select("*");

        console.log("🎯 SPECIALTIES RAW:", specialties);

        const specialtiesMap: any = {};

        specialties?.forEach((s: any) => {
          if (!specialtiesMap[s.community_id]) {
            specialtiesMap[s.community_id] = [];
          }

          specialtiesMap[s.community_id].push(s["Specialty"]);
        });

        console.log("🧩 SPECIALTIES MAP:", specialtiesMap);

        // =========================
        // FORMAT
        // =========================

        const format = (list: any[]) =>
          list.map((conn: any) => {
            console.log("----------");
            console.log("🔎 PROCESSING CONNECTION:", conn);

            const community = communities?.find(
              (c: any) => String(c.id) === String(conn.agency_id)
            );

            console.log("🏷️ MATCHED COMMUNITY:", community);

            if (!community) {
              console.log("❌ COMMUNITY NOT FOUND FOR:", conn.agency_id);
            }

            return {
              id: conn.id,
              short_message: conn.short_message ?? "",

              community_name: community?.["Community name"] ?? "NO NAME",
              community_logo: community?.["Community logo"] ?? "NO LOGO",

              members: memberCountMap[conn.agency_id] ?? 0,
              specialties: specialtiesMap[conn.agency_id] ?? [],
            };
          });

        connectedAgencies = format(connected);
        agencyRequests = format(requests);

        console.log("🔥 CONNECTED FINAL:", connectedAgencies);
        console.log("🔥 REQUESTS FINAL:", agencyRequests);
      }

      const enrichedCompany = {
        ...companyData,
        connected_agencies: connectedAgencies,
        agency_requests: agencyRequests,
      };

      console.log("🏁 FINAL COMPANY:", enrichedCompany);

      setCompany(enrichedCompany);

      // =========================
      // SOLUTIONS
      // =========================

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
        .eq("Company_id", companyData.id)
        .order("id", { ascending: true });

      setSolutions(
        solutionsData?.map((sol: any) => ({
          id: sol.id,
          title: sol.Title ?? "",
          description: sol.Description ?? "",
          price: sol.Price ?? "",
          steps:
            sol.solutions_steps?.map((s: any) => ({
              id: s.id,
              step_text: s.step_text ?? "",
            })) ?? [],
        })) ?? []
      );

    } catch (err) {
      console.error("💥 LOAD ERROR:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  async function handleLogout() {
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  if (user === undefined) return null;
  if (loading) return null;

  return (
    <PlasmicCCompanyProfile
      args={{
        company: company ?? {},
        formData: solutions ?? [],
        solutions: solutions ?? [],
        onLogout: handleLogout,
      }}
    />
  );
}
