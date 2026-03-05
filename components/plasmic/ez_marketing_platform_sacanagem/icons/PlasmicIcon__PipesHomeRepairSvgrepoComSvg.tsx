/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PipesHomeRepairSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function PipesHomeRepairSvgrepoComSvgIcon(
  props: PipesHomeRepairSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 512 512"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M460.8 375.612V264.533c0-37.641-30.626-68.267-68.267-68.267H204.8v-59.733h15.932c10.035 0 18.202-8.166 18.202-18.202V86.468c0-10.035-8.166-18.202-18.202-18.202H204.8V18.202C204.8 8.166 196.634 0 186.598 0H86.468C76.433 0 68.267 8.166 68.267 18.202v50.065H52.335c-10.035 0-18.202 8.166-18.202 18.202v31.863c0 10.035 8.166 18.202 18.202 18.202h15.932v238.933H52.335c-10.035 0-18.202 8.166-18.202 18.202v31.863c0 10.035 8.166 18.202 18.202 18.202h15.932v50.065c0 10.035 8.166 18.202 18.202 18.202h100.13c10.035 0 18.202-8.166 18.202-18.202v-50.065h15.932c10.035 0 18.202-8.166 18.202-18.202v-31.863c0-10.035-8.166-18.202-18.202-18.202H204.8v-59.733h110.933c14.114 0 25.6 11.477 25.6 25.6v34.278c-9.523.785-17.067 8.704-17.067 18.432v31.113c0 10.24 8.337 18.577 18.577 18.577H459.29c10.24 0 18.577-8.337 18.577-18.577v-31.113c0-9.728-7.544-17.647-17.067-18.432zm-240.068 16.921c.623 0 1.135.503 1.135 1.135v31.863a1.14 1.14 0 01-1.135 1.135H52.335a1.14 1.14 0 01-1.135-1.135v-31.863c0-.631.512-1.135 1.135-1.135h168.397zm-24.465-273.066H52.335a1.14 1.14 0 01-1.135-1.135V86.468c0-.631.512-1.135 1.135-1.135h168.397c.623 0 1.135.503 1.135 1.135v31.863a1.14 1.14 0 01-1.135 1.135h-24.465zM460.8 425.156c0 .836-.674 1.51-1.51 1.51H342.844c-.836 0-1.51-.674-1.51-1.51v-31.113c0-.836.674-1.51 1.51-1.51H459.29c.836 0 1.51.674 1.51 1.51v31.113z"
        }
      ></path>
    </svg>
  );
}

export default PipesHomeRepairSvgrepoComSvgIcon;
/* prettier-ignore-end */
