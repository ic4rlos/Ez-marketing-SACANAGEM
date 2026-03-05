/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EngineeringHelmetCogSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function EngineeringHelmetCogSvgrepoComSvgIcon(
  props: EngineeringHelmetCogSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 32 32"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M12 13l-2-9h0c3.8-1.9 8.2-1.9 12 0h0l-2 9"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></path>

      <path
        d={
          "M21.7 5.6C24.9 7.5 27 11 27 15v2l2 2H3l2-2v-2c0-4 2.1-7.5 5.3-9.4M7.9 19.1c-.1.6-.2 1.3-.2 1.9 0 .7.1 1.3.2 1.9 1-.1 2 .3 2.5 1.3.5.9.4 2-.2 2.8.9.9 2.1 1.6 3.4 2 .4-.9 1.3-1.6 2.4-1.6s2 .7 2.4 1.6c1.3-.4 2.4-1.1 3.4-2-.6-.8-.7-1.9-.2-2.8.5-.9 1.6-1.4 2.5-1.3.1-.6.2-1.3.2-1.9 0-.7-.1-1.3-.2-1.9"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></path>

      <path
        d={
          "M13.8 19c-.5.5-.8 1.2-.8 2 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.8-.3-1.5-.8-2"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></path>
    </svg>
  );
}

export default EngineeringHelmetCogSvgrepoComSvgIcon;
/* prettier-ignore-end */
