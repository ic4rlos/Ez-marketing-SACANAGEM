import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicAApplyToACommunity = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicAApplyToACommunity"
    ).then((m) => m.PlasmicAApplyToACommunity),
  { ssr: false }
);

export default function AApplyToACommunity() {
  const router = useRouter();
  const supabase = getSupabaseA();
  const { id } = router.query;

  const [viewer, setViewer] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [avatarFiles, setAvatarFiles] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // REDIRECT se já tem comunidade
  // =========================
  useEffect(() => {
    if (!viewer) return;

    async function checkExistingCommunity() {
      const { data } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", viewer.id)
        .eq("status", "connected")
        .maybeSingle();

      if (data?.community_id) {
        router.replace("/a-community-dashboard");
      }
    }

    checkExistingCommunity();
  }, [viewer]);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!id || !viewer) return;

    let mounted = true;

    async function loadAll() {
      const communityId = Number(id);

      // COMMUNITY
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      // =========================
      // MEMBERS
      // =========================
      const { data: membersDb } = await supabase
        .from("community_members")
        .select("user_id, status")
        .eq("community_id", communityId)
        .eq("status", "connected");

      let members: any[] = [];

      if (membersDb?.length) {
        members = (
          await Promise.all(
            membersDb.map(async (m: any) => {
              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic"')
                .eq("user_id", m.user_id)
                .maybeSingle();

              let offices: any[] = [];

              if (profile?.id) {
                const { data } = await supabase
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

      // =========================
      // MEMBERSHIP
      // =========================
      const { data: membership } = await supabase
        .from("community_members")
        .select("*")
        .eq("user_id", viewer.id)
        .eq("community_id", communityId)
        .maybeSingle();

      // =========================
      // SPECIALTIES
      // =========================
      const { data: specialtiesRaw } = await supabase
        .from("Community specialties")
        .select('"Professional specialty"')
        .eq("community_id", communityId);

      const specialties =
        specialtiesRaw?.map(
          (s: any) => s["Professional specialty"]
        ) ?? [];

      // =========================
      // CONNECTED COMPANIES
      // =========================
      const { data: companiesRaw } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", viewer.id);

      let connected_companies: any[] = [];

      if (companiesRaw?.length) {
        connected_companies = (
          await Promise.all(
            companiesRaw.map(async (c: any) => {
              const { data: company } = await supabase
                .from("Company")
                .select('id, "Company Logo", "Company name", average_rate, rate_sum')
                .eq("id", c.company_id)
                .maybeSingle();

              if (!company) return null;

              return {
                "Company Logo": company["Company Logo"],
                "Company name": company["Company name"],
                average_rate: company.average_rate ?? 0,
                rate_sum: company.rate_sum ?? 0
              };
            })
          )
        ).filter(Boolean);
      }

      // =========================
      // FINAL FORMDATA
      // =========================
      const nextFormData = {
        ...(community ?? {}),
        members,
        membership: membership ?? null,
        specialties,
        connected_companies,
        average_rate: community?.average_rate ?? 0,
        rate_sum: community?.rate_sum ?? 0,
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
  }, [id, viewer]);

  // =========================
  // SAVE
  // =========================
  async function handleSave(data: any) {
    if (!viewer || !id) return;

    await supabase
      .from("community_members")
      .insert({
        user_id: viewer.id,
        community_id: Number(id),
        role: "member",
        status: "request",
        short_message:
          data?.["Short message"] ??
          data?.short_message ??
          ""
      });
  }

  if (loading) return null;

  return (
    <PlasmicAApplyToACommunity
      args={{
        formData,
        setFormData,
        avatarFiles,
        onAvatarFilesChange: setAvatarFiles,
        onSave: handleSave
      }}
    />
  );
}
