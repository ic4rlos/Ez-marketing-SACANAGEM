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
    members: [],
    trainings: []
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  // =========================
  // LOAD COMMUNITY + MEMBERS + TRAININGS
  // =========================

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

      const communityId = member.community_id;

      // =========================
      // COMMUNITY INFO
      // =========================

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

              // pegar TODOS offices
              const { data: offices } = await supabase
                .from("Multicharge")
                .select("Office")
                .eq("User profile_id", profile.id);

              if (!offices || offices.length === 0) return null;

              // repetir membro para cada office
              return offices.map((o: any) => ({
                "Profile pic": profile["Profile pic"],
                Office: o.Office
              }));

            })
          )
        ).flat().filter(Boolean);
      }

      // =========================
      // TRAININGS
      // =========================

      const currentYear = new Date().getFullYear();

      let trainings: any[] = [];

      if (membersDb?.length) {

        trainings = (
          await Promise.all(
            membersDb.map(async (m: any) => {

              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", "First name", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              if (!profile) return null;

              const { data: educations } = await supabase
  .from("Education")
  .select('University, "Graduation year"')
  .filter('"User profile_id"', "eq", profile.id)
  .filter('"Graduation year"', "gt", currentYear);

              if (!educations || educations.length === 0) return null;

              return educations.map((ed: any) => ({
                "Profile pic": profile["Profile pic"],
                "First name": profile["First name"],
                University: ed.University,
                "Graduation year": ed["Graduation year"]
              }));

            })
          )
        ).flat().filter(Boolean);
      }

      // =========================
      // FINAL STATE
      // =========================

      setFormData({
        ...community,
        members,
        trainings
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
