/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MoneySvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function MoneySvgrepoComSvgIcon(props: MoneySvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"-0.5 0 25 25"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M12.7 17.11v1.11a.67.67 0 01-1.34 0v-1.14a3.39 3.39 0 01-2.22-1.39.7.7 0 01-.15-.42.64.64 0 01.67-.63.61.61 0 01.45.2 2.82 2.82 0 001.25.92v-2.55c-1.33-.52-2-1.3-2-2.31a2.27 2.27 0 012-2.17v-1.1a.67.67 0 011.34 0v1.09a2.8 2.8 0 011.86 1.16.68.68 0 01.16.4.65.65 0 01-.64.67.631.631 0 01-.47-.23 2.12 2.12 0 00-.91-.66v2.25l.25.1c1.27.5 2.06 1.22 2.06 2.36a2.4 2.4 0 01-2.31 2.34zm-1.34-5.38V10.1a.82.82 0 00-.54.79.9.9 0 00.54.84zm2.19 3.07c0-.48-.33-.77-.85-1v2a1 1 0 00.85-1z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M18 3.97H6a4 4 0 00-4 4v10a4 4 0 004 4h12a4 4 0 004-4v-10a4 4 0 00-4-4z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default MoneySvgrepoComSvgIcon;
/* prettier-ignore-end */
