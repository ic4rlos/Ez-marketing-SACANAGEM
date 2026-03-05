import * as React from "react";
import {
  PlasmicPlusButton,
  DefaultPlusButtonProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicPlusButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface PlusButtonProps extends DefaultPlusButtonProps {
  // Feel free to add any additional props that this component should receive
}
function PlusButton_(props: PlusButtonProps, ref: ButtonRef) {
  const { plasmicProps } = PlasmicPlusButton.useBehavior<PlusButtonProps>(
    props,
    ref
  );
  return <PlasmicPlusButton {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<PlusButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<PlusButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const PlusButton = React.forwardRef(PlusButton_) as any as ButtonComponentType;

export default Object.assign(PlusButton, { __plumeType: "button" });
