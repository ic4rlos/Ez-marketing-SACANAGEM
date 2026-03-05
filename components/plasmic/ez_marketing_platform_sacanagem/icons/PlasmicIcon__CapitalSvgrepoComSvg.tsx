/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CapitalSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CapitalSvgrepoComSvgIcon(props: CapitalSvgrepoComSvgIconProps) {
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
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M13 2a1 1 0 10-2 0v2.083A6.002 6.002 0 006 10v.268A2 2 0 005 12H4a3 3 0 00-3 3v4a2 2 0 002 2h3a1 1 0 001 1h10a1 1 0 001-1h3a2 2 0 002-2v-4a3 3 0 00-3-3h-1a2 2 0 00-1-1.732V10a6.002 6.002 0 00-5-5.917V2zm-1 4a4 4 0 00-4 4h8a4 4 0 00-4-4zm-5 7v-1h10v1H7zm-1 2a1 1 0 01-1-1H4a1 1 0 00-1 1v4h3v-4zm10 0v5h-1v-2.75c0-.69-.448-1.25-1-1.25s-1 .56-1 1.25V20h-2v-2.75c0-.69-.448-1.25-1-1.25s-1 .56-1 1.25V20H8v-5h8zm2 0v4h3v-4a1 1 0 00-1-1h-1a1 1 0 01-1 1z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CapitalSvgrepoComSvgIcon;
/* prettier-ignore-end */
