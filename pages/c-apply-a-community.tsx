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
    ).then((m) => m.PlasmicCApplyACommunity),
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
        .select("*")
        .eq("user_id", companyUser.id)
        .maybeSingle();

      setCompany(companyData ?? null);

      // 🔹 COMMUNITY (A)
      const { data: community } = await supabaseA
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      // 🔹 MEMBERS (igual ao original)
      const { data: membersDb } = await supabaseA
        .from("community_members")
        .select("user_id, status")
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
                return [
                  {
                    "Profile pic": profile?.["Profile pic"] ?? null,
                    Office: "Member",
                  },
                ];
              }

              return offices.map((o: any) => ({
                "Profile pic": profile?.["Profile pic"] ?? null,
                Office: o.Office,
              }));
            })
          )
        )
          .flat()
          .filter(Boolean);
      }

      // 🔹 CONNECTION (em vez de membership)
      const { data: connection } = await supabaseA
        .from("CONNECTIONS")
        .select("*")
        .eq("company_id", companyData?.id)
        .eq("agency_id", communityId)
        .maybeSingle();

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
        connection: connection ?? null,
        specialties,
        "Short message": "",
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
  // SAVE (diferença crítica)
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
