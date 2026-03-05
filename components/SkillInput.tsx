import * as React from "react";
import {
  PlasmicSkillInput,
  DefaultSkillInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicSkillInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface SkillInputProps extends DefaultSkillInputProps {
  // Feel free to add any additional props that this component should receive
}
function SkillInput_(props: SkillInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicSkillInput.useBehavior<SkillInputProps>(
    props,
    ref
  );
  return <PlasmicSkillInput {...plasmicProps} />;
}

const SkillInput = React.forwardRef(SkillInput_);

export default Object.assign(
  SkillInput,

  {
    __plumeType: "text-input"
  }
);
