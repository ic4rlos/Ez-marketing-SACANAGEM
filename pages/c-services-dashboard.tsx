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

  const [companyUser, setCompanyUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseC.auth.getUser();
      setCompanyUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD BASE (SÓ O NECESSÁRIO)
  // =========================
  useEffect(() => {
    if (!companyUser) return;

    async function loadBase() {
      // COMPANY
      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", companyUser.id)
        .maybeSingle();

      if (!companyData) {
        setLoading(false);
        return;
      }

      // 🔥 MAPEAR EXATAMENTE COMO PLASMIC ESPERA
      const mappedCompany = {
        ...companyData,
        "Company Logo": companyData.company_logo ?? "",
        "Company nature": companyData.company_nature ?? "",
        "Company name": companyData.name ?? ""
      };

      setCompany(mappedCompany);

      // SOLUTIONS DA EMPRESA
      const { data: solutionsData } = await supabaseC
        .from("solutions")
        .select("id, Title")
        .eq("company_id", companyData.id);

      setSolutions(solutionsData || []);

      setLoading(false);
    }

    loadBase();
  }, [companyUser]);

  if (loading) return null;

  return (
    <PlasmicCServiceDashboard
      args={{
        company,
        solutions: solutions.length ? solutions : [{}]
      }}
    />
  );
}
