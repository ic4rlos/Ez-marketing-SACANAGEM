/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type DoctorHealthMedicalStethoscopeSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function DoctorHealthMedicalStethoscopeSvgrepoComSvgIcon(
  props: DoctorHealthMedicalStethoscopeSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 100 100"}
      version={"1.1"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M32.9 69c.9 5.3 5.3 11.1 9.4 13.9 2.5 1.7 5.3 2.5 8 2.5.9 0 1.7-.1 2.5-.3 9.7-2.1 11.7-14 10.7-21.5-.5-3.8-1.6-7.6-3.2-11.3 7.3 0 13.2-5.9 13.2-13.2v-22c0-1.4-1.1-2.5-2.5-2.5h-8.7v4h7.2v20.6c0 5.1-4.1 9.2-9.2 9.2H54c-5.1 0-9.2-4.1-9.2-9.2V18.6h7.3v-4h-8.8c-1.4 0-2.5 1.1-2.5 2.5v22.1c0 7.3 5.9 13.2 13.2 13.2h2c1.8 3.8 3.1 7.9 3.6 11.8.8 5.8-.6 15.6-7.6 17.1-2.4.5-5.1-.1-7.5-1.7-3.2-2.2-6.7-6.8-7.6-10.7 3.5-1 6.2-4.2 6.2-8.1 0-4.6-3.8-8.4-8.4-8.4s-8.4 3.8-8.4 8.4c.1 4 2.9 7.4 6.6 8.2zm1.9-12.6c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4z"
        }
      ></path>
    </svg>
  );
}

export default DoctorHealthMedicalStethoscopeSvgrepoComSvgIcon;
/* prettier-ignore-end */
