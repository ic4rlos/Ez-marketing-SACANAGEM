/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LandscapeSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LandscapeSvgrepoComSvgIcon(
  props: LandscapeSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"6.5"} cy={"6.5"} r={"2.5"}></circle>

      <path d={"M14 7l-5.223 8.487L7 13l-5 7h20z"}></path>
    </svg>
  );
}

export default LandscapeSvgrepoComSvgIcon;
/* prettier-ignore-end */
