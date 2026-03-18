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
      // MEMBERS (FORMATO DASHBOARD)
      // =========================
      const { data: membersDb } = await supabase
        .from("community_members")
        .select("user_id")
        .eq("community_id", communityId)
        .eq("status", "connected");

      let members: any[] = [];

      if (membersDb?.length) {
        members = (
          await Promise.all(
            membersDb.map(async (m: any) => {
              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              if (!profile) return null;

              const { data: offices } = await supabase
                .from("Multicharge")
                .select("Office")
                .eq("User profile_id", profile.id);

              if (!offices) return null;

              return offices.map((o: any) => ({
                "Profile pic": profile["Profile pic"],
                Office: o.Office
              }));
            })
          )
        )
          .flat()
          .filter(Boolean);
      }

      // MEMBERSHIP
      const { data: membership } = await supabase
        .from("community_members")
        .select("*")
        .eq("user_id", viewer.id)
        .eq("community_id", communityId)
        .maybeSingle();

      // =========================
      // SPECIALTIES (READ ONLY)
      // =========================
      const { data: specialtiesRaw } = await supabase
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
        membership: membership ?? null,
        specialties,
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
      .upsert(
        {
          user_id: viewer.id,
          community_id: Number(id),
          role: "member",
          status: "request",
          short_message:
            data?.["Short message"] ??
            data?.short_message ??
            ""
        },
        {
          onConflict: "user_id,community_id"
        }
      );
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
