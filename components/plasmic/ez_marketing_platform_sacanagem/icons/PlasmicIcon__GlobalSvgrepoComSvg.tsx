/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type GlobalSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function GlobalSvgrepoComSvgIcon(props: GlobalSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M7 3.338A9.954 9.954 0 0112 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
        }
        stroke={"currentColor"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
      ></path>

      <path
        d={
          "M14.828 19.071c-.371.929-.812 1.665-1.297 2.168-.486.502-1.006.761-1.531.761-.525 0-1.045-.259-1.53-.761-.486-.503-.927-1.24-1.298-2.168-.372-.929-.667-2.03-.868-3.244A23.614 23.614 0 018 12c0-1.313.103-2.614.304-3.827s.496-2.315.868-3.244c.371-.929.812-1.665 1.297-2.168C10.955 2.26 11.475 2 12 2c.525 0 1.045.259 1.53.761.486.503.927 1.24 1.298 2.168.372.929.667 2.03.867 3.244C15.896 9.386 16 10.687 16 12c0 1.313-.104 2.614-.305 3.827M2 12h8m12 0h-8"
        }
        stroke={"currentColor"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
      ></path>
    </svg>
  );
}

export default GlobalSvgrepoComSvgIcon;
/* prettier-ignore-end */
