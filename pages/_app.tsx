import type { AppProps } from "next/app";
import { PlasmicRootProvider } from "@plasmicapp/react-web";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlasmicRootProvider>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}
