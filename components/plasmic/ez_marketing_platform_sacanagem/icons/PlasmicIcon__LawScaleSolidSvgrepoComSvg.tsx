/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LawScaleSolidSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function LawScaleSolidSvgrepoComSvgIcon(
  props: LawScaleSolidSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 48 48"}
      height={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {})
      }}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g data-name={"Layer 2"}>
        <path
          fill={"none"}
          d={"M0 0h48v48H0z"}
          data-name={"invisible box"}
        ></path>

        <path
          d={
            "M46 25L38 5.7A38.3 38.3 0 0024 3a38.3 38.3 0 00-14 2.7L2 25v2a8 8 0 0016 0v-2l-6.4-15 .3-.8A34.3 34.3 0 0122 7.1V41h-7a2 2 0 000 4h18a2 2 0 000-4h-7V7.1a34.3 34.3 0 0110.1 2.1l.3.8L30 25v2a8 8 0 0016 0v-2zm-31.8 0h-9L10 14.3zM38 14.3L42.2 25h-9z"
          }
          data-name={"Q3 icons"}
        ></path>
      </g>
    </svg>
  );
}

export default LawScaleSolidSvgrepoComSvgIcon;
/* prettier-ignore-end */
