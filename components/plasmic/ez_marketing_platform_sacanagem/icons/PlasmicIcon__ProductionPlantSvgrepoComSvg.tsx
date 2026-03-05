/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ProductionPlantSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function ProductionPlantSvgrepoComSvgIcon(
  props: ProductionPlantSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 292.074 292.073"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M190.166 182.858h-23.509c-4.863 0-8.814 3.945-8.814 8.814a8.813 8.813 0 008.814 8.815h23.509c4.864 0 8.821-3.939 8.821-8.815 0-4.874-3.957-8.814-8.821-8.814zm44.862 0h-24.235c-4.864 0-8.815 3.945-8.815 8.814a8.813 8.813 0 008.815 8.815h24.235c4.863 0 8.803-3.939 8.803-8.815 0-4.874-3.94-8.814-8.803-8.814zM60.415 106.727h77.5a8.81 8.81 0 008.815-8.812 8.81 8.81 0 00-8.815-8.817h-77.5a8.814 8.814 0 00-8.818 8.817c-.001 4.869 3.947 8.812 8.818 8.812z"
        }
      ></path>

      <path
        d={
          "M283.247 265.34h-11.518V116.655c0-4.87-3.957-8.818-8.821-8.818h-19.077V17.909c0-4.87-3.951-8.818-8.814-8.818h-24.235c-4.864 0-8.815 3.948-8.815 8.818v89.928h-7.752V17.909c0-4.87-3.957-8.818-8.821-8.818h-24.229c-4.863 0-8.809 3.948-8.809 8.818v89.928H29.166c-4.87 0-8.824 3.948-8.824 8.818V265.34H8.818A8.815 8.815 0 000 274.167a8.812 8.812 0 008.818 8.815h274.441c4.864 0 8.815-3.945 8.815-8.815a8.823 8.823 0 00-8.827-8.827zm-214.024 0v-64.857h59.862v64.857H69.223z"
        }
      ></path>
    </svg>
  );
}

export default ProductionPlantSvgrepoComSvgIcon;
/* prettier-ignore-end */
