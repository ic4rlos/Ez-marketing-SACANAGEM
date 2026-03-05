/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HerbalMixPlusSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function HerbalMixPlusSvgrepoComSvgIcon(
  props: HerbalMixPlusSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M22.5 4.2a2.73 2.73 0 01-.79 1.91l-3 3h-7.66l6.84-6.85A2.7 2.7 0 0122.5 4.2zm0 4.94v1.91a10.51 10.51 0 01-6.68 9.77v1.68H8.18v-1.68a10.51 10.51 0 01-6.68-9.77V9.14zM9.14 14.86h5.72M12 12v5.73"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
      ></path>
    </svg>
  );
}

export default HerbalMixPlusSvgrepoComSvgIcon;
/* prettier-ignore-end */
