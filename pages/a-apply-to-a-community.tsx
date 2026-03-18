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
      const { data, error } = await supabase.auth.getUser();

      console.log("AUTH user:", data?.user?.id);
      console.log("AUTH error:", error);

      setViewer(data?.user ?? null);
    }

    loadUser();
  }, []);

  // =========================
  // LOAD COMMUNITY + STATE
  // =========================

  useEffect(() => {

    if (!id) {
      console.log("ABORT: no id yet");
      return;
    }

    async function loadAll() {

      try {

        const communityId = Number(id);
        console.log("LOAD START communityId:", communityId);

        // COMMUNITY
        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .eq("id", communityId)
          .maybeSingle();

        console.log("COMMUNITY data:", communityData);
        console.log("COMMUNITY error:", communityError);

        if (!communityData) {
          console.log("ABORT: community not found");
          setLoading(false);
          return;
        }

        setCommunity(communityData);

        // MEMBERS
        const { data: membersData, error: membersError } = await supabase
          .from("community_members")
          .select("*")
          .eq("community_id", communityId);

        console.log("MEMBERS count:", membersData?.length);
        console.log("MEMBERS error:", membersError);

        setMembers(membersData ?? []);

        // CHECK USER MEMBERSHIP
        if (viewer?.id) {

          console.log("CHECK membership for user:", viewer.id);

          const { data: existing, error: membershipError } = await supabase
            .from("community_members")
            .select("*")
            .eq("user_id", viewer.id)
            .eq("community_id", communityId)
            .maybeSingle();

          console.log("MEMBERSHIP data:", existing);
          console.log("MEMBERSHIP error:", membershipError);

          setMembership(existing ?? null);

        } else {
          console.log("SKIP membership check: no viewer");
        }

        // FORM DEFAULT
        setFormData({
          short_message: ""
        });

      } catch (err) {

        console.error("LOAD exception:", err);

      }

      console.log("LOAD END");
      setLoading(false);

    }

    loadAll();

  }, [id, viewer]);

  // =========================
  // SAVE (APPLY)
  // =========================

  async function handleSave(data: any) {

    console.log("SAVE TRIGGERED");

    if (!viewer || !id) {
      console.log("ABORT SAVE:", { viewer: viewer?.id, id });
      return;
    }

    try {

      const payload = {
        user_id: viewer.id,
        community_id: Number(id),
        role: "member",
        status: "request",
        short_message: data?.short_message ?? ""
      };

      console.log("PAYLOAD:", payload);

      const { data: upsertData, error } = await supabase
        .from("community_members")
        .upsert(payload, {
          onConflict: "user_id,community_id"
        });

      console.log("UPSERT result:", upsertData);
      console.log("UPSERT error:", error);

      if (!error) {
        console.log("APPLY SUCCESS");
      }

    } catch (err) {

      console.error("SAVE exception:", err);

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
