import { GetServerSideProps } from "next";
import {
  PlasmicComponent,
  PlasmicRootProvider,
  initPlasmicLoader,
} from "@plasmicapp/loader-nextjs";

type PageProps = {
  plasmicData: any;
  component: string;
};

// 🔧 Inicializa o loader
const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: process.env.PLASMIC_PROJECT_ID!,
      token: process.env.PLASMIC_PROJECT_API_TOKEN!,
    },
  ],
});

export default function CatchAllPage({
  plasmicData,
  component,
}: PageProps) {
  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <PlasmicComponent component={component} />
    </PlasmicRootProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const catchall = context.params?.catchall;

  const plasmicPath = Array.isArray(catchall)
    ? catchall.join("/")
    : catchall ?? "";

  const plasmicData = await PLASMIC.fetchComponentData(plasmicPath);

  if (!plasmicData || !plasmicData.entryCompMetas.length) {
    return { notFound: true };
  }

  const component = plasmicData.entryCompMetas[0].displayName;

  return {
    props: {
      plasmicData,
      component,
    },
  };
};
