/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon9IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon9Icon(props: Icon9IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      version={"1.1"}
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 32 32"}
      xmlSpace={"preserve"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle
        cx={"22"}
        cy={"19"}
        r={"4"}
        fill={"none"}
        stroke={"#000"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></circle>

      <path
        fill={"none"}
        stroke={"#000"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
        d={"M25 22v9l-3-1-3 1v-9M7 11h11M7 15h5"}
      ></path>

      <path
        fill={"none"}
        stroke={"#000"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
        d={"M19 26H3V6h26v20h-4"}
      ></path>
    </svg>
  );
}

export default Icon9Icon;
/* prettier-ignore-end */
