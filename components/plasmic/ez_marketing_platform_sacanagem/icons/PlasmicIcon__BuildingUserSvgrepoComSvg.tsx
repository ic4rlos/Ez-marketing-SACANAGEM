/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type BuildingUserSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function BuildingUserSvgrepoComSvgIcon(
  props: BuildingUserSvgrepoComSvgIconProps
) {
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
          "M6 7h1m-1 3h1m4 0h1m-1 3h1m-6 0h1m4-6h1M7 21v-3a2 2 0 114 0v3H7zm0 0H3V4.6c0-.56 0-.84.109-1.054a1 1 0 01.437-.437C3.76 3 4.04 3 4.6 3h8.8c.56 0 .84 0 1.054.109a1 1 0 01.437.437C15 3.76 15 4.04 15 4.6V9m4.7 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.8 7.5v-.5A2.5 2.5 0 0019 18h-1.5a2.5 2.5 0 00-2.5 2.5v.5h6.5z"
        }
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default BuildingUserSvgrepoComSvgIcon;
/* prettier-ignore-end */
