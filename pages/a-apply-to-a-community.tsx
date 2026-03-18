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
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [avatarFiles, setAvatarFiles] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null);

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
  // LOAD COMMUNITY + STATE
  // =========================

  useEffect(() => {

    // 🔒 trava execução até ter tudo
    if (!id || !viewer) return;

    async function loadAll() {

      try {

        const communityId = Number(id);

        // COMMUNITY
        const { data: communityData } = await supabase
          .from("Community")
          .select("*")
          .eq("id", communityId)
          .maybeSingle();

        if (!communityData) {
          setLoading(false);
          return;
        }

        setCommunity(communityData);

        // MEMBERS
        const { data: membersData } = await supabase
          .from("community_members")
          .select("*")
          .eq("community_id", communityId);

        setMembers(membersData ?? []);

        // MEMBERSHIP (SEM IF)
        const { data: existing } = await supabase
          .from("community_members")
          .select("*")
          .eq("user_id", viewer.id)
          .eq("community_id", communityId)
          .maybeSingle();

        setMembership(existing ?? null);

        // FORM DEFAULT
        setFormData({
          short_message: ""
        });

      } catch (err) {

        console.error("Load error:", err);

      }

      setLoading(false);

    }

    loadAll();

  }, [id, viewer]);

  // =========================
  // SAVE (APPLY)
  // =========================

  async function handleSave(data: any) {

    console.log("handleSave recebeu:", data);

    if (!viewer || !id) return;

    try {

      const payload = {
        user_id: viewer.id,
        community_id: Number(id),
        role: "member",
        status: "request",
        short_message: data?.short_message ?? ""
      };

      console.log("Payload:", payload);

      const { error } = await supabase
        .from("community_members")
        .upsert(payload, {
          onConflict: "user_id,community_id"
        });

      if (error) {

        console.error("Apply error:", error);

      } else {

        console.log("Apply success");

      }

    } catch (err) {

      console.error("Apply exception:", err);

    }

  }

  if (loading) return null;

  return (
    <PlasmicAApplyToACommunity
      args={{
        community: community ?? {},
        members: members ?? [],
        formData,
        setFormData,
        avatarFiles,
        onAvatarFilesChange: setAvatarFiles,
        onSave: handleSave,
        membership
      }}
    />
  );

}
