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
  const [formData, setFormData] = useState<any>(null);
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
      if (!id) return;

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
        // PROFILE
        // =========================
        const { data: profile } = await supabase
          .from("User profile")
          .select("*")
          .eq("user_id", id)
          .maybeSingle();
// 🔥 LOGGED USER PROFILE PIC
const { data: loggedProfile } = await supabase
  .from("User profile")
  .select("*")
  .eq("user_id", user.id)
  .maybeSingle();
        if (!profile) {
          setFormData(null);
          setLoading(false);
          return;
        }

        // =========================
        // 🔥 MULTICHARGE (OFFICES)
        // =========================
        const { data: officesDb } = await supabase
          .from("Multicharge")
          .select("*")
          .eq("User profile_id", profile.id);

        const offices =
          officesDb?.map((o: any) => ({
            Offices: o.Office,
          })) ?? [];

        // =========================
        // COMMUNITY (CORRIGIDO)
        // =========================
        const { data: memberConn } = await supabase
          .from("community_members")
          .select("*")
          .eq("user_id", id) // ✅ CORRETO
          .eq("status", "connected")
          .maybeSingle();

        let communityLogo = null;

        if (memberConn?.community_id) {
          const { data: community } = await supabase
            .from("Community")
            .select("*")
            .eq("id", memberConn.community_id)
            .maybeSingle();

          communityLogo = community?.community_logo ?? null;
        }

        // =========================
        // REVIEWS
        // =========================
        const { data: reviews } = await supabase
          .from("community_reviews")
          .select("*")
          .eq("member_id", profile.id);

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

        // =========================
        // FORM DATA FINAL
        // =========================
        const enriched = {
          ...profile,
          // 🔥 AGE (PADRÃO PROFILE)
let age = null;

if (profile.Birthday) {
  const birth = new Date(profile.Birthday);
  const today = new Date();

  age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }
}

Age: age,
logged_profile_pic: loggedProfile?.["Profile pic"] ?? null,
          community_logo: communityLogo,

          offices, // ✅ ADICIONADO

          ethics_rate: avg(ethics),
          ethics_count: count(ethics),

          technical_rate: avg(technical),
          technical_count: count(technical),

          member_rated: avg(memberRated),
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
        console.error("LOAD ERROR:", err);
      }

      setLoading(false);
    }

    loadAll();
  }, [user, id]);

  // =========================
  // ACTION
  // =========================
  async function handleSave(payload: any) {
    let { rating, comment, type } = payload;

    // 🔥 CORREÇÃO CRÍTICA
    if (rating === undefined || rating === null) return;
    if (!user || !formData || !periodKey) return;

    const safeType = type?.trim();

    const { data: existing } = await supabase
      .from("community_reviews")
      .select("id")
      .eq("member_id", formData.id)
      .eq("author_user_id", user.id)
      .eq("author_type", safeType)
      .eq("period_key", periodKey)
      .maybeSingle();

    if (existing) {
      alert("You already rated this category in this period.");
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
      member_id: formData.id,
      community_id: memberConn?.community_id ?? null,
      author_user_id: user.id,
      author_type: safeType,
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
        formData: formData ?? {},
        reports: reports ?? [],
        actualData: actualData,
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
