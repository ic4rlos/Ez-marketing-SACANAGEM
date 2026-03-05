/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TimeSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TimeSvgrepoComSvgIcon(props: TimeSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"1.5"}
        d={"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m0-15v6m4.24 4.24L12 12"}
      ></path>
    </svg>
  );
}

export default TimeSvgrepoComSvgIcon;
/* prettier-ignore-end */
