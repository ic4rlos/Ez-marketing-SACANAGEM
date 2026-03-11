import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicAProfile = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicAProfile"
    ).then((m) => m.PlasmicAProfile),
  { ssr: false }
);

export default function AProfile() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    education: [],
    jobs: [],
    offices: [],
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }

    loadUser();
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      // profile
      const { data: profile } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) {
        setLoading(false);
        return;
      }

      const profileId = profile.id;

      // education
      const { data: education } = await supabase
        .from("Education")
        .select("*")
        .eq("User profile_id", profileId);

      // jobs
      const { data: jobs } = await supabase
        .from("Charge")
        .select("*")
        .eq("User profile_id", profileId);

      // offices
      const { data: officesDb } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      const offices = officesDb?.map((o: any) => o.Office) ?? [];

      // =========================
      // COMMUNITY
      // =========================

      const { data: membership } = await supabase
        .from("community_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      let communityLogo = null;

      if (membership?.community_id) {
        const { data: community } = await supabase
          .from("Community")
          .select("*")
          .eq("id", membership.community_id)
          .maybeSingle();

        communityLogo = community?.community_logo ?? null;
      }

      // =========================
      // AGE
      // =========================

      let age = null;

      if (profile.Birthday) {
        const birth = new Date(profile.Birthday);
        const today = new Date();

        age = today.getFullYear() - birth.getFullYear();
      }

      // =========================
      // STATE FINAL
      // =========================

      setFormData({
        ...profile,
        Age: age,
        community_logo: communityLogo,
        education: education ?? [],
        jobs: jobs ?? [],
        offices,
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) return null;

  return (
    <PlasmicAProfile
      args={{
        formData,
        setFormData,
        onSignOut: handleSignOut,
      }}
    />
  );
}
