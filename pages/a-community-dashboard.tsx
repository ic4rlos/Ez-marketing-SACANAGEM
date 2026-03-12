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

      console.log("AUTH USER:", data?.user);

      setUser(data?.user ?? null);
    }

    loadUser();
  }, []);

  // =========================
  // LOAD COMMUNITY + MEMBERS + TRAININGS
  // =========================

  useEffect(() => {
    if (!user) {
      console.log("NO USER FOUND");
      setLoading(false);
      return;
    }

    async function loadCommunity() {

      console.log("USER ID:", user.id);

      // descobrir comunidade do usuário
      const { data: member } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .maybeSingle();

      console.log("COMMUNITY MEMBERSHIP:", member);

      if (!member) {
        console.log("USER NOT IN COMMUNITY");
        setLoading(false);
        return;
      }

      const communityId = member.community_id;

      console.log("COMMUNITY ID:", communityId);

      // =========================
      // COMMUNITY INFO
      // =========================

      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      console.log("COMMUNITY DATA:", community);

      // =========================
      // MEMBERS
      // =========================

      const { data: membersDb } = await supabase
        .from("community_members")
        .select("user_id")
        .eq("community_id", communityId)
        .eq("status", "connected");

      console.log("MEMBERS DB:", membersDb);

      let members: any[] = [];

      if (membersDb?.length) {

        members = (
          await Promise.all(
            membersDb.map(async (m: any) => {

              console.log("PROCESSING MEMBER:", m.user_id);

              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              console.log("PROFILE FOUND:", profile);

              if (!profile) return null;

              const { data: offices } = await supabase
                .from("Multicharge")
                .select("Office")
                .eq("User profile_id", profile.id);

              console.log("OFFICES:", offices);

              if (!offices || offices.length === 0) return null;

              return offices.map((o: any) => ({
                "Profile pic": profile["Profile pic"],
                Office: o.Office
              }));

            })
          )
        ).flat().filter(Boolean);
      }

      console.log("FINAL MEMBERS ARRAY:", members);

      // =========================
      // TRAININGS
      // =========================

      const currentYear = new Date().getFullYear();

      console.log("CURRENT YEAR:", currentYear);

      let trainings: any[] = [];

      if (membersDb?.length) {

        trainings = (
          await Promise.all(
            membersDb.map(async (m: any) => {

              console.log("TRAINING CHECK MEMBER:", m.user_id);

              const { data: profile } = await supabase
                .from("User profile")
                .select('id, "Profile pic", "First name", user_id')
                .eq("user_id", m.user_id)
                .maybeSingle();

              console.log("TRAINING PROFILE:", profile);

              if (!profile) return null;

              const { data: educationsRaw } = await supabase
                .from("Education")
                .select('University, "Graduation year", "User profile_id"')
                .eq("User profile_id", profile.id);

              console.log("EDUCATIONS RAW:", educationsRaw);

              const educations =
                educationsRaw?.filter(
                  (ed: any) => Number(ed["Graduation year"]) > currentYear
                ) ?? [];

              console.log("EDUCATIONS AFTER FILTER:", educations);

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

      console.log("FINAL TRAININGS ARRAY:", trainings);

      // =========================
      // FINAL STATE
      // =========================

      const finalData = {
        ...community,
        members,
        trainings
      };

      console.log("FORMDATA SENT TO PLASMIC:", finalData);

      setFormData(finalData);

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
