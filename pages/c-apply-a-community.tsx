import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicCApplyACommunity = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicCApplyToACommunity"
    ).then((m) => m.PlasmicCApplyToACommunity),
  { ssr: false }
);

export default function CApplyACommunity() {
  const router = useRouter();

  const supabaseA = getSupabaseA();
  const supabaseC = getSupabaseC();

  const { id } = router.query;

  const [companyUser, setCompanyUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  const [formData, setFormData] = useState<any>({});
  const [avatarFiles, setAvatarFiles] = useState<any>(null);
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
  // LOAD
  // =========================
  useEffect(() => {
    if (!id || !companyUser) return;

    let mounted = true;

    async function loadAll() {
      const communityId = Number(id);

      // 🔹 COMPANY (C)
      const { data: companyData } = await supabaseC
        .from("companies")
        .select('*')
        .eq("user_id", companyUser.id)
        .maybeSingle();

      setCompany(companyData ?? null);

      // 🔥 CONNECTION (ESSENCIAL)
      const { data: connection } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData?.id)
        .eq("agency_id", communityId)
        .maybeSingle();

      const isConnected = connection?.status === "connected";

      // 🔹 COMMUNITY (A)
      const { data: community } = await supabaseA
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      // 🔹 MEMBERS
      const { data: membersDb } = await supabaseA
        .from("community_members")
        .select("user_id")
        .eq("community_id", communityId)
        .eq("status", "connected");

      let members: any[] = [];

      if (membersDb?.length) {
        members = (
          await Promise.all(
            membersDb.map(async (m: any) => {
              const { data: profile } = await supabaseA
                .from("User profile")
                .select('id, "Profile pic"')
                .eq("user_id", m.user_id)
                .maybeSingle();

              let offices: any[] = [];

              if (profile?.id) {
                const { data } = await supabaseA
                  .from("Multicharge")
                  .select("Office")
                  .eq("User profile_id", profile.id);

                offices = data ?? [];
              }

              if (!offices.length) {
                return [{
                  "Profile pic": profile?.["Profile pic"] ?? null,
                  Office: "Member"
                }];
              }

              return offices.map((o: any) => ({
                "Profile pic": profile?.["Profile pic"] ?? null,
                Office: o.Office
              }));
            })
          )
        ).flat().filter(Boolean);
      }

      // 🔹 CONNECTED COMPANIES
      const { data: connections } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId)
        .eq("status", "connected");

      let connectedCompanies: any[] = [];

      if (connections?.length) {
        const companyIds = connections.map((c: any) => c.company_id);

        const { data: companies } = await supabaseC
          .from("companies")
          .select('id, "Company Logo", "Company name"')
          .in("id", companyIds);

        connectedCompanies = connections.map((conn: any) => {
          const comp = companies?.find(
            (c: any) => Number(c.id) === Number(conn.company_id)
          );

          return {
            "Company Logo": comp?.["Company Logo"] ?? "",
            "Company name": comp?.["Company name"] ?? ""
          };
        });
      }

      // 🔹 REVIEWS
      const { data: reviews } = await supabaseA
        .from("community_reviews")
        .select("rating, author_type")
        .eq("community_id", communityId)
        .eq("author_type", "company");

      const validReviews = reviews ?? [];

      const rate_sum = validReviews.length;

      const average_rate =
        rate_sum > 0
          ? validReviews.reduce(
              (acc: number, r: any) => acc + Number(r.rating || 0),
              0
            ) / rate_sum
          : 0;

      // 🔹 SPECIALTIES
      const { data: specialtiesRaw } = await supabaseA
        .from("Community specialties")
        .select('"Professional specialty"')
        .eq("community_id", communityId);

      const specialties =
        specialtiesRaw?.map(
          (s: any) => s["Professional specialty"]
        ) ?? [];

      const nextFormData = {
        ...(community ?? {}),
        members,
        connected_companies: connectedCompanies,
        specialties,
        rate_sum,
        average_rate,
        connection: connection ?? null, // 🔥 necessário
        isConnected, // 🔥 use isso no Plasmic
        "Company Logo": companyData?.["Company Logo"] ?? "",
        "Short message": ""
      };

      if (!mounted) return;

      setFormData(nextFormData);
      setLoading(false);
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, [id, companyUser]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(data: any) {
    if (!companyUser || !id || !company) return;

    await supabaseA
      .from("CONNECTIONS")
      .insert({
        created_by_user_id: companyUser.id,
        company_id: company.id,
        agency_id: Number(id),
        status: "company request",
        short_message:
          data?.["Short message"] ??
          data?.short_message ??
          "",
      });
  }

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    await supabaseC.auth.signOut();
    router.replace("/");
  }

  if (loading) return null;

  return (
    <PlasmicCApplyACommunity
      args={{
        formData,
        setFormData,
        avatarFiles,
        onAvatarFilesChange: setAvatarFiles,
        onSave: handleSave,
        onLogout: handleLogout,
      }}
    />
  );
}
