import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
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
  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();
  const router = useRouter();

  const [companyUser, setCompanyUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
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
  // LOAD
  // =========================
  useEffect(() => {
    if (!companyUser) return;

    async function loadAll() {
      // empresa
      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", companyUser.id)
        .maybeSingle();

      if (!companyData) {
        setLoading(false);
        return;
      }

      setCompany(companyData);

      // orders
      const { data: ordersDb } = await supabaseA
        .from("orders")
        .select("*")
        .eq("company_id", companyData.id);

      if (!ordersDb?.length) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // solutions
      const solutionIds = Array.from(
        new Set(ordersDb.map((o: any) => o.solution_id))
      );

      const { data: solutions } = await supabaseC
        .from("solutions")
        .select('id, Title, "Solution nature"')
        .in("id", solutionIds);

      const solutionMap: any = {};
      solutions?.forEach((s: any) => {
        solutionMap[s.id] = s;
      });

      // communities
      const communityIds = Array.from(
        new Set(ordersDb.map((o: any) => o.community_id))
      );

      const { data: communities } = await supabaseA
        .from("Community")
        .select("id, community_name")
        .in("id", communityIds);

      const communityMap: any = {};
      communities?.forEach((c: any) => {
        communityMap[c.id] = c;
      });

      // =========================
      // FORMAT (UMA LISTA ÚNICA)
      // =========================

      const formatted = ordersDb.map((o: any) => {
        const solution = solutionMap[o.solution_id];
        const community = communityMap[o.community_id];

        return {
          id: o.id,
          solution: solution?.Title ?? "",
          community: community?.community_name ?? "",
          created_at: o.created_at,
          address: o.address,
          scheduled: o.scheduled_at,
          estimated_time: o.estimated_time_minutes,
          price: o.price,

          // 🔥 CRÍTICO
          current_status: o.current_status,

          // 🔥 CRÍTICO (nature vem da solution)
          solution_nature: solution?.["Solution nature"] ?? ""
        };
      });

      setOrders(formatted);
      setLoading(false);
    }

    loadAll();
  }, [companyUser]);

  // =========================
  // ACTION ENGINE
  // =========================
  async function onSave(data: any) {
    const orderId = data?.orderId;
    const action = data?.action;

    if (!orderId || !action) return;

    let newStatus = null;

    if (action === "confirm_eta") newStatus = "Waiting locomotion";
    if (action === "cancel") newStatus = "Customer Canceled";
    if (action === "on_way") newStatus = "Waiting customer";
    if (action === "trouble_address") newStatus = "Trouble with Address?";

    if (!newStatus) return;

    await supabaseA
      .from("orders")
      .update({
        current_status: newStatus,
        estimated_time_minutes: data?.estimated_time ?? null
      })
      .eq("id", orderId);

    await supabaseA.from("order_events").insert({
      order_id: orderId,
      event_type: newStatus,
      triggered_by: "company"
    });

    router.reload();
  }

  if (loading) return null;

  return (
    <PlasmicCServiceDashboard
      args={{
        company, // 🔥 AGORA FUNCIONA O VISIBILITY
        orders: orders.length ? orders : [{}],
        onSave
      }}
    />
  );
}
