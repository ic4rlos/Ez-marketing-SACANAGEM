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

  const [formData, setFormData] = useState<any>({
    members: []
  });

  const [loading, setLoading] = useState(true);

  // AUTH
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  // LOAD COMMUNITY + MEMBERS
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCommunity() {

      // descobrir comunidade do usuário
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

      // dados da comunidade
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", member.community_id)
        .maybeSingle();

      // =========================
      // MEMBERS
      // =========================

      const { data: membersDb } = await supabase
        .from("community_members")
        .select("*")
        .eq("community_id", member.community_id)
        .eq("status", "connected");

      let members: any[] = [];

      if (membersDb?.length) {

        members = await Promise.all(
          membersDb.map(async (m: any) => {

            // profile
            const { data: profile } = await supabase
              .from("User profile")
              .select("*")
              .eq("user_id", m.user_id)
              .maybeSingle();

            if (!profile) return null;

            // first office
            const { data: office } = await supabase
              .from("Multicharge")
              .select("*")
              .eq("User profile_id", profile.id)
              .limit(1)
              .maybeSingle();

            return {
              profile_pic: profile["Profile pic"] ?? null,
              office: office?.Office ?? null,
              profile_id: profile.id
            };

          })
        );

        members = members.filter(Boolean);
      }

      // FINAL STATE
      setFormData({
        ...community,
        members
      });

      setLoading(false);
    }

    loadCommunity();
  }, [user]);

  if (loading) return null;

  return (
    <PlasmicACommunityDashboard
      args={{
        formData: formData,
        setFormData: setFormData
      }}
    />
  );
}
