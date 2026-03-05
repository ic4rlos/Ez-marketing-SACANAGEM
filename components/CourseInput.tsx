import * as React from "react";
import {
  PlasmicCourseInput,
  DefaultCourseInputProps
} from "./plasmic/ez_marketing_platform_sacanagem/PlasmicCourseInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface CourseInputProps extends DefaultCourseInputProps {
  // Feel free to add any additional props that this component should receive
}
function CourseInput_(props: CourseInputProps, ref: TextInputRef) {
  const { plasmicProps } = PlasmicCourseInput.useBehavior<CourseInputProps>(
    props,
    ref
  );
  return <PlasmicCourseInput {...plasmicProps} />;
}

const CourseInput = React.forwardRef(CourseInput_);

export default Object.assign(
  CourseInput,

  {
    __plumeType: "text-input"
  }
);
