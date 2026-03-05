/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LossChartSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LossChartSvgrepoComSvgIcon(
  props: LossChartSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 350 350"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M40 310V0H0v350h350v-40z"}></path>

      <path
        d={
          "M211.232 145.228l52.814 75.579-18.272 12.768 69.369 32.427-6.595-76.293-18.272 12.768-69.672-99.705-74.588 43.341-55.428-71.884-25.341 19.542 72.572 94.116z"
        }
      ></path>
    </svg>
  );
}

export default LossChartSvgrepoComSvgIcon;
/* prettier-ignore-end */
