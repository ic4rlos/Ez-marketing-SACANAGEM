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
        // AUTH
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
        // BASE FORMAT
        // =========================
        const base = (companies ?? []).map((c: any) => ({
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

          "Customer problem": c?.["Customer problem"] ?? "",
          "Solution description": c?.["Solution description"] ?? "",

          solutions: solutionsMap[Number(c.id)] ?? [],
        }));

        // =========================
        // SPLIT EM 3 LISTAS 🔥
        // =========================

        const company_highlights = base.slice(0, 5); // destaque (primeiros)
        const company_news = base.slice(5, 10); // meio
        const company_normal = base.slice(10); // restante

        setFormData({
          logged_profile_pic,

          company_highlights,
          company_news,
          company_normal,
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

        company_highlights:
          formData?.company_highlights?.length
            ? formData.company_highlights
            : [{}],

        company_news:
          formData?.company_news?.length
            ? formData.company_news
            : [{}],

        company_normal:
          formData?.company_normal?.length
            ? formData.company_normal
            : [{}],
      }}
    />
  );
}
