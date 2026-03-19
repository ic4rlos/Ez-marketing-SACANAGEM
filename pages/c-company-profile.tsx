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

  const supabaseA = getSupabaseA(); // agencies
  const supabaseC = getSupabaseC(); // companies

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW
  const [connectedAgencies, setConnectedAgencies] = useState<any[]>([]);
  const [agencyRequests, setAgencyRequests] = useState<any[]>([]);

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
      if (router.pathname !== "/") {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  // =========================
  // LOAD COMPANY + CONNECTIONS
  // =========================

  useEffect(() => {
    if (!user) return;

    async function loadAll() {
      try {
        setLoading(true);

        // 🔹 COMPANY
        const { data: companyData } = await supabaseC
          .from("companies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!companyData) {
          setCompany(null);
          setSolutions([]);
          setConnectedAgencies([]);
          setAgencyRequests([]);
          setLoading(false);
          return;
        }

        setCompany(companyData);

        // 🔹 SOLUTIONS
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

        // 🔥 CONNECTIONS (AGENCIES DB)
        const { data: connections } = await supabaseA
          .from("CONNECTIONS")
          .select("*")
          .eq("company_id", companyData.id);

        if (!connections || connections.length === 0) {
          setConnectedAgencies([]);
          setAgencyRequests([]);
        } else {
          const connected = connections.filter(
            (c: any) => c.status === "connected"
          );

          const requests = connections.filter(
            (c: any) => c.status === "agency request"
          );

          const agencyIds = connections.map((c: any) => c.agency_id);

          // 🔹 COMMUNITY
          const { data: communities } = await supabaseA
            .from("Community")
            .select("*")
            .in("id", agencyIds);

          // 🔹 MEMBERS
          const { data: members } = await supabaseA
            .from("community_members")
            .select("community_id");

          const memberCountMap: any = {};

          members?.forEach((m: any) => {
            memberCountMap[m.community_id] =
              (memberCountMap[m.community_id] || 0) + 1;
          });

          // 🔥 SPECIALTIES
          const { data: specialties } = await supabaseA
            .from("community speciallties")
            .select("*");

          const specialtiesMap: any = {};

          specialties?.forEach((s: any) => {
            if (!specialtiesMap[s.community_id]) {
              specialtiesMap[s.community_id] = [];
            }

            specialtiesMap[s.community_id].push(
              s["Specialty"] ?? ""
            );
          });

          const format = (list: any[]) =>
            list.map((conn: any) => {
              const community = communities?.find(
                (c: any) => c.id === conn.agency_id
              );

              return {
                id: conn.id,
                agency_id: conn.agency_id,
                short_message: conn.short_message ?? "",

                community_name: community?.["Community name"] ?? "",
                community_logo: community?.["Community logo"] ?? "",

                members: memberCountMap[conn.agency_id] ?? 0,

                // 🔥 NEW
                specialties: specialtiesMap[conn.agency_id] ?? [],
              };
            });

          setConnectedAgencies(format(connected));
          setAgencyRequests(format(requests));
        }
      } catch (err) {
        console.error("Load error:", err);
      }

      setLoading(false);
    }

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

        // 🔥 NEW
        connectedAgencies: connectedAgencies ?? [],
        agencyRequests: agencyRequests ?? [],

        onLogout: handleLogout,
      }}
    />
  );
}
