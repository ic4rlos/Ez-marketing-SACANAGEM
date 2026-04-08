import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicARatingCompanies = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicARatingCompanies"
    ).then((m) => m.PlasmicARatingCompanies),
  { ssr: false }
);

export default function ARatingCompanies() {
  const router = useRouter();
  const { id } = router.query;

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [actualData, setActualData] = useState("");
  const [periodKey, setPeriodKey] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseA.auth.getUser();
      setUser(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD ALL
  // =========================
  useEffect(() => {
    async function loadAll() {
      if (user === undefined) return;

      try {
        setLoading(true);

        // =========================
        // 🔥 PERÍODO TRIMESTRAL + KEY
        // =========================
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const year = now.getFullYear();

        const firstDay = new Date(year, quarter * 3, 1);
        const lastDay = new Date(year, quarter * 3 + 3, 0);

        const format = (date: Date) =>
          date.toLocaleDateString("pt-BR");

        setActualData(`${format(firstDay)} - ${format(lastDay)}`);

        const currentPeriodKey = `${year}-Q${quarter + 1}`;
        setPeriodKey(currentPeriodKey);

        // =========================
        // COMPANY
        // =========================
        let companyQuery = supabaseC.from("companies").select("*");

        if (id) {
          companyQuery = companyQuery.eq("id", id);
        } else {
          companyQuery = companyQuery.limit(1);
        }

        const { data: companyData } = await companyQuery.maybeSingle();
// 🔥 LOGGED USER PROFILE PIC
const { data: loggedProfile } = await supabaseA
  .from("User profile")
  .select("*")
  .eq("user_id", user.id)
  .maybeSingle();
        if (!companyData) {
          setCompany(null);
          setLoading(false);
          return;
        }

        // COMMUNITY
        const { data: member } = await supabaseA
          .from("community_members")
          .select("*")
          .eq("user_id", user?.id)
          .eq("status", "connected")
          .maybeSingle();

        const communityId = member?.community_id ?? null;

        // REVIEWS
        const { data: reviews } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", companyData.id);

        // =========================
        // 🔥 FILTRO PERÍODO ATUAL
        // =========================
        const reviewsThisPeriod =
          reviews?.filter((r: any) => r.period_key === currentPeriodKey) ?? [];

        // =========================
        // AGREGAÇÕES
        // =========================
        const avg = (list: any[]) =>
          list.length === 0
            ? 0
            : list.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              list.length;

        const count = (list: any[]) => list.length;
// 🔥 TODAS avaliações (histórico completo)
const allCommunityReviews = reviews?.filter(
  (r: any) => r.author_type === "community"
) ?? [];
        const communityReviews = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "community"
        );

        const companyReviews = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "company"
        );

        const customerReviews = reviewsThisPeriod.filter(
          (r: any) =>
            r.author_type === "customer" &&
            (!communityId || r.community_id === communityId)
        );

        // =========================
        // ÚLTIMA AVALIAÇÃO
        // =========================
        const { data: lastReview } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", companyData.id)
          .eq("author_user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const enrichedCompany = {
          ...companyData,
logged_profile_pic: loggedProfile?.["Profile pic"] ?? null,
average_rate: avg(allCommunityReviews), // 🔥 histórico total
rate_sum: count(allCommunityReviews),   // 🔥 histórico total

          company_rated: avg(companyReviews),
          rate_sum_2: count(companyReviews),

          customer_rated: avg(customerReviews),
          rate_sum_3: count(customerReviews),

          last_user_rating: lastReview?.rating ?? 0,
        };

        setCompany(enrichedCompany);

        // =========================
        // 🔥 REPORTS FORMATADOS
        // =========================
        const grouped: any = {};

        reviews?.forEach((r: any) => {
          if (!r.period_key) return;

          if (!grouped[r.period_key]) grouped[r.period_key] = [];
          grouped[r.period_key].push(r);
        });

        const reportsFormatted = Object.keys(grouped).map((key) => {
          const list = grouped[key];

          const community = list.filter(
            (r: any) => r.author_type === "community"
          );
          const company = list.filter(
            (r: any) => r.author_type === "company"
          );
          const customer = list.filter(
            (r: any) => r.author_type === "customer"
          );

          // 🔥 CONVERTE Q → DATA BONITA
          const [yearStr, quarterStr] = key.split("-Q");
          const yearNum = Number(yearStr);
          const quarterNum = Number(quarterStr) - 1;

          const first = new Date(yearNum, quarterNum * 3, 1);
          const last = new Date(yearNum, quarterNum * 3 + 3, 0);

          return {
            date: `${format(first)} - ${format(last)}`,
            company_rate: avg(community),
            customer_instruction: avg(company),
            average_rating_received: avg(customer),
          };
        });

        setReports(reportsFormatted);
      } catch (err) {
        console.error("Load error:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [user, id]);

  // =========================
  // ACTION
  // =========================
  async function handleSave(payload: any) {
    const { rating, comment } = payload;

    if (!rating || !user || !company || !periodKey) return;

    const { data: existing } = await supabaseA
      .from("community_reviews")
      .select("id")
      .eq("company_id", company.id)
      .eq("author_user_id", user.id)
      .eq("period_key", periodKey)
      .maybeSingle();

    if (existing) {
      alert("You have already rated this company during this period.");
      return;
    }

    const { data: member } = await supabaseA
      .from("community_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = await supabaseA.from("community_reviews").insert({
      rating: Number(rating),
      comment: comment ?? "",
      company_id: company.id,
      community_id: member?.community_id ?? null,
      author_user_id: user.id,
      author_type: "community",
      period_key: periodKey,
    });

    if (error) {
      alert("Error saving your rating.");
      console.error(error);
      return;
    }

    router.replace(router.asPath);
  }

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabaseA.auth.signOut();
    router.replace("/");
  }

  if (user === undefined) return null;
  if (loading) return null;

  return (
    <PlasmicARatingCompanies
      args={{
        company: company ?? {},
        reports: reports ?? [],
        actualData: actualData,
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
