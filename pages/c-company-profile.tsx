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

    try {
      setLoading(true);

      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

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

      let connectedAgencies: any[] = [];
      let agencyRequests: any[] = [];

      if (connections && connections.length > 0) {
        const connected = connections.filter(
          (c: any) => c.status === "connected"
        );

        const requests = connections.filter(
          (c: any) => c.status === "agency request"
        );

        const agencyIds = connections.map((c: any) => c.agency_id);

        const { data: communities } = await supabaseA
          .from("Community")
          .select("*")
          .in("id", agencyIds);

        const { data: members } = await supabaseA
          .from("community_members")
          .select("community_id");

        const memberCountMap: any = {};

        members?.forEach((m: any) => {
          memberCountMap[m.community_id] =
            (memberCountMap[m.community_id] || 0) + 1;
        });

        const { data: specialties } = await supabaseA
          .from("Community specialties")
          .select("*");

        const specialtiesMap: any = {};

        specialties?.forEach((s: any) => {
          if (!specialtiesMap[s.community_id]) {
            specialtiesMap[s.community_id] = [];
          }

          specialtiesMap[s.community_id].push(s["Specialty"]);
        });

        const format = (list: any[]) =>
          list.map((conn: any) => {
            const community = communities?.find(
              (c: any) => String(c.id) === String(conn.agency_id)
            );

            return {
              id: conn.id,
              short_message: conn.short_message ?? "",
              community_name: community?.["Community name"] ?? "",
              community_logo: community?.["Community logo"] ?? "",
              members: memberCountMap[conn.agency_id] ?? 0,
              specialties: specialtiesMap[conn.agency_id] ?? [],
            };
          });

        connectedAgencies = format(connected);
        agencyRequests = format(requests);
      }

      // =========================
      // ACTIONS (SEM PROPS ❗)
      // =========================

      async function handleConnectionAction(
        connectionId: string,
        action: "accept" | "reject" | "disconnect",
        reason?: string
      ) {
        if (action === "accept") {
          await supabaseA
            .from("CONNECTIONS")
            .update({ status: "connected" })
            .eq("id", connectionId);
        }

        if (action === "reject") {
          await supabaseA
            .from("CONNECTIONS")
            .delete()
            .eq("id", connectionId);
        }

        if (action === "disconnect") {
          await supabaseA
            .from("CONNECTIONS")
            .update({
              status: "company disconnected",
              short_message: reason ?? "",
            })
            .eq("id", connectionId);
        }

        loadAll();
      }

      // =========================
      // INJEÇÃO FINAL
      // =========================

      const enrichedCompany = {
        ...companyData,

        connected_agencies: connectedAgencies,
        agency_requests: agencyRequests,

        _actions: {
          connection: handleConnectionAction,
        },
      };

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
      console.error("Load error:", err);
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
