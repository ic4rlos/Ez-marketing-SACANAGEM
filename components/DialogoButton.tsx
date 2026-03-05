import * as React from "react";
import {
  PlasmicDialogoButton,
  DefaultDialogoButtonProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicDialogoButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface DialogoButtonProps extends DefaultDialogoButtonProps {
  // Feel free to add any additional props that this component should receive
}
function DialogoButton_(props: DialogoButtonProps, ref: ButtonRef) {
  const { plasmicProps } = PlasmicDialogoButton.useBehavior<DialogoButtonProps>(
    props,
    ref
  );
  return <PlasmicDialogoButton {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<DialogoButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<DialogoButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const DialogoButton = React.forwardRef(
  DialogoButton_
) as any as ButtonComponentType;

export default Object.assign(DialogoButton, { __plumeType: "button" });
