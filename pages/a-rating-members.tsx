import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicARatingMembers = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicARatingMembers"
    ).then((m) => m.PlasmicARatingMembers),
  { ssr: false }
);

export default function ARatingMembers() {
  const router = useRouter();
  const { id } = router.query;

  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(undefined);
  const [member, setMember] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [actualData, setActualData] = useState("");
  const [periodKey, setPeriodKey] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
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
        const year = now.getFullYear();

        const firstDay = new Date(year, quarter * 3, 1);
        const lastDay = new Date(year, quarter * 3 + 3, 0);

        const format = (d: Date) => d.toLocaleDateString("pt-BR");

        setActualData(`${format(firstDay)} - ${format(lastDay)}`);

        const currentPeriodKey = `${year}-Q${quarter + 1}`;
        setPeriodKey(currentPeriodKey);

        // =========================
        // MEMBER PROFILE
        // =========================
        const { data: profile } = await supabase
          .from("User profile")
          .select("*")
          .eq("user_id", id)
          .maybeSingle();

        if (!profile) {
          setMember(null);
          setLoading(false);
          return;
        }

        // =========================
        // COMMUNITY DO USER LOGADO
        // =========================
        const { data: memberConn } = await supabase
          .from("community_members")
          .select("*")
          .eq("user_id", user?.id)
          .eq("status", "connected")
          .maybeSingle();

        const communityId = memberConn?.community_id ?? null;

        // =========================
        // REVIEWS
        // =========================
        const { data: reviews } = await supabase
          .from("community_reviews")
          .select("*")
          .eq("member_id", profile.id);

        // =========================
        // 🔥 FILTRO PERÍODO ATUAL
        // =========================
        const reviewsThisPeriod =
          reviews?.filter((r: any) => r.period_key === currentPeriodKey) ?? [];

        const avg = (list: any[]) =>
          list.length === 0
            ? 0
            : list.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              list.length;

        const count = (list: any[]) => list.length;

        const ethics = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "community ethics"
        );

        const technical = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "community technical"
        );

        const memberRated = reviewsThisPeriod.filter(
          (r: any) => r.author_type === "member"
        );

        const enrichedMember = {
          ...profile,

          ethics_rate: avg(ethics),
          ethics_count: count(ethics),

          technical_rate: avg(technical),
          technical_count: count(technical),

          member_rated: avg(memberRated),
        };

        setMember(enrichedMember);

        // =========================
        // 🔥 REPORTS POR TRIMESTRE
        // =========================
        const grouped: any = {};

        reviews?.forEach((r: any) => {
          if (!r.period_key) return;

          if (!grouped[r.period_key]) grouped[r.period_key] = [];
          grouped[r.period_key].push(r);
        });

        const reportsFormatted = Object.keys(grouped).map((key) => {
          const list = grouped[key];

          const sample = list[0];
          const [y, q] = key.split("-Q");
          const qIndex = Number(q) - 1;

          const first = new Date(Number(y), qIndex * 3, 1);
          const last = new Date(Number(y), qIndex * 3 + 3, 0);

          const ethics = list.filter(
            (r: any) => r.author_type === "community ethics"
          );

          const technical = list.filter(
            (r: any) => r.author_type === "community technical"
          );

          const memberRated = list.filter(
            (r: any) => r.author_type === "member"
          );

          return {
            date: `${format(first)} - ${format(last)}`,
            ethics: avg(ethics),
            technical: avg(technical),
            member: avg(memberRated),
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
  // ACTION (COM BLOQUEIO)
  // =========================
  async function handleSave(payload: any) {
    const { rating, comment, type } = payload;

    if (!rating || !user || !member || !periodKey) return;

    const { data: existing } = await supabase
      .from("community_reviews")
      .select("id")
      .eq("member_id", member.id)
      .eq("author_user_id", user.id)
      .eq("author_type", type)
      .eq("period_key", periodKey)
      .maybeSingle();

    if (existing) {
      alert("You already rated this member in this period.");
      return;
    }

    const { data: memberConn } = await supabase
      .from("community_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = await supabase.from("community_reviews").insert({
      rating: Number(rating),
      comment: comment ?? "",
      member_id: member.id,
      community_id: memberConn?.community_id ?? null,
      author_user_id: user.id,
      author_type: type,
      period_key: periodKey,
    });

    if (error) {
      alert("Error saving rating.");
      console.error(error);
      return;
    }

    router.replace(router.asPath);
  }

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (user === undefined) return null;
  if (loading) return null;

  return (
    <PlasmicARatingMembers
      args={{
        member: member ?? {},
        reports: reports ?? [],
        actualData: actualData,
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
