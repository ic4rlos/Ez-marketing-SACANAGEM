/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HumanResourcesSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function HumanResourcesSvgrepoComSvgIcon(
  props: HumanResourcesSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 360 360"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"164.999"} cy={"120.012"} r={"45"}></circle>

      <path
        d={
          "M165 165.013c-38.659 0-70 31.337-70 70h139.999c0-38.663-31.341-70-69.999-70z"
        }
      ></path>

      <path
        d={
          "M355.606 334.381l-63.854-63.855C315.619 241.903 330 205.107 330 165.013c0-90.981-74.019-165-165-165S0 74.031 0 165.013s74.019 165 165 165c40.107 0 76.914-14.391 105.541-38.271l63.853 63.853c2.929 2.929 6.768 4.393 10.606 4.393s7.678-1.464 10.606-4.393c5.859-5.859 5.859-15.356 0-21.214zM30 165.013c0-74.439 60.561-135 135-135s135 60.561 135 135-60.561 135-135 135-135-60.561-135-135z"
        }
      ></path>
    </svg>
  );
}

export default HumanResourcesSvgrepoComSvgIcon;
/* prettier-ignore-end */
