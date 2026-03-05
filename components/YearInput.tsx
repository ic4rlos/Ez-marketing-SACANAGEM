import * as React from "react";
import {
  PlasmicYearInput,
  DefaultYearInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicYearInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface YearInputProps extends DefaultYearInputProps {
  // Feel free to add any additional props that this component should receive
}
function YearInput_(props: YearInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicYearInput.useBehavior<YearInputProps>(
    props,
    ref
  );
  return <PlasmicYearInput {...plasmicProps} />;
}

const YearInput = React.forwardRef(YearInput_);

export default Object.assign(
  YearInput,

  {
    __plumeType: "text-input"
  }
);
