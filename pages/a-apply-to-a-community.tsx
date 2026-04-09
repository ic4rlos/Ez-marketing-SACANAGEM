import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSupabaseA } from "../lib/a-supabaseClient";
import { getSupabaseC } from "../lib/c-supabaseClient";

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
  const supabaseC = getSupabaseC();
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
      const { data } = await supabase.auth.getUser();
      setViewer(data?.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    if (!id || !viewer) return;

    let mounted = true;

    async function loadAll() {
      const communityId = Number(id);

      // =========================
      // REDIRECT (já tem comunidade?)
      // =========================
      const { data: myMembership } = await supabase
        .from("community_members")
        .select("community_id, status")
        .eq("user_id", viewer.id)
        .eq("status", "connected")
        .maybeSingle();

      if (myMembership) {
        router.push("/a-community-dashboard");
        return;
      }

      // =========================
      // COMMUNITY
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
                .select('id, "Profile pic"')
                .eq("user_id", m.user_id)
                .maybeSingle();

              let offices: any[] = [];

              if (profile?.id) {
                const { data } = await supabase
                  .from("Multicharge")
                  .select("Office")
                  .eq("User profile_id", profile.id);

                offices = data ?? [];
              }

              if (!offices.length) {
                return [{
                  "Profile pic": profile?.["Profile pic"] ?? null,
                  Office: "Member"
                }];
              }

              return offices.map((o: any) => ({
                "Profile pic": profile?.["Profile pic"] ?? null,
                Office: o.Office
              }));
            })
          )
        ).flat().filter(Boolean);
      }

      // =========================
      // CONNECTED COMPANIES
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId)
        .eq("status", "connected");

      let connectedCompanies: any[] = [];

      if (connections?.length) {
        const companyIds = connections.map((c: any) => c.company_id);

        const { data: companies } = await supabaseC
          .from("companies")
          .select('id, "Company Logo", "Company name"')
          .in("id", companyIds);

        connectedCompanies = connections.map((conn: any) => {
          const company = companies?.find(
            (c: any) => Number(c.id) === Number(conn.company_id)
          );

          return {
            "Company Logo": company?.["Company Logo"] ?? "",
            "Company name": company?.["Company name"] ?? ""
          };
        });
      }

      // =========================
      // REVIEWS (CORRIGIDO)
      // =========================
      const { data: reviews } = await supabase
        .from("community_reviews")
        .select("rating, author_type")
        .eq("community_id", communityId)
        .in("author_type", ["company", "member"]);

      const validReviews = reviews ?? [];

      const rate_sum = validReviews.length;

      const average_rate =
        rate_sum > 0
          ? validReviews.reduce(
              (acc: number, r: any) => acc + Number(r.rating || 0),
              0
            ) / rate_sum
          : 0;

      // =========================
      // SPECIALTIES
      // =========================
      const { data: specialtiesRaw } = await supabase
        .from("Community specialties")
        .select('"Professional specialty"')
        .eq("community_id", communityId);

      const specialties =
        specialtiesRaw?.map(
          (s: any) => s["Professional specialty"]
        ) ?? [];
// 🔥 LOGGED USER PROFILE PIC
const { data: loggedProfile } = await supabase
  .from("User profile")
  .select("*")
  .eq("user_id", viewer.id)
  .maybeSingle();
      const nextFormData = {
        ...(community ?? {}),
        logged_profile_pic: loggedProfile?.["Profile pic"] ?? null,
        members,
        connected_companies: connectedCompanies,
        specialties,
        rate_sum,
        average_rate,
        "Short message": ""
      };

      if (!mounted) return;

      setFormData(nextFormData);
      setLoading(false);
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
    if (!viewer || !id) return;

    await supabase
      .from("community_members")
      .insert({
        user_id: viewer.id,
        community_id: Number(id),
        role: "member",
        status: "request",
        short_message:
          data?.["Short message"] ??
          data?.short_message ??
          ""
      });
  }

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
