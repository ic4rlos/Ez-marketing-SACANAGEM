/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Project20PxFillSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function Project20PxFillSvgrepoComSvgIcon(
  props: Project20PxFillSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 20 20"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M2 9h7V2H2zm9-7v7h7V2zM2 18h7v-7H2zm9 0h7v-7h-7z"}></path>
    </svg>
  );
}

export default Project20PxFillSvgrepoComSvgIcon;
/* prettier-ignore-end */
