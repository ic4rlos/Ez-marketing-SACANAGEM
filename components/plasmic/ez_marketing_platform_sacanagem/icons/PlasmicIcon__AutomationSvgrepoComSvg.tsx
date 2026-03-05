/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AutomationSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function AutomationSvgrepoComSvgIcon(
  props: AutomationSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 48 48"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M12 19.77a11.13 11.13 0 00-2.26.94l.26 4.53L5.44 25a11.13 11.13 0 00-.94 2.26l3.37 3.05-3.37 3a10.68 10.68 0 00.94 2.26l4.56-.18-.23 4.54a11.09 11.09 0 002.26.93l3.05-3.37 3 3.37a10.64 10.64 0 002.26-.93l-.23-4.54 4.54.23a10.64 10.64 0 00.93-2.26l-3.37-3 3.37-3.05a11.09 11.09 0 00-.92-2.31l-4.54.23.23-4.53a10.68 10.68 0 00-2.26-.94l-3 3.37z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>

      <circle
        cx={"15.05"}
        cy={"30.32"}
        r={"3.96"}
        fill={"none"}
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></circle>

      <path
        d={
          "M29.91 7.14a11 11 0 00-2.27.93l.24 4.54-4.54-.23a10.64 10.64 0 00-.93 2.26l3.36 3-3.36 3.05a11.09 11.09 0 00.93 2.31l4.54-.23-.24 4.53a11 11 0 002.27.94l3-3.37 3 3.37a11.13 11.13 0 002.26-.94L38 22.76l4.53.23a11.13 11.13 0 00.94-2.26l-3.37-3.05 3.37-3a10.68 10.68 0 00-.94-2.26l-4.53.19.23-4.54A11 11 0 0036 7.14l-3 3.37z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>

      <circle
        cx={"32.95"}
        cy={"17.68"}
        r={"3.96"}
        fill={"none"}
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></circle>
    </svg>
  );
}

export default AutomationSvgrepoComSvgIcon;
/* prettier-ignore-end */
