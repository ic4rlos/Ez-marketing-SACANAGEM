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
      const { data, error } = await supabase.auth.getUser();
      console.log("LOG AUTH:", data?.user?.id, error);
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!id || !viewer) {
      console.log("LOG WAIT:", { id, viewer });
      return;
    }

    let mounted = true;

    async function loadAll() {
      const communityId = Number(id);
      console.log("LOG LOAD START:", communityId);

      // COMMUNITY
      const { data: community, error: communityError } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      console.log("LOG COMMUNITY:", community, communityError);

      // =========================
      // MEMBERS DEBUG
      // =========================
      const { data: membersDb, error: membersDbError } = await supabase
        .from("community_members")
        .select("*")
        .eq("community_id", communityId);

      console.log("LOG MEMBERS RAW:", membersDb, membersDbError);

      const connectedOnly = membersDb?.filter(
        (m: any) => m.status === "connected"
      );

      console.log("LOG MEMBERS CONNECTED:", connectedOnly);

      let members: any[] = [];

      if (connectedOnly?.length) {
        members = (
          await Promise.all(
            connectedOnly.map(async (m: any) => {
              console.log("LOG MEMBER LOOP:", m.user_id);

              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              console.log("LOG PROFILE:", profile);

              if (!profile) return null;

              const { data: offices } = await supabase
                .from("Multicharge")
                .select("Office")
                .eq("User profile_id", profile.id);

              console.log("LOG OFFICES:", offices);

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

      console.log("LOG MEMBERS FINAL:", members);

      // MEMBERSHIP
      const { data: membership, error: membershipError } = await supabase
        .from("community_members")
        .select("*")
        .eq("user_id", viewer.id)
        .eq("community_id", communityId)
        .maybeSingle();

      console.log("LOG MEMBERSHIP:", membership, membershipError);

      // SPECIALTIES
      const { data: specialtiesRaw } = await supabase
        .from("Community specialties")
        .select('"Professional specialty"')
        .eq("community_id", communityId);

      const specialties =
        specialtiesRaw?.map(
          (s: any) => s["Professional specialty"]
        ) ?? [];

      console.log("LOG SPECIALTIES:", specialties);

      const nextFormData = {
        ...(community ?? {}),
        members,
        membership: membership ?? null,
        specialties,
        "Short message": ""
      };

      console.log("LOG FORM DATA FINAL:", nextFormData);

      if (!mounted) return;

      setFormData(nextFormData);
      setLoading(false);

      console.log("LOG LOAD END");
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, [id, viewer]);

  // =========================
  // SAVE DEBUG
  // =========================
  async function handleSave(data: any) {
    console.log("LOG SAVE CALLED:", data);

    if (!viewer || !id) {
      console.log("LOG SAVE ABORT:", { viewer, id });
      return;
    }

    const payload = {
      user_id: viewer.id,
      community_id: Number(id),
      role: "member",
      status: "request",
      short_message:
        data?.["Short message"] ??
        data?.short_message ??
        ""
    };

    console.log("LOG PAYLOAD:", payload);

    const { data: result, error } = await supabase
      .from("community_members")
      .upsert(payload, {
        onConflict: "user_id,community_id"
      });

    console.log("LOG UPSERT RESULT:", result);
    console.log("LOG UPSERT ERROR:", error);
  }

  // =========================
  // GLOBAL DEBUG
  // =========================
  useEffect(() => {
    // @ts-ignore
    window.__FORMDATA = formData;
    console.log("LOG WINDOW FORMDATA UPDATED");
  }, [formData]);

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
