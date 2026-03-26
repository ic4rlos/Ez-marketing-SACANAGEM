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
  const [periodRange, setPeriodRange] = useState<any>(null);
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
        // 🔥 PERÍODO TRIMESTRAL
        // =========================
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);

        const firstDay = new Date(now.getFullYear(), quarter * 3, 1);
        const lastDay = new Date(now.getFullYear(), quarter * 3 + 3, 0);

        const format = (date: Date) =>
          date.toLocaleDateString("pt-BR");

        setActualData(`${format(firstDay)} - ${format(lastDay)}`);
        setPeriodRange({ firstDay, lastDay });

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
        // ÚLTIMA AVALIAÇÃO DO USER
        // =========================
        const { data: lastReview } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", companyData.id)
          .eq("author_user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // =========================
        // AGREGAÇÕES
        // =========================
        const filterBy = (type: string) =>
          reviews?.filter((r: any) => r.author_type === type) ?? [];

        const avg = (list: any[]) =>
          list.length === 0
            ? 0
            : list.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              list.length;

        const count = (list: any[]) => list.length;

        const communityReviews = filterBy("community");
        const companyReviews = filterBy("company");

        const customerReviews =
          reviews?.filter(
            (r: any) =>
              r.author_type === "customer" &&
              (!communityId || r.community_id === communityId)
          ) ?? [];

        const enrichedCompany = {
          ...companyData,

          average_rate: avg(communityReviews),
          rate_sum: count(communityReviews),

          company_rated: avg(companyReviews),
          rate_sum_2: count(companyReviews),

          customer_rated: avg(customerReviews),
          rate_sum_3: count(customerReviews),

          last_user_rating: lastReview?.rating ?? 0, // 🔥 NOVO
        };

        setCompany(enrichedCompany);

        // =========================
        // REPORTS
        // =========================
        const grouped: any = {};

        reviews?.forEach((r: any) => {
          const date = new Date(r.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;

          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(r);
        });

        const monthlyReports = Object.keys(grouped).map((key) => {
          const list = grouped[key];

          const sampleDate = new Date(list[0].created_at);

          const first = new Date(
            sampleDate.getFullYear(),
            sampleDate.getMonth(),
            1
          );

          const last = new Date(
            sampleDate.getFullYear(),
            sampleDate.getMonth() + 1,
            0
          );

          const community = list.filter(
            (r: any) => r.author_type === "community"
          );
          const company = list.filter(
            (r: any) => r.author_type === "company"
          );
          const customer = list.filter(
            (r: any) => r.author_type === "customer"
          );

          return {
            date: `${format(first)} - ${format(last)}`,
            company_rate: avg(community),
            customer_instruction: avg(company),
            average_rating_received: avg(customer),
          };
        });

        setReports(monthlyReports);
      } catch (err) {
        console.error("Load error:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [user, id]);

  // =========================
  // ACTION (COM BLOQUEIO)
  // =========================
  async function handleSave(payload: any) {
    const { rating, comment } = payload;

    if (!rating || !user || !company || !periodRange) return;

    const { firstDay, lastDay } = periodRange;

    // 🚨 BLOQUEIO POR PERÍODO
    const { data: existing } = await supabaseA
      .from("community_reviews")
      .select("id")
      .eq("company_id", company.id)
      .eq("author_user_id", user.id)
      .gte("created_at", firstDay.toISOString())
      .lte("created_at", lastDay.toISOString())
      .maybeSingle();

    if (existing) {
      console.log("⚠️ Já avaliou nesse período");
      return;
    }

    const { data: member } = await supabaseA
      .from("community_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    await supabaseA.from("community_reviews").insert({
      rating: Number(rating), // 🔥 CORREÇÃO
      comment: comment ?? "",
      company_id: company.id,
      community_id: member?.community_id ?? null,
      author_user_id: user.id,
      author_type: "community",
    });

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
