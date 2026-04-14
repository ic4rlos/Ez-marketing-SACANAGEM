import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicAFindABusiness = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicAFindABusiness"
    ).then((m) => m.PlasmicAFindABusiness),
  { ssr: false }
);

export default function AFindABusiness() {
  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function loadAll() {
      try {
        // =========================
        // AUTH 🔥 (faltava isso)
        // =========================
        const { data: userData } = await supabaseA.auth.getUser();

        let logged_profile_pic = null;

        if (userData?.user?.id) {
          const { data: profile } = await supabaseA
            .from("User profile")
            .select('"Profile pic"')
            .eq("user_id", userData.user.id)
            .maybeSingle();

          logged_profile_pic = profile?.["Profile pic"] ?? null;
        }

        // =========================
        // COMPANIES
        // =========================
        const { data: companies } = await supabaseC
          .from("companies")
          .select("*");

        // =========================
        // SOLUTIONS
        // =========================
        const { data: solutionsData } = await supabaseC
          .from("solutions")
          .select("id, Title, Company_id");

        const solutionsMap: any = {};

        solutionsData?.forEach((s: any) => {
          const key = Number(s.Company_id);
          if (!solutionsMap[key]) solutionsMap[key] = [];

          solutionsMap[key].push({
            id: s.id,
            title: s.Title ?? "",
          });
        });

        // =========================
        // FORMAT FINAL 🔥
        // =========================
        const formatted = (companies ?? []).map((c: any) => ({
          company_id: c.id,

          "Company Logo": c?.["Company Logo"] ?? "",
          "Company image": c?.["Company image"] ?? "",

          "Company name": c?.["Company name"] ?? "",
          "Company type": c?.["Company type"] ?? "",
          "Area": c?.["Area"] ?? "",
          "Sub area": c?.["Sub area"] ?? "",
          "Location": c?.["Location"] ?? "",
          "Company tagline": c?.["Company tagline"] ?? "",
          "Company nature": c?.["Company nature"] ?? "Standard",

          solutions: solutionsMap[Number(c.id)] ?? [],
        }));

        setFormData({
          logged_profile_pic, // 🔥 AGORA EXISTE
          company_requests: formatted,
        });
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadAll();
  }, []);

  if (loading) return null;

  return (
    <PlasmicAFindABusiness
      args={{
        formData,

        company_requests:
          formData?.company_requests?.length
            ? formData.company_requests
            : [{}],
      }}
    />
  );
}
