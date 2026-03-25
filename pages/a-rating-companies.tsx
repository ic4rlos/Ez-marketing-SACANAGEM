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
  const { id } = router.query; // 🔥 IDENTIDADE

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const [user, setUser] = useState<any>(undefined);
  const [company, setCompany] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
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

        // 🔥 QUAL EMPRESA CARREGAR
        let companyQuery = supabaseC.from("companies").select("*");

        if (id) {
          companyQuery = companyQuery.eq("id", id);
        } else {
          companyQuery = companyQuery.limit(1); // fallback beta
        }

        const { data: companyData } = await companyQuery.maybeSingle();

        if (!companyData) {
          setCompany(null);
          setLoading(false);
          return;
        }

        // 🔹 COMMUNITY DO USER
        const { data: member } = await supabaseA
          .from("community_members")
          .select("*")
          .eq("user_id", user?.id)
          .eq("status", "connected")
          .maybeSingle();

        const communityId = member?.community_id ?? null;

        // 🔹 REVIEWS
        const { data: reviews } = await supabaseA
          .from("community_reviews")
          .select("*")
          .eq("company_id", companyData.id);

        // =========================
        // 🔥 AGREGAÇÕES
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
        };

        setCompany(enrichedCompany);

        // =========================
        // 📊 REPORTS (POR MÊS)
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
            date: key,
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
  // ACTION (CRIAR REVIEW)
  // =========================
  async function handleSave(payload: any) {
    const { rating, comment } = payload;

    if (!rating || !user || !company) return;

    const { data: member } = await supabaseA
      .from("community_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    await supabaseA.from("community_reviews").insert({
      rating,
      comment,
      company_id: company.id,
      community_id: member?.community_id ?? null,
      author_user_id: user.id,
      author_type: "community",
    });

    // 🔥 reload com mesma identidade
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
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
