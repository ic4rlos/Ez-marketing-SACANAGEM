import * as React from "react";
import {
  PlasmicGraduationInput,
  DefaultGraduationInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicGraduationInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface GraduationInputProps extends DefaultGraduationInputProps {
  // Feel free to add any additional props that this component should receive
}
function GraduationInput_(props: GraduationInputProps, ref: TextInputRef) {
  const { plasmicProps } =
    PlasmicGraduationInput.useBehavior<GraduationInputProps>(props, ref);
  return <PlasmicGraduationInput {...plasmicProps} />;
}

const GraduationInput = React.forwardRef(GraduationInput_);

export default Object.assign(
  GraduationInput,

  {
    __plumeType: "text-input"
  }
);
