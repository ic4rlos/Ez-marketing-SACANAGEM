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

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

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

  async function handleSave(payload: any) {
    if (!user) return;

    const {
      education = [],
      jobs = [],
      offices = [],
      ...profileFields
    } = payload;

    let avatarUrl = profileFields["Profile image"];

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

/* EDUCATION — DEBUG FINAL */

console.log("========== EDUCATION DEBUG START ==========");

/* 1 — O QUE CHEGOU DO FORM */
console.log("FORM EDUCATION ARRAY:");
console.log(JSON.stringify(education, null, 2));

console.log("FORM EDUCATION TYPE:", typeof education);
console.log("FORM EDUCATION LENGTH:", education?.length);

/* 2 — CARREGAR O QUE EXISTE NO BANCO */

const { data: existingEducation, error: existingError } = await supabase
  .from("Education")
  .select("*")
  .eq("User profile_id", profileId);

console.log("EXISTING EDUCATION FROM DB:");
console.log(JSON.stringify(existingEducation, null, 2));

console.log("EXISTING EDUCATION ERROR:", existingError);

/* 3 — ANALISAR CADA ITEM DO FORM */

education.forEach((e, i) => {
  console.log(`----- FORM ITEM ${i} -----`);
  console.log("RAW ITEM:", e);
  console.log("KEYS:", Object.keys(e));
  console.log("Education level value:", e?.["Education level"]);
  console.log("University:", e?.University);
  console.log("Major:", e?.Major);
  console.log("Graduation year:", e?.["Graduation year"]);
});

/* 4 — IDS EXISTENTES */

const existingEduIds = existingEducation?.map((e) => e.id) ?? [];
const payloadEduIds = education?.map((e) => e.id).filter(Boolean) ?? [];

console.log("existingEduIds:", existingEduIds);
console.log("payloadEduIds:", payloadEduIds);

const eduToDelete = existingEduIds.filter(
  (id) => !payloadEduIds.includes(id)
);

console.log("eduToDelete:", eduToDelete);

if (eduToDelete.length) {
  const { error } = await supabase
    .from("Education")
    .delete()
    .in("id", eduToDelete);

  console.log("DELETE RESULT:", error);
}

/* 5 — MAPEAMENTO FINAL */

const eduPayload = education.map((e, i) => {
  const mapped = {
    ...(e.id ? { id: e.id } : {}),
    "User profile_id": profileId,
    "University": e?.University ?? "",
    "Major": e?.Major ?? "",
    "Graduation year": e?.["Graduation year"] ?? "",
    "Education level": e?.["Education level"] ?? "",
  };

  console.log(`----- MAPPED ITEM ${i} -----`);
  console.log(JSON.stringify(mapped, null, 2));

  return mapped;
});

console.log("FINAL PAYLOAD SENT TO SUPABASE:");
console.log(JSON.stringify(eduPayload, null, 2));

/* 6 — UPSERT */

if (eduPayload.length) {
  const { data, error } = await supabase
    .from("Education")
    .upsert(eduPayload, { onConflict: "id" })
    .select();

  console.log("UPSERT RESULT DATA:");
  console.log(JSON.stringify(data, null, 2));

  console.log("UPSERT RESULT ERROR:");
  console.log(error);
}

console.log("========== EDUCATION DEBUG END ==========");

    /* OFFICES */

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
      await supabase.from("Multicharge").delete().in("id", toDeleteOffices);
    }

    const toInsert = offices
      .filter((office: string) => !existingValues.includes(office))
      .map((office: string) => ({
        "Office": office,
        "User profile_id": profileId,
      }));

    if (toInsert.length) {
      await supabase.from("Multicharge").insert(toInsert);
    }

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
