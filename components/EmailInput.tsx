import * as React from "react";
import {
  PlasmicEmailInput,
  DefaultEmailInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicEmailInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface EmailInputProps extends DefaultEmailInputProps {
  // Feel free to add any additional props that this component should receive
}
function EmailInput_(props: EmailInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicEmailInput.useBehavior<EmailInputProps>(
    props,
    ref
  );
  return <PlasmicEmailInput {...plasmicProps} />;
}

const EmailInput = React.forwardRef(EmailInput_);

export default Object.assign(
  EmailInput,

  {
    __plumeType: "text-input"
  }
);
