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
      console.log("LOG: AUTH user:", data?.user?.id, " error:", error ?? null);
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD COMMUNITY + STATE (aguarda viewer + id)
  // =========================
  useEffect(() => {
    if (!id || !viewer) {
      // mensagem curta e objetiva para confirmar que aguardamos ambos
      console.log("LOG: loadAll postponed, id:", id ?? "no-id", " viewer:", viewer ? viewer.id : "no-viewer");
      return;
    }

    let mounted = true;

    async function loadAll() {
      try {
        const communityId = Number(id);
        console.log("LOG: LOAD START communityId:", communityId);

        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .eq("id", communityId)
          .maybeSingle();

        console.log("LOG: COMMUNITY data:", communityData ? "found" : null, " error:", communityError ?? null);
        if (!mounted) return;
        if (!communityData) {
          setLoading(false);
          return;
        }
        setCommunity(communityData);

        const { data: membersData, error: membersError } = await supabase
          .from("community_members")
          .select("*")
          .eq("community_id", communityId);

        console.log("LOG: MEMBERS count:", membersData?.length ?? 0, " error:", membersError ?? null);
        if (!mounted) return;
        setMembers(membersData ?? []);

        const { data: existing, error: membershipError } = await supabase
          .from("community_members")
          .select("*")
          .eq("user_id", viewer.id)
          .eq("community_id", communityId)
          .maybeSingle();

        console.log("LOG: MEMBERSHIP data:", existing ? "found" : null, " error:", membershipError ?? null);
        if (!mounted) return;
        setMembership(existing ?? null);

        setFormData({ short_message: "" });
      } catch (err) {
        console.error("LOG: LOAD exception:", err);
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
  // SAVE (APPLY) - core handler
  // =========================
  async function handleSave(data: any) {
    console.log("LOG: handleSave called with:", data);
    if (!viewer || !id) {
      console.log("LOG: ABORT SAVE missing viewer or id", { viewer: viewer?.id ?? null, id: id ?? null });
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

      console.log("LOG: INSERT PAYLOAD:", payload);
      const { data: upsertData, error } = await supabase
        .from("community_members")
        .upsert(payload, { onConflict: "user_id,community_id" });

      console.log("LOG: UPSERT result:", upsertData ?? null, " error:", error ?? null);
      if (error) console.error("LOG: APPLY ERROR:", error);
      else console.log("LOG: APPLY SUCCESS");
    } catch (err) {
      console.error("LOG: SAVE exception:", err);
    }
  }

  // =========================
  // WRAPPER para interceptar chamadas do Plasmic
  // =========================
  // wrappedOnSave é a função passada ao Plasmic. Se o Plasmic chamar onSave,
  // você verá esse log IMEDIATAMENTE aqui no Next. Não precisa tocar no Plasmic.
  function wrappedOnSave(data: any) {
    const t = new Date().toISOString();
    console.log(`LOG: WRAPPER onSave invoked @ ${t}`, data ?? null);
    try {
      // forward para handler real
      void handleSave(data);
    } catch (e) {
      console.error("LOG: WRAPPER error:", e);
    }
  }

  // exposição no window para testes manuais (sem Plasmic)
  useEffect(() => {
    // @ts-ignore
    window.__A_APPLY_INVOKE = (payload: any) => {
      console.log("LOG: __A_APPLY_INVOKE called", payload ?? null);
      void handleSave(payload);
    };
    return () => {
      // @ts-ignore
      try { delete window.__A_APPLY_INVOKE; } catch {}
    };
  }, [viewer, id]);

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
        // aqui passamos o wrapper — Plasmic chama onSave e CAI MOS logs aqui
        onSave: wrappedOnSave,
        membership
      }}
    />
  );
}
