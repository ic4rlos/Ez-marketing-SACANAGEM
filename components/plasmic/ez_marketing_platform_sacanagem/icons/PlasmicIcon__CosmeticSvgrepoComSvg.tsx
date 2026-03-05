/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CosmeticSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CosmeticSvgrepoComSvgIcon(
  props: CosmeticSvgrepoComSvgIconProps
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
          "M2 12.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V18a3 3 0 11-6 0v-5.5zm1-2h4V6a1 1 0 00-1.447-.895l-2 1A1 1 0 003 7v3.5zm8 0a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0zm4.75 7.21a7.091 7.091 0 001.5 0v1.79h2.25a.75.75 0 010 1.5h-6a.75.75 0 010-1.5h2.25v-1.79z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CosmeticSvgrepoComSvgIcon;
/* prettier-ignore-end */
