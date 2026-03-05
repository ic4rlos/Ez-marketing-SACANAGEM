/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ItProfessionalProgrammerItProfessionalSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function ItProfessionalProgrammerItProfessionalSvgrepoComSvgIcon(
  props: ItProfessionalProgrammerItProfessionalSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 256 240"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M84.635 20.256c18.383 0 33.286 14.903 33.286 33.286s-14.903 33.286-33.286 33.286-33.286-14.903-33.286-33.286 14.902-33.286 33.286-33.286zM31.002 145.011c0-2.499 1.606-4.194 4.194-4.194s4.194 1.606 4.194 4.194v92.986h91.469v-92.986c0-2.499 1.606-4.194 4.194-4.194 2.499 0 4.194 1.606 4.194 4.194v92.986h29.092V136.623c0-22.934-18.74-41.585-41.585-41.585h-8.388l-24.451 38.015-2.945-28.467 4.016-9.638H76.96l4.016 9.638-3.123 28.645-24.452-38.193h-9.816C20.651 95.038 2 113.778 2 136.623v101.375h29.092v-92.986h-.09zM214 76h34.415c3.072 0 5.585-2.513 5.585-5.585V7.927C254 4.903 251.361 2 248.38 2h-94.717C150.548 2 148 4.548 148 7.663v63.002a5.336 5.336 0 005.336 5.336H188v9h-9.113c.028.02.113.04.113.047v5.513s-.162.44-.113.44H222v-6h-8V76zm-58-12V11h90v53h-90z"
        }
      ></path>
    </svg>
  );
}

export default ItProfessionalProgrammerItProfessionalSvgrepoComSvgIcon;
/* prettier-ignore-end */
