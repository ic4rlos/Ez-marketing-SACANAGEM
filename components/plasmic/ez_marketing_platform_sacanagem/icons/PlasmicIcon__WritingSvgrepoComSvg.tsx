/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WritingSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function WritingSvgrepoComSvgIcon(props: WritingSvgrepoComSvgIconProps) {
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

      <path
        d={
          "M6.643 13.072L17.414 2.3a1.027 1.027 0 011.452 0L20.7 4.134a1.027 1.027 0 010 1.452L9.928 16.357 5 18zM21 20H3a1 1 0 000 2h18a1 1 0 000-2z"
        }
      ></path>
    </svg>
  );
}

export default WritingSvgrepoComSvgIcon;
/* prettier-ignore-end */
