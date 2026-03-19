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

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseC.auth.getUser();
      console.log("👤 USER:", data?.user);
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user === null && !loading) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // =========================
  // LOAD ALL
  // =========================

  async function loadAll() {
    if (!user) return;

    console.log("=================================");
    console.log("🚀 LOAD ALL START");

    try {
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

        const agencyIds = connections.map((c: any) =>
          String(c.agency_id)
        );

        console.log("🧠 AGENCY IDS:", agencyIds);

        const { data: communities } = await supabaseA
          .from("Community")
          .select("*")
          .in("id", agencyIds);

        console.log("🏘️ COMMUNITIES RAW:", communities);

        const { data: members } = await supabaseA
          .from("community_members")
          .select("community_id");

        console.log("👥 MEMBERS RAW:", members);

        const memberCountMap: any = {};

        members?.forEach((m: any) => {
          const key = String(m.community_id);

          memberCountMap[key] = (memberCountMap[key] || 0) + 1;
        });

        console.log("📊 MEMBER COUNT MAP:", memberCountMap);

        const { data: specialties } = await supabaseA
          .from("Community specialties")
          .select("*");

        console.log("🎯 SPECIALTIES RAW:", specialties);

        const specialtiesMap: any = {};

        specialties?.forEach((s: any) => {
          const key = String(s.community_id);

          if (!specialtiesMap[key]) {
            specialtiesMap[key] = [];
          }

          specialtiesMap[key].push(s["Specialty"]);
        });

        console.log("🧩 SPECIALTIES MAP:", specialtiesMap);

        const format = (list: any[]) =>
          list.map((conn: any) => {
            console.log("----------");
            console.log("🔎 PROCESSING CONNECTION:", conn);

            const key = String(conn.agency_id);

            const community = communities?.find(
              (c: any) => String(c.id) === key
            );

            console.log("🏷️ MATCHED COMMUNITY:", community);

            console.log(
              "👥 MEMBERS FOR THIS:",
              key,
              memberCountMap[key]
            );

            console.log(
              "🎯 SPECIALTIES FOR THIS:",
              key,
              specialtiesMap[key]
            );

            return {
              id: conn.id,
              short_message: conn.short_message ?? "",

              community_name:
                community?.["community_name"] ??
                community?.["Community name"] ??
                "NO NAME",

              community_logo:
                community?.["community_logo"] ??
                community?.["Community logo"] ??
                "NO LOGO",

              members: memberCountMap[key] ?? 0,
              specialties: specialtiesMap[key] ?? [],
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

      const structuredSolutions =
        solutionsData?.map((sol: any) => ({
          id: sol.id,
          title: sol.Title ?? "",
          description: sol.Description ?? "",
          price: sol.Price ?? "",
          steps:
            sol.solutions_steps
              ?.sort(
                (a: any, b: any) =>
                  (a.Step_order ?? 0) - (b.Step_order ?? 0)
              )
              .map((s: any) => ({
                id: s.id,
                step_text: s.step_text ?? "",
              })) ?? [],
        })) ?? [];

      setSolutions(structuredSolutions);

    } catch (err) {
      console.error("💥 LOAD ERROR:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  // =========================
  // RENDER
  // =========================

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
