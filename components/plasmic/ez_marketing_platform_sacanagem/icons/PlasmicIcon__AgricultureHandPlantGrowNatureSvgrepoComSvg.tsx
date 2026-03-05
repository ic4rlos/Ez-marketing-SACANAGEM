/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AgricultureHandPlantGrowNatureSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function AgricultureHandPlantGrowNatureSvgrepoComSvgIcon(
  props: AgricultureHandPlantGrowNatureSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 32 32"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M29.9 16.5c-.2-.3-.5-.5-.9-.5-2.2 0-4.3 1-5.6 2.8l-.9 1.2c-1.1 1.3-2.8 2-4.5 2h-3c-.6 0-1-.4-1-1s.4-1 1-1h1.9c1.6 0 3.1-1.3 3.1-2.9V17c0-.5-.5-1-1-1v-5.1c3.9-.5 7-3.9 7-7.9 0-.6-.4-1-1-1-2.4 0-4.5 1.1-6 2.7V2c0-.6-.4-1-1-1s-1 .4-1 1v5.7C15.5 6.1 13.4 5 11 5c-.6 0-1 .4-1 1 0 4.1 3.1 7.4 7 7.9V16h-4.1c-3.6 0-6.5 1.6-8.1 4.2l-2.7 4.2c-.2.3-.2.7 0 1l3 5c.1.2.4.4.6.5h.2c.2 0 .4-.1.6-.2 3.8-2.5 8.2-3.8 12.7-3.8 3.3 0 6.3-1.8 7.9-4.7l2.7-4.8c.2-.2.2-.6.1-.9z"
        }
      ></path>
    </svg>
  );
}

export default AgricultureHandPlantGrowNatureSvgrepoComSvgIcon;
/* prettier-ignore-end */
