import * as React from "react";
import {
  PlasmicSignInWithGoogle,
  DefaultSignInWithGoogleProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicSignInWithGoogle";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface SignInWithGoogleProps extends DefaultSignInWithGoogleProps {
  // Feel free to add any additional props that this component should receive
}
function SignInWithGoogle_(props: SignInWithGoogleProps, ref: ButtonRef) {
  const { plasmicProps } =
    PlasmicSignInWithGoogle.useBehavior<SignInWithGoogleProps>(props, ref);
  return <PlasmicSignInWithGoogle {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<SignInWithGoogleProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<SignInWithGoogleProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const SignInWithGoogle = React.forwardRef(
  SignInWithGoogle_
) as any as ButtonComponentType;

export default Object.assign(SignInWithGoogle, { __plumeType: "button" });
