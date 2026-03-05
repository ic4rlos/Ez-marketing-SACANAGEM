import * as React from "react";
import {
  PlasmicFirstInput,
  DefaultFirstInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicFirstInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface FirstInputProps extends DefaultFirstInputProps {
  // Feel free to add any additional props that this component should receive
}
function FirstInput_(props: FirstInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicFirstInput.useBehavior<FirstInputProps>(
    props,
    ref
  );
  return <PlasmicFirstInput {...plasmicProps} />;
}

const FirstInput = React.forwardRef(FirstInput_);

export default Object.assign(
  FirstInput,

  {
    __plumeType: "text-input"
  }
);
