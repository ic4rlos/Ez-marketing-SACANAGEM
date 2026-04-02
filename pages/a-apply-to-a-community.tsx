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
    if (!viewer) return;

    async function checkIfUserHasCommunity() {
      const { data: member } = await supabase
        .from("community_members")
        .select("community_id, status")
        .eq("user_id", viewer.id)
        .eq("status", "connected")
        .maybeSingle();

      if (member) {
        router.push("/a-community-dashboard");
        return;
      }
    }

    checkIfUserHasCommunity();
  }, [viewer]);

  useEffect(() => {
    if (!id || !viewer) return;

    let mounted = true;

    async function loadAll() {
      const communityId = Number(id);

      // COMMUNITY
      const { data: community } = await supabase
        .from("Community")
        .select("*")
        .eq("id", communityId)
        .maybeSingle();

      // =========================
      // CONNECTED COMPANIES (igual dashboard)
      // =========================
      const { data: connections } = await supabase
        .from("CONNECTIONS")
        .select("*")
        .eq("agency_id", communityId);

      let connectedCompanies: any[] = [];

      if (connections?.length) {
        const companyIds = Array.from(
          new Set(connections.map((c: any) => Number(c.company_id)))
        );

        const { data: companies } = await supabaseC
          .from("companies")
          .select('*')
          .in("id", companyIds);

        connectedCompanies = connections
          .filter((c: any) => c.status === "connected")
          .map((conn: any) => {
            const company = companies?.find(
              (c) => Number(c.id) === Number(conn.company_id)
            );

            return {
              id: conn.id,
              company_id: conn.company_id,
              short_message: conn.short_message ?? "",
              "Company Logo": company?.["Company Logo"] ?? "",
              "Company name": company?.["Company name"] ?? ""
            };
          });
      }

      // =========================
      // MEMBERS (igual antes, resiliente)
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
                return [
                  {
                    "Profile pic": profile?.["Profile pic"] ?? null,
                    Office: "Member"
                  }
                ];
              }

              return offices.map((o: any) => ({
                "Profile pic": profile?.["Profile pic"] ?? null,
                Office: o.Office
              }));
            })
          )
        )
          .flat()
          .filter(Boolean);
      }

      // =========================
      // REVIEWS → RATE
      // =========================
      const { data: reviews } = await supabase
        .from("community_reviews")
        .select("rating")
        .eq("community_id", communityId);

      const rate_sum =
        reviews?.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0) ?? 0;

      const average_rate =
        reviews?.length ? rate_sum / reviews.length : 0;

      // =========================
      // FINAL
      // =========================
      const nextFormData = {
        ...(community ?? {}),
        members,
        connected_companies: connectedCompanies,
        rate_sum,
        average_rate,
        "Profile pic": null,
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
