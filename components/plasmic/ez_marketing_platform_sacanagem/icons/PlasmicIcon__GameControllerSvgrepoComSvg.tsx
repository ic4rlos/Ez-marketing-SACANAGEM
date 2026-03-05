/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type GameControllerSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function GameControllerSvgrepoComSvgIcon(
  props: GameControllerSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 16 16"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M0 13l3 1 3-3h4l3 3 3-1-.752-8.272A3 3 0 0012.26 2H3.74A3 3 0 00.752 4.728L0 13zm12-7a1 1 0 100-2 1 1 0 000 2zm0 2a1 1 0 11-2 0 1 1 0 012 0zM5 8a2 2 0 100-4 2 2 0 000 4z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default GameControllerSvgrepoComSvgIcon;
/* prettier-ignore-end */
