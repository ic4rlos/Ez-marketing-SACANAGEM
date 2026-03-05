/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type BriefcaseSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function BriefcaseSvgIcon(props: BriefcaseSvgIconProps) {
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
        "feather feather-briefcase"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect x={"2"} y={"7"} width={"20"} height={"14"} rx={"2"} ry={"2"}></rect>

      <path d={"M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"}></path>
    </svg>
  );
}

export default BriefcaseSvgIcon;
/* prettier-ignore-end */
