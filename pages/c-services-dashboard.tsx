import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCServiceDashboard = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCServiceDashboard"
    ).then((m) => m.PlasmicCServiceDashboard),
  { ssr: false }
);

export default function CServiceDashboard() {
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [solutionsData, setSolutionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 filtro já preparado (mesmo sem usar ainda)
  const [selectedSolution, setSelectedSolution] = useState<any>(null);

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

  // =========================
  // LOAD BASE (PADRÃO CORRETO)
  // =========================
  useEffect(() => {
    if (!user) return;

    async function loadAll() {
      try {
        setLoading(true);

        // =========================
        // COMPANY
        // =========================
        const { data: companyData } = await supabaseC
          .from("companies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!companyData) {
          setLoading(false);
          return;
        }

        // 🔥 MAPEAMENTO PADRÃO (igual sistema inteiro)
        const mappedCompany = {
          ...companyData,
          "Company Logo":
            companyData["Company Logo"] ??
            companyData.company_logo ??
            "",
          "Company nature":
            companyData["Company nature"] ??
            companyData.company_nature ??
            "",
          "Company name":
            companyData["Company name"] ??
            companyData.name ??
            "",
        };

        setCompany(mappedCompany);

        // =========================
        // SOLUTIONS (MESMA LÓGICA DO COMPANY PROFILE)
        // =========================
        const { data: solutions } = await supabaseC
          .from("solutions")
          .select("id, Title")
          .eq("Company_id", companyData.id); // 🔥 ESSENCIAL

        const formattedSolutions =
          solutions?.map((s: any) => ({
            id: s.id,
            title: s.Title ?? "",
          })) ?? [];

        setSolutionsData(formattedSolutions);
      } catch (err) {
        console.error("Load error:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [user]);

  if (loading) return null;

  return (
    <PlasmicCServiceDashboard
      args={{
        // 🔥 BASE
        company: company ?? {},

        // 🔥 REPEATER
        solutionsData:
          solutionsData.length ? solutionsData : [{}],

        // 🔥 FILTER READY
        selectedSolution,
        setSelectedSolution,
      }}
    />
  );
}
