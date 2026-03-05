/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CompassDraftingSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function CompassDraftingSvgrepoComSvgIcon(
  props: CompassDraftingSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 16 16"}
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
          "M9 2.17V0H7v2.17a3.001 3.001 0 00-1.623 4.287L4.26 8.319a4.995 4.995 0 01-.976-1.652l-1.886.666a7.007 7.007 0 001.798 2.758L.714 14.228 1.4 16l1.886-.228 2.482-4.136A6.992 6.992 0 008 12a6.99 6.99 0 006.6-4.667l-1.885-.666a4.996 4.996 0 01-.976 1.651l-1.117-1.861A3.001 3.001 0 009 2.17zM7.95 8a3.116 3.116 0 00.1 0l1.118 1.863a5.013 5.013 0 01-2.336 0L7.95 8zM8 4a1 1 0 100 2 1 1 0 000-2z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M12.714 15.772l-1.433-2.389a8.993 8.993 0 002.57-1.545l1.435 2.39L14.6 16l-1.886-.228z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CompassDraftingSvgrepoComSvgIcon;
/* prettier-ignore-end */
