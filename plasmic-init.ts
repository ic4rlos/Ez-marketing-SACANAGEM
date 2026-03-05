import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import CropUpload from "@/components/CropUpload";

console.log("🚨🚨 INICIANDO PLASMIC LOADER 🚨🚨");

export const PLASMIC = initPlasmicLoader({
  projects: [
    // seus projetos aqui
  ],
  preview: true,
});

console.log("✅ PLASMIC LOADER CRIADO!");

if (CropUpload) {
  console.log("🔥🔥 CROPUPLOAD IMPORTADO COM SUCESSO!", CropUpload);
} else {
  console.error("❌❌ ERRO: CROPUPLOAD NÃO FOI IMPORTADO!");
}

try {
  console.log("🚨🚨 TENTANDO REGISTRAR CROPUPLOAD 🚨🚨");
  PLASMIC.registerComponent(CropUpload, {
    name: "CropUpload",
    importPath: "@/components/CropUpload",
    isDefaultExport: true,
    props: {}
  });
  console.log("✅✅ CROPUPLOAD REGISTRADO COM SUCESSO!");
} catch (err) {
  console.error("❌❌ ERRO AO REGISTRAR CROPUPLOAD:", err);
}
