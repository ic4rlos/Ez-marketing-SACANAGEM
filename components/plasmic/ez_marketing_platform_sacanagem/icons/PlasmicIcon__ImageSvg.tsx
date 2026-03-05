/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ImageSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ImageSvgIcon(props: ImageSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeWidth={"2"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "feather feather-image"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect x={"3"} y={"3"} width={"18"} height={"18"} rx={"2"} ry={"2"}></rect>

      <circle cx={"8.5"} cy={"8.5"} r={"1.5"}></circle>

      <path d={"M21 15l-5-5L5 21"}></path>
    </svg>
  );
}

export default ImageSvgIcon;
/* prettier-ignore-end */
