import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCRateACommunitie = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCRateACommunitie"
    ).then((m) => m.PlasmicCRateACommunitie),
  { ssr: false }
);

export default function CRateACommunitie() {
  const router = useRouter();
  const { id } = router.query;

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [companyUser, setCompanyUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);

  const [formData, setFormData] = useState<any>({});
  const [reports, setReports] = useState<any[]>([]);

  const [actualData, setActualData] = useState("");
  const [periodKey, setPeriodKey] = useState("");

  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH (C)
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseC.auth.getUser();
      setCompanyUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD ALL
  // =========================
  useEffect(() => {
    async function loadAll() {
      if (companyUser === undefined) return;
      if (!id) return;

      try {
        setLoading(true);

        const communityId = Number(id);

        // 🔥 PERÍODO
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const year = now.getFullYear();

        const firstDay = new Date(year, quarter * 3, 1);
        const lastDay = new Date(year, quarter * 3 + 3, 0);

        const format = (d: Date) =>
          d.toLocaleDateString("pt-BR");

        setActualData(`${format(firstDay)} - ${format(lastDay)}`);

        const currentKey = `${year}-Q${quarter + 1}`;
        setPeriodKey(currentKey);

        // =========================
        // COMPANY (C)
        // =========================
        const { data: companyData } = await supabaseC
          .from("companies")
          .select("*")
          .eq("user_id", companyUser?.id)
          .maybeSingle();

        if (!companyData) {
          setLoading(false);
          return;
        }

        setCompany(companyData);

        // =========================
        // COMMUNITY (A)
        // =========================
        const { data: communityData } = await supabaseA
          .from("Community")
          .select("*")
          .eq("id", communityId)
          .maybeSingle();

        // =========================
        // CONNECTION CHECK
        // =========================
        const { data: connection } = await supabaseA
          .from("CONNECTIONS")
          .select("*")
          .eq("company_id", companyData.id)
          .eq("agency_id", communityId)
          .eq("status", "connected")
          .maybeSingle();

        if (!connection) {
          console.warn("⚠️ Empresa não conectada à comunidade");
        }

        // =========================
        // REVIEWS
        // =========================
        const { data: reviews } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("community_id", communityId);

        const reviewsThisPeriod =
          reviews?.filter((r: any) => r.period_key === currentKey) ?? [];

        const avg = (list: any[]) =>
          list.length === 0
            ? 0
            : list.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              list.length;

        const count = (list: any[]) => list.length;

        const companyReviews = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "company"
        );

        const memberReviews = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "member"
        );

        // =========================
        // 🔥 FORM DATA FINAL (PADRÃO CORRETO)
        // =========================
        const enriched = {
          ...(communityData ?? {}),

          company_rate: avg(companyReviews),
          company_count: count(companyReviews),

          member_rate: avg(memberReviews),
          member_count: count(memberReviews),
        };

        setFormData(enriched);

        // =========================
        // REPORTS
        // =========================
        const grouped: any = {};

        reviews?.forEach((r: any) => {
          if (!r.period_key) return;
          if (!grouped[r.period_key]) grouped[r.period_key] = [];
          grouped[r.period_key].push(r);
        });

        const reportsFormatted = Object.keys(grouped).map((key) => {
          const list = grouped[key];

          const [y, q] = key.split("-Q");
          const qIndex = Number(q) - 1;

          const first = new Date(Number(y), qIndex * 3, 1);
          const last = new Date(Number(y), qIndex * 3 + 3, 0);

          const companyList = list.filter(
            (r: any) => r.author_type === "company"
          );

          const memberList = list.filter(
            (r: any) => r.author_type === "member"
          );

          return {
            date: `${format(first)} - ${format(last)}`,
            company: avg(companyList),
            member: avg(memberList),
          };
        });

        setReports(reportsFormatted);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [companyUser, id]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(payload: any) {
    const { rating, comment, type } = payload;

    if (!rating || !companyUser || !company || !periodKey) return;

    // CONNECTION CHECK
    const { data: connection } = await supabaseA
      .from("CONNECTIONS")
      .select("*")
      .eq("company_id", company.id)
      .eq("agency_id", Number(id))
      .eq("status", "connected")
      .maybeSingle();

    if (!connection) {
      alert("Your company is not connected to this community.");
      return;
    }

    // DUPLICATE CHECK
    const { data: existing } = await supabaseA
      .from("community_reviews")
      .select("id")
      .eq("community_id", Number(id))
      .eq("author_user_id", companyUser.id)
      .eq("author_type", type)
      .eq("period_key", periodKey)
      .maybeSingle();

    if (existing) {
      alert("You already rated this category in this period.");
      return;
    }

    const { error } = await supabaseA
      .from("community_reviews")
      .insert({
        rating: Number(rating),
        comment: comment ?? "",
        community_id: Number(id),
        company_id: company.id,
        author_user_id: companyUser.id,
        author_type: type,
        period_key: periodKey,
      });

    if (error) {
      console.error(error);
      alert("Error saving rating.");
      return;
    }

    router.replace(router.asPath);
  }

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  if (companyUser === undefined) return null;
  if (loading) return null;

  return (
    <PlasmicCRateACommunitie
      args={{
        formData: formData ?? {}, // ✅ CORRETO
        reports: reports ?? [],
        actualData: actualData,
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
