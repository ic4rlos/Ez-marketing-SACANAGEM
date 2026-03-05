import * as React from "react";
import {
  PlasmicLikeButton,
  DefaultLikeButtonProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicLikeButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface LikeButtonProps extends DefaultLikeButtonProps {
  // Feel free to add any additional props that this component should receive
}
function LikeButton_(props: LikeButtonProps, ref: ButtonRef) {
  const { plasmicProps } = PlasmicLikeButton.useBehavior<LikeButtonProps>(
    props,
    ref
  );
  return <PlasmicLikeButton {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<LikeButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<LikeButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const LikeButton = React.forwardRef(LikeButton_) as any as ButtonComponentType;

export default Object.assign(LikeButton, { __plumeType: "button" });
