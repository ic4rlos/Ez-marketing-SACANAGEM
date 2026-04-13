import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACompanyProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACompanyProfile"
    ).then((m) => m.PlasmicACompanyProfile),
  { ssr: false }
);

export default function ACompanyProfile() {
  const router = useRouter();

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const { id } = router.query;

  const [viewer, setViewer] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseA.auth.getUser();
      console.log("👤 USER:", data?.user);
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD ALL
  // =========================
  useEffect(() => {
    if (!id) {
      console.log("⛔ NO ID YET");
      return;
    }

    async function loadAll() {
      console.log("🚀 LOAD ALL START", { id });

      try {
        const companyId = Number(id);

        // COMPANY
        const { data: company } = await supabaseC
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .maybeSingle();

        console.log("🏢 COMPANY:", company);

        if (!company) {
          console.log("❌ NO COMPANY FOUND");
          setFormData({});
          setLoading(false);
          return;
        }

        // =========================
        // SOLUTIONS RAW
        // =========================
        const { data: solutionsData, error: solutionsError } =
          await supabaseC
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
            .eq("Company_id", company.id);

        console.log("🧩 SOLUTIONS RAW:", solutionsData);
        console.log("⚠️ SOLUTIONS ERROR:", solutionsError);
        console.log(
          "📊 SOLUTIONS RAW LENGTH:",
          solutionsData?.length
        );

        // =========================
        // SOLUTIONS FORMAT
        // =========================
        const solutionsFormatted =
          solutionsData?.map((sol: any, index: number) => {
            console.log(`🔧 FORMAT SOLUTION [${index}] RAW:`, sol);

            const stepsSorted =
              sol.solutions_steps?.length
                ? sol.solutions_steps.sort(
                    (a: any, b: any) =>
                      (a.Step_order ?? 0) -
                      (b.Step_order ?? 0)
                  )
                : [];

            console.log(
              `📍 STEPS SORTED [${index}]:`,
              stepsSorted
            );

            const stepsMapped = stepsSorted.map((s: any) => ({
              id: s.id,
              step_text: s.step_text ?? ""
            }));

            console.log(
              `📍 STEPS MAPPED [${index}]:`,
              stepsMapped
            );

            const formatted = {
              id: sol.id,
              title: sol.Title ?? "",
              description: sol.Description ?? "",
              price: sol.Price ?? "",
              steps: stepsMapped
            };

            console.log(
              `✅ SOLUTION FORMATTED [${index}]:`,
              formatted
            );

            return formatted;
          }) ?? [];

        console.log("✅ SOLUTIONS FORMATTED FINAL:", solutionsFormatted);
        console.log(
          "📊 SOLUTIONS FORMATTED LENGTH:",
          solutionsFormatted.length
        );

        // =========================
        // FINAL OBJECT
        // =========================
        const nextFormData = {
          ...company,
          solutions: solutionsFormatted
        };

        console.log("🧠 FINAL FORMDATA:", nextFormData);
        console.log(
          "📦 FORMDATA.SOLUTIONS:",
          nextFormData.solutions
        );
        console.log(
          "📊 FORMDATA.SOLUTIONS LENGTH:",
          nextFormData.solutions?.length
        );

        setFormData(nextFormData);
      } catch (err) {
        console.error("💥 LOAD ERROR:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [id, viewer]);

  // =========================
  // RENDER DEBUG
  // =========================
  console.log("🖥️ RENDER FORMDATA:", formData);
  console.log(
    "🖥️ RENDER SOLUTIONS:",
    formData?.solutions
  );
  console.log(
    "🖥️ RENDER SOLUTIONS LENGTH:",
    formData?.solutions?.length
  );

  if (loading) return null;

  return (
    <PlasmicACompanyProfile
      args={{
        formData,
        company: formData
      }}
    />
  );
}
