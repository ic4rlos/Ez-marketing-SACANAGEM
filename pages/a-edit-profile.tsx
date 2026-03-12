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

  // ====================================================
  // AUTH
  // ====================================================

  useEffect(() => {
    async function loadUser() {
      console.group("🔐 AUTH LOAD USER");

      const { data, error } = await supabase.auth.getUser();

      console.log("AUTH RAW DATA:", data);
      console.log("AUTH ERROR:", error);

      const currentUser = data?.user ?? null;

      console.log("AUTH FINAL USER:", currentUser);

      setUser(currentUser);

      console.groupEnd();
    }

    loadUser();
  }, []);

  // ====================================================
  // LOAD PROFILE + RELAÇÕES
  // ====================================================

  useEffect(() => {
    if (!user) {
      console.warn("⚠️ USER AINDA NÃO CARREGADO");
      setLoading(false);
      return;
    }

    async function loadAll() {
      console.group("📦 LOAD PROFILE + RELATIONS");

      console.log("USER ID:", user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("User profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("PROFILE DATA:", profileData);
      console.log("PROFILE ERROR:", profileError);

      if (!profileData) {
        console.warn("⚠️ PROFILE NÃO EXISTE");
        setLoading(false);
        console.groupEnd();
        return;
      }

      const profileId = profileData.id;

      console.log("PROFILE ID:", profileId);

      // =========================
      // EDUCATION
      // =========================

      const { data: education, error: eduError } = await supabase
        .from("Education")
        .select("*")
        .eq("User profile_id", profileId);

      console.group("🎓 EDUCATION LOAD");
      console.log("EDUCATION RAW:", education);
      console.log("EDUCATION ERROR:", eduError);
      console.groupEnd();

      // =========================
      // JOBS
      // =========================

      const { data: jobs, error: jobsError } = await supabase
        .from("Charge")
        .select("*")
        .eq("User profile_id", profileId);

      console.group("💼 JOBS LOAD");
      console.log("JOBS RAW:", jobs);
      console.log("JOBS ERROR:", jobsError);
      console.groupEnd();

      // =========================
      // OFFICES
      // =========================

      const { data: officesDb, error: officesError } = await supabase
        .from("Multicharge")
        .select("*")
        .eq("User profile_id", profileId);

      console.group("🏢 OFFICES LOAD");
      console.log("OFFICES RAW:", officesDb);
      console.log("OFFICES ERROR:", officesError);
      console.groupEnd();

      const offices = officesDb?.map((o) => o.Office) ?? [];

      setFormData({
        ...profileData,
        education: education ?? [],
        jobs: jobs ?? [],
        offices,
      });

      setLoading(false);

      console.groupEnd();
    }

    loadAll();
  }, [user]);

  // ====================================================
  // BASE64 → FILE
  // ====================================================

  function base64ToFile(base64: string, filename: string, mime: string) {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mime });
  }

  // ====================================================
  // SAVE
  // ====================================================

  async function handleSave(payload: any) {
    console.group("💾 HANDLE SAVE START");

    console.log("RAW PAYLOAD RECEBIDO:");
    console.log(JSON.stringify(payload, null, 2));

    if (!user) {
      console.error("❌ USER NÃO EXISTE");
      console.groupEnd();
      return;
    }

    const {
      education = [],
      jobs = [],
      offices = [],
      ...profileFields
    } = payload;

    console.group("📊 PAYLOAD BREAKDOWN");

    console.log("PROFILE FIELDS:", profileFields);

    console.log("EDUCATION ARRAY:");
    console.log(JSON.stringify(education, null, 2));

    console.log("JOBS ARRAY:");
    console.log(JSON.stringify(jobs, null, 2));

    console.log("OFFICES ARRAY:", offices);

    console.groupEnd();

    let avatarUrl = profileFields["Profile image"];

    // ====================================================
    // IMAGE UPLOAD
    // ====================================================

    if (
      avatarUrl &&
      typeof avatarUrl !== "string" &&
      avatarUrl?.files?.[0]?.contents
    ) {
      console.group("🖼 IMAGE UPLOAD");

      const fileObj = avatarUrl.files[0];

      console.log("FILE OBJECT:", fileObj);

      const fileExt = fileObj.name.split(".").pop();

      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const file = base64ToFile(
        fileObj.contents,
        fileName,
        fileObj.type || "image/png"
      );

      const filePath = `avatars/${fileName}`;

      console.log("UPLOAD PATH:", filePath);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      console.log("UPLOAD ERROR:", uploadError);

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

        avatarUrl = data.publicUrl;

        console.log("PUBLIC URL:", avatarUrl);
      }

      console.groupEnd();
    }

    // ====================================================
    // PROFILE UPSERT
    // ====================================================

    console.group("👤 PROFILE UPSERT");

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

    console.log("PROFILE RESULT:", savedProfile);
    console.log("PROFILE ERROR:", profileError);

    if (profileError || !savedProfile) {
      console.error("❌ PROFILE SAVE FAILED");
      console.groupEnd();
      console.groupEnd();
      return;
    }

    const profileId = savedProfile.id;

    console.log("PROFILE ID FINAL:", profileId);

    console.groupEnd();

    // ====================================================
    // EDUCATION DEBUG
    // ====================================================

    console.group("🎓 EDUCATION SYNC");

    const eduPayload = education.map((e: any, index: number) => {
      console.log(`EDU ITEM ${index}`, e);

      return {
        ...(e.id ? { id: e.id } : {}),
        "User profile_id": profileId,
        "University": e.University ?? "",
        "Major": e.Major ?? "",
        "Graduation year": e["Graduation year"] ?? "",
        "Education level": e["Education level"] ?? "",
      };
    });

    console.log("EDUCATION PAYLOAD FINAL:");
    console.log(JSON.stringify(eduPayload, null, 2));

    const { data: eduResult, error: eduError } = await supabase
      .from("Education")
      .upsert(eduPayload);

    console.log("EDUCATION RESULT:", eduResult);
    console.log("EDUCATION ERROR:", eduError);

    console.groupEnd();

    // ====================================================
    // JOBS DEBUG
    // ====================================================

    console.group("💼 JOBS SYNC");

    const jobsPayload = jobs.map((j: any, index: number) => {
      console.log(`JOB ITEM ${index}`, j);

      return {
        ...(j.id ? { id: j.id } : {}),
        "User profile_id": profileId,
        "Company": j.Company ?? "",
        "Role": j.Role ?? "",
        "Start year": j["Start year"] ?? "",
        "End year": j["End year"] ?? "",
      };
    });

    console.log("JOBS PAYLOAD FINAL:");
    console.log(JSON.stringify(jobsPayload, null, 2));

    const { data: jobsResult, error: jobsError } = await supabase
      .from("Charge")
      .upsert(jobsPayload);

    console.log("JOBS RESULT:", jobsResult);
    console.log("JOBS ERROR:", jobsError);

    console.groupEnd();

    // ====================================================
    // OFFICES
    // ====================================================

    console.group("🏢 OFFICES SYNC");

    const { data: existingOffices } = await supabase
      .from("Multicharge")
      .select("*")
      .eq("User profile_id", profileId);

    console.log("EXISTING OFFICES:", existingOffices);

    const existingValues = existingOffices?.map((o) => o.Office) ?? [];

    const toInsert = offices
      .filter((office: string) => !existingValues.includes(office))
      .map((office: string) => ({
        "Office": office,
        "User profile_id": profileId,
      }));

    console.log("OFFICES TO INSERT:", toInsert);

    if (toInsert.length) {
      const { error } = await supabase.from("Multicharge").insert(toInsert);
      console.log("OFFICES INSERT ERROR:", error);
    }

    console.groupEnd();

    console.groupEnd();

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
          console.log("OFFICES CHANGE:", value);

          setFormData((prev: any) => ({
            ...prev,
            offices: Array.isArray(value) ? [...value] : [value],
          }));
        },
      }}
    />
  );
}
