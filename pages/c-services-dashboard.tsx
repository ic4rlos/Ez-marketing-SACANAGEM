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
  const [solutionsData, setSolutionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSolution, setSelectedSolution] = useState<any>("all");
  const [period, setPeriod] = useState<number>(7);

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
      const { data: companyData } = await supabaseC
        .from("companies")
        .select("*")
        .eq("user_id", companyUser.id)
        .maybeSingle();

      if (!companyData) {
        setLoading(false);
        return;
      }

      // 🔥 MAPEAMENTO PRA PLASMIC
      const mappedCompany = {
        ...companyData,
        "Company Logo": companyData.company_logo,
        "Company nature": companyData.company_nature,
        "Company name": companyData.name
      };

      setCompany(mappedCompany);

      // solutions
      const { data: solutions } = await supabaseC
        .from("solutions")
        .select("id, Title")
        .eq("company_id", companyData.id);

      setSolutionsData(solutions || []);

      // orders
      const { data: ordersDb } = await supabaseA
        .from("orders")
        .select("*")
        .eq("company_id", companyData.id);

      if (!ordersDb) {
        setOrders([]);
        setLoading(false);
        return;
      }

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

      const formatted = ordersDb.map((o: any) => ({
        id: o.id,
        solution_id: o.solution_id,
        community: communityMap[o.community_id]?.community_name ?? "",
        created_at: o.created_at,
        address: o.address,
        scheduled: o.scheduled_at,
        estimated_time: o.estimated_time_minutes,
        price: o.price,
        current_status: o.current_status
      }));

      setOrders(formatted);
      setLoading(false);
    }

    loadAll();
  }, [companyUser]);

  // =========================
  // FILTER ENGINE
  // =========================
  function getFilteredOrders() {
    const now = new Date();

    return orders.filter((o) => {
      const created = new Date(o.created_at);
      const diffDays =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays > period) return false;

      if (
        selectedSolution !== "all" &&
        o.solution_id !== selectedSolution
      )
        return false;

      return true;
    });
  }

  // =========================
  // ACTION
  // =========================
  async function onSave(data: any) {
    const orderId = data?.orderId;
    const action = data?.action;

    if (!orderId || !action) return;

    let newStatus = null;

    if (action === "confirm_eta") newStatus = "Waiting locomotion";
    if (action === "cancel") newStatus = "Customer Canceled";
    if (action === "on_way") newStatus = "Waiting customer";
    if (action === "trouble_address")
      newStatus = "Trouble with Address?";

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
        company,
        orders: getFilteredOrders().length ? getFilteredOrders() : [{}],
        solutionsData,
        selectedSolution,
        setSelectedSolution,
        period,
        setPeriod,
        onSave
      }}
    />
  );
}
