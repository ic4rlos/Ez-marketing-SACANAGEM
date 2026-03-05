/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EnergySvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function EnergySvgrepoComSvgIcon(props: EnergySvgrepoComSvgIconProps) {
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

      <path d={"M13 9h6L8 22l3-10H5l5-10h7z"}></path>
    </svg>
  );
}

export default EnergySvgrepoComSvgIcon;
/* prettier-ignore-end */
