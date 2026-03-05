/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PillarSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PillarSvgrepoComSvgIcon(props: PillarSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      data-name={"Layer 1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M19.64 1.52H4.36a2.87 2.87 0 102.69 3.82H17a2.86 2.86 0 102.69-3.82zm-2.7 3.82H7.06m10.67 18.14V6.51M6.27 23.48V6.51m3.82 2.65v14.32m3.82-14.32v14.32"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
      ></path>
    </svg>
  );
}

export default PillarSvgrepoComSvgIcon;
/* prettier-ignore-end */
