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

  const [loading, setLoading] = useState(true);

  // containers
  const [tableCustomer, setTableCustomer] = useState<any[]>([]);
  const [tableCompany, setTableCompany] = useState<any[]>([]);
  const [analysisCustomer, setAnalysisCustomer] = useState<any[]>([]);
  const [analysisCompany, setAnalysisCompany] = useState<any[]>([]);

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
      // empresa logada
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

      // ORDERS
      const { data: orders } = await supabaseA
        .from("orders")
        .select("*")
        .eq("company_id", companyData.id);

      if (!orders?.length) {
        setLoading(false);
        return;
      }

      // pegar solutions
      const solutionIds = Array.from(
        new Set(orders.map((o: any) => o.solution_id))
      );

      const { data: solutions } = await supabaseC
        .from("solutions")
        .select("id, Title")
        .in("id", solutionIds);

      const solutionMap: any = {};
      solutions?.forEach((s: any) => {
        solutionMap[s.id] = s;
      });

      // pegar communities
      const communityIds = Array.from(
        new Set(orders.map((o: any) => o.community_id))
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
      // FORMAT + CLASSIFY
      // =========================

      const tCustomer: any[] = [];
      const tCompany: any[] = [];
      const aCustomer: any[] = [];
      const aCompany: any[] = [];

      orders.forEach((o: any) => {
        const solution = solutionMap[o.solution_id];
        const community = communityMap[o.community_id];

        const item = {
          id: o.id,
          solution: solution?.Title ?? "",
          community: community?.community_name ?? "",
          created_at: o.created_at,
          address: o.address,
          scheduled: o.scheduled_at,
          estimated_time: o.estimated_time_minutes,
          price: o.price,
          status: o.current_status
        };

        const status = o.current_status ?? "";

        // 🔥 CLASSIFICAÇÃO INICIAL (SIMPLIFICADA)
        if (status.includes("Proposal") || status.includes("3")) {
          aCustomer.push(item);
        } else if (status.includes("2") || status.includes("4")) {
          aCompany.push(item);
        } else if (status.includes("Waiting") || status.includes("Customer")) {
          tCustomer.push(item);
        } else {
          tCompany.push(item);
        }
      });

      setTableCustomer(tCustomer);
      setTableCompany(tCompany);
      setAnalysisCustomer(aCustomer);
      setAnalysisCompany(aCompany);

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

    // exemplos iniciais
    if (action === "confirm_eta") {
      newStatus = "Waiting locomotion";
    }

    if (action === "cancel") {
      newStatus = "Customer Canceled";
    }

    if (action === "on_way") {
      newStatus = "Waiting customer";
    }

    if (action === "trouble_address") {
      newStatus = "Trouble with Address?";
    }

    if (!newStatus) return;

    // update order
    await supabaseA
      .from("orders")
      .update({
        current_status: newStatus,
        estimated_time_minutes: data?.estimated_time ?? null
      })
      .eq("id", orderId);

    // log
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
        table_customer: tableCustomer.length ? tableCustomer : [{}],
        table_company: tableCompany.length ? tableCompany : [{}],
        analysis_customer: analysisCustomer.length ? analysisCustomer : [{}],
        analysis_company: analysisCompany.length ? analysisCompany : [{}],
        onSave
      }}
    />
  );
}
