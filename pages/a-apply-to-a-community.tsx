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
      console.log("LOG: AUTH user:", data?.user?.id, "error:", error);
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD → formData (FLATTEN)
  // =========================
  useEffect(() => {
    if (!id || !viewer) {
      console.log("LOG: WAITING id/viewer", { id, viewer });
      return;
    }

    let mounted = true;

    async function loadAll() {
      try {
        const communityId = Number(id);
        console.log("LOG: LOAD START", { communityId });

        // COMMUNITY
        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .eq("id", communityId)
          .maybeSingle();

        console.log("LOG: COMMUNITY", communityData, communityError);

        // MEMBERS
        const { data: membersData, error: membersError } = await supabase
          .from("community_members")
          .select("*")
          .eq("community_id", communityId);

        console.log("LOG: MEMBERS", membersData, membersError);

        // MEMBERSHIP
        const { data: membershipData, error: membershipError } = await supabase
          .from("community_members")
          .select("*")
          .eq("user_id", viewer.id)
          .eq("community_id", communityId)
          .maybeSingle();

        console.log("LOG: MEMBERSHIP", membershipData, membershipError);

        // 🔥 PADRÃO CORRETO (igual dashboard)
        const nextFormData = {
          ...(communityData ?? {}), // 🔥 flatten aqui resolve tudo
          members: membersData ?? [],
          membership: membershipData ?? null,
          "Short message": ""
        };

        console.log("LOG: SET formData", nextFormData);

        if (!mounted) return;

        setFormData(nextFormData);

      } catch (err) {
        console.error("LOG: LOAD ERROR", err);
      } finally {
        if (mounted) setLoading(false);
        console.log("LOG: LOAD END");
      }
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
    console.log("LOG: handleSave RECEIVED", data);

    if (!viewer || !id) {
      console.log("LOG: ABORT SAVE", { viewer, id });
      return;
    }

    try {
      const payload = {
        user_id: viewer.id,
        community_id: Number(id),
        role: "member",
        status: "request",
        short_message: data?.["Short message"] ?? ""
      };

      console.log("LOG: PAYLOAD", payload);

      const { data: result, error } = await supabase
        .from("community_members")
        .upsert(payload, {
          onConflict: "user_id,community_id"
        });

      console.log("LOG: UPSERT RESULT", result);
      console.log("LOG: UPSERT ERROR", error);

      if (!error) console.log("LOG: APPLY SUCCESS");

    } catch (err) {
      console.error("LOG: SAVE EXCEPTION", err);
    }
  }

  // =========================
  // DEBUG GLOBAL
  // =========================
  useEffect(() => {
    // @ts-ignore
    window.__DEBUG_FORMDATA = formData;
    console.log("LOG: WINDOW formData atualizado");
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
