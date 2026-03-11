import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicACreateCommunity = dynamic(
  () =>
    import(
      "../components/plasmic/ez_marketing_platform_sacanagem/PlasmicACreateCommunity"
    ).then((m) => m.PlasmicACreateCommunity),
  { ssr: false }
);

export default function ACreateCommunity() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BUCKET = "community-pics";

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
  // LOAD COMMUNITY
  // =========================
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCommunity() {
      const { data } = await supabase
        .from("Community")
        .select("*")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (data) {
        setFormData({
          "Community name": data.community_name ?? "",
          Type: data.type ?? "",
          Location: data.location ?? "",
          About: data.about ?? "",
          Website: data.website ?? "",
          "Youtube channel": data.youtube_channel ?? "",
          "Youtube video": data.youtube_video ?? "",
          Instagram: data.Instagram ?? "",
          Tiktok: data.tiktok ?? "",
          X: data.x ?? "",
          "Community logo": data.community_logo ?? null,
          "Agency pic": data.agency_pic ?? null,
        });
      } else {
        setFormData({
          "Community name": "",
          Type: "",
          Location: "",
          About: "",
          Website: "",
          "Youtube channel": "",
          "Youtube video": "",
          Instagram: "",
          Tiktok: "",
          X: "",
          "Community logo": null,
          "Agency pic": null,
        });
      }

      setLoading(false);
    }

    loadCommunity();
  }, [user, supabase]);

  // =========================
  // BASE64 → FILE
  // =========================
  function base64ToFile(base64: string, filename: string, mime: string) {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mime });
  }

  // =========================
  // SAVE
  // =========================
  async function handleSave(payload: any) {
    if (!user) return;

    if (!payload["Type"] || payload["Type"] !== "Venture") {
      alert(
        "EZ Marketing does not yet have the technology to support this type of agency."
      );
      router.push("/a-login");
      return;
    }

    let communityLogo = payload["Community logo"];
    let agencyPic = payload["Agency pic"];

    // ===== Upload Community Logo =====
    if (
      communityLogo &&
      typeof communityLogo !== "string" &&
      communityLogo?.files?.[0]?.contents
    ) {
      const fileObj = communityLogo.files[0];
      const fileExt = fileObj.name.split(".").pop();
      const fileName = `community-logo-${user.id}-${Date.now()}.${fileExt}`;

      const file = base64ToFile(
        fileObj.contents,
        fileName,
        fileObj.type || "image/png"
      );

      const filePath = `logos/${fileName}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        communityLogo = data.publicUrl;
      }
    }

    // ===== Upload Agency Pic =====
    if (
      agencyPic &&
      typeof agencyPic !== "string" &&
      agencyPic?.files?.[0]?.contents
    ) {
      const fileObj = agencyPic.files[0];
      const fileExt = fileObj.name.split(".").pop();
      const fileName = `agency-${user.id}-${Date.now()}.${fileExt}`;

      const file = base64ToFile(
        fileObj.contents,
        fileName,
        fileObj.type || "image/png"
      );

      const filePath = `agencies/${fileName}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        agencyPic = data.publicUrl;
      }
    }

    // =========================
    // UPSERT COMMUNITY
    // =========================
    const { data: savedCommunity, error } = await supabase
      .from("Community")
      .upsert(
        {
          owner_user_id: user.id,
          community_name: payload["Community name"],
          type: payload["Type"],
          location: payload["Location"],
          about: payload["About"],
          community_logo: communityLogo,
          agency_pic: agencyPic,
          website: payload["Website"],
          youtube_channel: payload["Youtube channel"],
          youtube_video: payload["Youtube video"],
          Instagram: payload["Instagram"],
          tiktok: payload["Tiktok"],
          x: payload["X"],
        },
        {
          onConflict: "owner_user_id",
        }
      )
      .select()
      .single();

    if (error || !savedCommunity) {
      console.error(error);
      return;
    }

    const communityId = savedCommunity.id;

    // =========================
    // CREATE ADMIN MEMBER
    // =========================
    const { data: existingMember } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", communityId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingMember) {
      const { error: memberError } = await supabase
        .from("community_members")
        .insert({
          community_id: communityId,
          user_id: user.id,
          role: "admin",
          short_message: null,
          status: "connected",
        });

      if (memberError) {
        console.error("Member creation error:", memberError);
      }
    }

    setFormData((prev: any) => ({ ...(prev ?? {}), ...payload }));

    router.push("/a-community-dashboard/");
  }

  if (loading) return null;

  return (
    <PlasmicACreateCommunity
      args={{
        formData,
        setFormData,
        onSave: handleSave,
      }}
    />
  );
}
