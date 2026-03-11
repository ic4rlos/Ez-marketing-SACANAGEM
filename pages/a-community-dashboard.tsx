import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACommunityDashboard = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACommunityDashboard"
    ).then((m) => m.PlasmicACommunityDashboard),
  { ssr: false }
);

export default function ACommunityDashboard() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // AUTH
  // ======================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }

    loadUser();
  }, []);

  // ======================
  // LOAD COMMUNITY
  // ======================

  useEffect(() => {
    if (!user) return;

    async function loadCommunity() {

      // descobrir qual comunidade o user pertence
      const { data: member } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .maybeSingle();

      if (!member) {
        setLoading(false);
        return;
      }

      // buscar comunidade
      const { data: communityData } = await supabase
        .from("Community")
        .select("*")
        .eq("id", member.community_id)
        .maybeSingle();

      setCommunity(communityData ?? null);
      setLoading(false);
    }

    loadCommunity();

  }, [user]);

  if (loading) return null;

  return (
    <PlasmicACommunityDashboard
      args={{
        community: community
      }}
    />
  );
}
