/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TvSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TvSvgrepoComSvgIcon(props: TvSvgrepoComSvgIconProps) {
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
          "M15 7v14m3-10h.01M18 14h.01M18 17h.01M17 3l-5 4-5-4m.8 18h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C21 18.72 21 17.88 21 16.2v-4.4c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C18.72 7 17.88 7 16.2 7H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 9.28 3 10.12 3 11.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C5.28 21 6.12 21 7.8 21z"
        }
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default TvSvgrepoComSvgIcon;
/* prettier-ignore-end */
