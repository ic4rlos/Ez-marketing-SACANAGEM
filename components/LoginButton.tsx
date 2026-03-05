import * as React from "react";
import {
  PlasmicLoginButton,
  DefaultLoginButtonProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicLoginButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface LoginButtonProps extends DefaultLoginButtonProps {
  // Feel free to add any additional props that this component should receive
}
function LoginButton_(props: LoginButtonProps, ref: ButtonRef) {
  const { plasmicProps } = PlasmicLoginButton.useBehavior<LoginButtonProps>(
    props,
    ref
  );
  return <PlasmicLoginButton {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<LoginButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<LoginButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const LoginButton = React.forwardRef(
  LoginButton_
) as any as ButtonComponentType;

export default Object.assign(LoginButton, { __plumeType: "button" });
