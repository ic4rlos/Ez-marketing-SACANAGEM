/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type SecurityFreeMaterialSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function SecurityFreeMaterialSvgrepoComSvgIcon(
  props: SecurityFreeMaterialSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 512 512"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M256.001 0L29.89 130.537c0 47.476 4.506 88.936 12.057 125.463C88.61 481.721 256.001 512 256.001 512s167.389-30.279 214.053-256c7.551-36.527 12.057-77.986 12.057-125.463L256.001 0zm.117 466.723a5.344 5.344 0 00-.117-.039V256H91.122c-6.67-29.738-11.109-63.506-12.394-101.93L255.999 51.728h.002V256h164.895c-35.26 157.404-133.569 200.774-164.778 210.723z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default SecurityFreeMaterialSvgrepoComSvgIcon;
/* prettier-ignore-end */
