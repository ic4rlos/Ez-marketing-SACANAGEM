import * as React from "react";
import {
  PlasmicLastInput,
  DefaultLastInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicLastInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface LastInputProps extends DefaultLastInputProps {
  // Feel free to add any additional props that this component should receive
}
function LastInput_(props: LastInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicLastInput.useBehavior<LastInputProps>(
    props,
    ref
  );
  return <PlasmicLastInput {...plasmicProps} />;
}

const LastInput = React.forwardRef(LastInput_);

export default Object.assign(
  LastInput,

  {
    __plumeType: "text-input"
  }
);
