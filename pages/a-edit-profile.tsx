import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

export const dynamic_config = "force-dynamic";
export const runtime = "nodejs";

const PlasmicAEditProfile = dynamic(
  () =>
    import("../components/plasmic/ez_marketing_platform_sacanagem/PlasmicAEditProfile").then(
      (m) => m.PlasmicAEditProfile
    ),
  { ssr: false }
);

export default function AEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    education: [],
    jobs: [],
    offices: [],
  });

  const [loading, setLoading] = useState(true);

  const BUCKET = "agency-pics";

  // AUTH
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // LOAD PROFILE
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      const { data: profileData } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profileData) {
        setLoading(false);
        return;
      }

      const profileId = profileData.id;

      const { data: education } = await supabase
        .from("Education")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: jobs } = await supabase
        .from("Charge")
        .select("*")
        .eq("User profile_id", profileId);

      const { data: officesDb } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      const offices = officesDb?.map((o) => o.Office) ?? [];

      setFormData({
        ...profileData,
        education: education ?? [],
        jobs: jobs ?? [],
        offices,
      });

      setLoading(false);
    }

    loadAll();
  }, [user]);

  // BASE64 → FILE
  function base64ToFile(base64: string, filename: string, mime: string) {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mime });
  }

  async function handleSave(payload: any) {
    if (!user) return;

    const { education = [], jobs = [], offices = [], ...profileFields } =
      payload;

    let avatarUrl = profileFields["Profile image"];

    // AVATAR
    if (
      avatarUrl &&
      typeof avatarUrl !== "string" &&
      avatarUrl?.files?.[0]?.contents
    ) {
      const fileObj = avatarUrl.files[0];
      const fileExt = fileObj.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const file = base64ToFile(
        fileObj.contents,
        fileName,
        fileObj.type || "image/png"
      );

      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
    }

    // UPSERT PROFILE
    const { data: savedProfile } = await supabase
      .from("User profile")
      .upsert(
        {
          user_id: user.id,
          ...profileFields,
          "Profile image": avatarUrl,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    const profileId = savedProfile.id;

    // EDUCATION DELETE
    const { data: existingEducation } = await supabase
      .from("Education")
      .select("id")
      .eq("User profile_id", profileId);

    const existingIds = existingEducation?.map((e) => e.id) ?? [];
    const payloadIds = education.filter((e: any) => e.id).map((e: any) => e.id);

    const toDelete = existingIds.filter((id) => !payloadIds.includes(id));

    if (toDelete.length)
      await supabase.from("Education").delete().in("id", toDelete);

    // EDUCATION UPSERT
    const educationPayload = education.map((e: any) => ({
      ...(e.id ? { id: e.id } : {}),
      University: e.University ?? null,
      Major: e.Major ?? null,
      "Graduation year": e["Graduation year"] ?? null,
      "Education level": e["Education level"] ?? null,
      "User profile_id": profileId,
    }));

    if (educationPayload.length)
      await supabase.from("Education").upsert(educationPayload, {
        onConflict: "id",
      });

    // JOBS DELETE
    const { data: existingJobs } = await supabase
      .from("Charge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingJobIds = existingJobs?.map((j) => j.id) ?? [];
    const payloadJobIds = jobs.filter((j: any) => j.id).map((j: any) => j.id);

    const jobsToDelete = existingJobIds.filter(
      (id) => !payloadJobIds.includes(id)
    );

    if (jobsToDelete.length)
      await supabase.from("Charge").delete().in("id", jobsToDelete);

    // JOBS UPSERT
    const jobsPayload = jobs.map((j: any) => ({
      ...(j.id ? { id: j.id } : {}),
      Company: j.Company ?? null,
      Role: j.Role ?? null,
      "Start year": j["Start year"] ?? null,
      "End year": j["End year"] ?? null,
      "User profile_id": profileId,
    }));

    if (jobsPayload.length)
      await supabase.from("Charge").upsert(jobsPayload, {
        onConflict: "id",
      });

    // OFFICES DELETE
    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("*")
      .eq("User profile_id", profileId);

    const toDeleteOffices =
      existingOffices
        ?.filter((o) => !offices.includes(o.Office))
        .map((o) => o.id) ?? [];

    if (toDeleteOffices.length)
      await supabase.from("Multicharge").delete().in("id", toDeleteOffices);

    // OFFICES INSERT
    const existingValues = existingOffices?.map((o) => o.Office) ?? [];

    const toInsert = offices
      .filter((office: string) => !existingValues.includes(office))
      .map((office: string) => ({
        Office: office,
        "User profile_id": profileId,
      }));

    if (toInsert.length) await supabase.from("Multicharge").insert(toInsert);

    router.replace("/a-find-a-business/");
  }

  if (loading) return null;

  return (
    <PlasmicAEditProfile
      args={{
        formData,
        setFormData,
        onSave: handleSave,
        onOfficesChange: (value: any) => {
          setFormData((prev: any) => ({
            ...prev,
            offices: Array.isArray(value) ? [...value] : [value],
          }));
        },
      }}
    />
  );
}
