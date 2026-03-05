/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ProductSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ProductSvgrepoComSvgIcon(props: ProductSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      version={"1.1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g fill={"none"} fillRule={"evenodd"} stroke={"none"} strokeWidth={"1"}>
        <path
          fill={"#FFF"}
          fillOpacity={".01"}
          fillRule={"nonzero"}
          d={"M24 0H0v24h24z"}
        ></path>

        <path
          stroke={"#212121"}
          strokeLinejoin={"round"}
          strokeWidth={"1.5"}
          d={"M22 7L12 2 2 7v10l10 5 10-5z"}
        ></path>

        <path
          stroke={"#212121"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
          strokeWidth={"1.5"}
          d={"M2 7l10 5m0 10V12m10-5l-10 5m5-7.5l-10 5"}
        ></path>
      </g>
    </svg>
  );
}

export default ProductSvgrepoComSvgIcon;
/* prettier-ignore-end */
