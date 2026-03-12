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
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  // =========================
  // LOAD PROFILE + RELAÇÕES
  // =========================
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
  // SAVE (CORRIGIDO)
  // =========================
  async function handleSave(payload: any) {
    if (!user) return;

    const {
      education = [],
      jobs = [],
      offices = [],
      ...profileFields
    } = payload;

    let avatarUrl = profileFields["Profile image"];

    // Upload de imagem
    if (avatarUrl && typeof avatarUrl !== "string" && avatarUrl?.files?.[0]?.contents) {
      const fileObj = avatarUrl.files[0];
      const fileExt = fileObj.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const file = base64ToFile(fileObj.contents, fileName, fileObj.type || "image/png");
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
    }

    // 1. Upsert do Perfil Principal
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

    if (profileError || !savedProfile) {
      console.error("Erro ao salvar perfil:", profileError);
      return;
    }

    const profileId = savedProfile.id;

    // 2. EDUCATION SYNC
    const { data: existingEdu } = await supabase.from("Education").select("id").eq("User profile_id", profileId);
    const existingEduIds = existingEdu?.map((e) => e.id) ?? [];
    const currentEduIds = education.map((e: any) => e.id).filter(Boolean);
    
    const eduToDelete = existingEduIds.filter((id) => !currentEduIds.includes(id));
    if (eduToDelete.length) await supabase.from("Education").delete().in("id", eduToDelete);

    const eduPayload = education.map((e: any) => ({
      ...(e.id ? { id: e.id } : {}), // Crucial: Só envia ID se ele existir
      "User profile_id": profileId,
      University: e.University ?? "",
      Major: e.Major ?? "",
      "Graduation year": e["Graduation year"] ?? "",
      "Education level": e["Education level"] ?? "",
    }));

    if (eduPayload.length) await supabase.from("Education").upsert(eduPayload);

    // 3. JOBS (CHARGE) SYNC
    const { data: existingJobs } = await supabase.from("Charge").select("id").eq("User profile_id", profileId);
    const existingJobIds = existingJobs?.map((j) => j.id) ?? [];
    const currentJobIds = jobs.map((j: any) => j.id).filter(Boolean);

    const jobsToDelete = existingJobIds.filter((id) => !currentJobIds.includes(id));
    if (jobsToDelete.length) await supabase.from("Charge").delete().in("id", jobsToDelete);

    const jobsPayload = jobs.map((j: any) => ({
      ...(j.id ? { id: j.id } : {}),
      "User profile_id": profileId,
      Company: j.Company ?? "",
      Role: j.Role ?? "",
      "Start year": j["Start year"] ?? "",
      "End year": j["End year"] ?? "",
    }));

    if (jobsPayload.length) await supabase.from("Charge").upsert(jobsPayload);

    // 4. OFFICES (MULTICHARGE) SYNC
    const { data: existingOffices } = await supabase.from("Multicharge").select("*").eq("User profile_id", profileId);
    const existingValues = existingOffices?.map((o) => o.Office) ?? [];
    const toDeleteOffices = existingOffices?.filter((o) => !offices.includes(o.Office)).map((o) => o.id) ?? [];

    if (toDeleteOffices.length) await supabase.from("Multicharge").delete().in("id", toDeleteOffices);

    const toInsertOffices = offices
      .filter((off: string) => !existingValues.includes(off))
      .map((off: string) => ({ Office: off, "User profile_id": profileId }));

    if (toInsertOffices.length) await supabase.from("Multicharge").insert(toInsertOffices);

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
