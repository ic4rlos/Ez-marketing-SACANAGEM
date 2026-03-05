/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type QualitySupervisionSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function QualitySupervisionSvgrepoComSvgIcon(
  props: QualitySupervisionSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 1024 1024"}
      fill={"currentColor"}
      className={classNames("plasmic-default__svg", className, "icon")}
      version={"1.1"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M678.585 765.173v157.995l75.698 31.506V723.77a429.38 429.38 0 01-75.698 41.404zm-408.868-41.404v229.33l75.698-31.507v-156.42a429.31 429.31 0 01-75.698-41.403zM512 798.784a428.955 428.955 0 01-105.994-13.242V1024L512 979.886l105.994 44.112V785.542A429.025 429.025 0 01512 798.784zM512 0C308.48 0 142.905 165.576 142.905 369.097S308.48 738.193 512 738.193s369.097-165.576 369.097-369.098S715.521 0 512 0zm0 660.199c-161.346 0-292.611-131.266-292.611-292.612C219.389 206.24 350.654 74.974 512 74.974S804.61 206.24 804.61 367.587C804.61 528.935 673.347 660.2 512 660.2zm0-524.635c-127.936 0-232.022 104.084-232.022 232.023S384.063 599.607 512 599.607s232.022-104.084 232.022-232.022c0-127.937-104.084-232.021-232.022-232.021zm95.362 367.435L512 452.865 416.639 503l18.212-106.184-77.148-75.2 106.618-15.494L512 209.51l47.68 96.611 106.618 15.494-77.148 75.2L607.36 503z"
        }
      ></path>
    </svg>
  );
}

export default QualitySupervisionSvgrepoComSvgIcon;
/* prettier-ignore-end */
