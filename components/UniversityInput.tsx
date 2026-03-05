import * as React from "react";
import {
  PlasmicUniversityInput,
  DefaultUniversityInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicUniversityInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface UniversityInputProps extends DefaultUniversityInputProps {
  // Feel free to add any additional props that this component should receive
}
function UniversityInput_(props: UniversityInputProps, ref: TextInputRef) {
  const { plasmicProps } =
    PlasmicUniversityInput.useBehavior<UniversityInputProps>(props, ref);
  return <PlasmicUniversityInput {...plasmicProps} />;
}

const UniversityInput = React.forwardRef(UniversityInput_);

export default Object.assign(
  UniversityInput,

  {
    __plumeType: "text-input"
  }
);
