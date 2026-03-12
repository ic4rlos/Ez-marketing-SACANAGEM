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

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      console.log("AUTH USER:", data.user);
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
      console.log("LOADING PROFILE DATA");

      const { data: profileData } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("PROFILE DATA:", profileData);

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

      console.log("EDUCATION:", education);
      console.log("JOBS:", jobs);
      console.log("OFFICES:", offices);

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

    console.log("SAVE PAYLOAD:", payload);

    const {
      education = [],
      jobs = [],
      offices = [],
      ...profileFields
    } = payload;

    // =========================
    // VALIDAR MAJOR DUPLICADO
    // =========================
    const majors = education.map((e: any) => e.Major?.toLowerCase());

    const duplicatedMajor = majors.find(
      (m: string, i: number) => majors.indexOf(m) !== i
    );

    if (duplicatedMajor) {
      alert("Same major");
      return;
    }

    let avatarUrl = profileFields["Profile image"];

    // =========================
    // UPLOAD AVATAR
    // =========================
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

      console.log("UPLOADING AVATAR");

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
    }

    // =========================
    // UPSERT PROFILE
    // =========================
    const { data: savedProfile, error: profileError } = await supabase
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

    console.log("PROFILE SAVED:", savedProfile);

    if (profileError || !savedProfile) {
      console.error("PROFILE ERROR:", profileError);
      return;
    }

    const profileId = savedProfile.id;

    // =========================
    // EDUCATION SYNC
    // =========================
    const { data: existingEducation } = await supabase
      .from("Education")
      .select("id")
      .eq("User profile_id", profileId);

    const existingEduIds = existingEducation?.map((e) => e.id) ?? [];

    const payloadEduIds = education
      ?.map((e: any) => e.id)
      .filter(Boolean) ?? [];

    const eduToDelete = existingEduIds.filter(
      (id) => !payloadEduIds.includes(id)
    );

    if (eduToDelete.length) {
      console.log("DELETE EDUCATION:", eduToDelete);
      await supabase.from("Education").delete().in("id", eduToDelete);
    }

    const eduPayload = education.map((e: any) => ({
      ...(e.id ? { id: e.id } : {}),
      "User profile_id": profileId,
      "University": e.University ?? "",
      "Major": e.Major ?? "",
      "Graduation year": e["Graduation year"] ?? "",
      "Education level": e["Education level"] ?? "",
    }));

    console.log("EDUCATION PAYLOAD:", eduPayload);

    if (eduPayload.length) {
      await supabase.from("Education").upsert(eduPayload);
    }

    // =========================
    // JOBS SYNC (CORRIGIDO)
    // =========================
    const { data: existingJobs } = await supabase
      .from("Charge")
      .select("id")
      .eq("User profile_id", profileId);

    const existingJobIds = existingJobs?.map((j) => j.id) ?? [];

    const payloadJobIds =
      jobs?.map((j: any) => j.id).filter(Boolean) ?? [];

    const jobToDelete = existingJobIds.filter(
      (id) => !payloadJobIds.includes(id)
    );

    if (jobToDelete.length) {
      console.log("DELETE JOBS:", jobToDelete);
      await supabase.from("Charge").delete().in("id", jobToDelete);
    }

    const jobsPayload = jobs.map((j: any) => ({
      ...(j.id ? { id: j.id } : {}),
      "User profile_id": profileId,
      "Charge": j.Charge ?? "",
      "Company": j.Company ?? "",
      "How long in office": j["How long in office"] ?? "",
    }));

    console.log("JOBS PAYLOAD:", jobsPayload);

    if (jobsPayload.length) {
      await supabase.from("Charge").upsert(jobsPayload);
    }

    // =========================
    // OFFICES SYNC
    // =========================
    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("*")
      .eq("User profile_id", profileId);

    const existingValues = existingOffices?.map((o) => o.Office) ?? [];

    const toDeleteOffices =
      existingOffices
        ?.filter((o) => !offices.includes(o.Office))
        .map((o) => o.id) ?? [];

    if (toDeleteOffices.length) {
      console.log("DELETE OFFICES:", toDeleteOffices);
      await supabase.from("Multicharge").delete().in("id", toDeleteOffices);
    }

    const toInsert = offices
      .filter((office: string) => !existingValues.includes(office))
      .map((office: string) => ({
        "Office": office,
        "User profile_id": profileId,
      }));

    console.log("INSERT OFFICES:", toInsert);

    if (toInsert.length) {
      await supabase.from("Multicharge").insert(toInsert);
    }

    console.log("PROFILE SAVE COMPLETED");

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
