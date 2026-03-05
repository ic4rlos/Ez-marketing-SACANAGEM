export const runtime = "experimental-edge";
export const dynamic = "force-dynamic";

import * as React from "react";
import nextDynamic from "next/dynamic";
import { registerComponent } from "@plasmicapp/react-web/lib/host";
import CropUpload from "@/components/CropUpload";  // ✅ alias

// Carregar o PlasmicCanvasHost apenas no client (sem SSR)
const PlasmicCanvasHost = nextDynamic(
  () =>
    import("@plasmicapp/react-web/lib/host").then((m) => m.PlasmicCanvasHost),
  { ssr: false }
);

// Registrar o componente customizado
registerComponent(CropUpload, {
  name: "CropUpload",
  importPath: "@/components/CropUpload",  // ✅ alias
  isDefaultExport: true,
  props: {
    value: {
      type: "string",
      defaultValue: "",
    },
    onChange: {
      type: "eventHandler",
      argTypes: [
        {
          name: "url",
          type: "string",
        },
      ],
    },
    accept: {
      type: "string",
      defaultValue: "image/*",
    },
    className: {
      type: "class",
    },
    children: {
      type: "slot",
    },
  },
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
