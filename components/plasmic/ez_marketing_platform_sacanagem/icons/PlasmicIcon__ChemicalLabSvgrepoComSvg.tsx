/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChemicalLabSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChemicalLabSvgrepoComSvgIcon(
  props: ChemicalLabSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      data-name={"Layer 1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
        d={
          "M7.23 1.5h9.54m-1.91 4.77V1.5H9.14v4.77L2.7 19.15a2.3 2.3 0 00-.25 1h0a2.32 2.32 0 002.32 2.35h14.46a2.32 2.32 0 002.32-2.32h0a2.3 2.3 0 00-.25-1zm-7.97 4.49c5-2.17 5.31 1.9 10.42.41M7.23 18.68h1.91m.95-3.82H12m2.86 1.91h1.91"
        }
      ></path>
    </svg>
  );
}

export default ChemicalLabSvgrepoComSvgIcon;
/* prettier-ignore-end */
