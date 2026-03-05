/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ToyTeddyBearBabySvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function ToyTeddyBearBabySvgrepoComSvgIcon(
  props: ToyTeddyBearBabySvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 32 32"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <ellipse
        cx={"16"}
        cy={"12.9"}
        rx={"8"}
        ry={"8.1"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></ellipse>

      <path
        d={
          "M8 12c-1.7-.4-3-2-3-4 0-2.2 1.8-4 4-4 1.3 0 2.5.7 3.2 1.7m7.6 0c.7-1 1.9-1.7 3.2-1.7 2.2 0 4 1.8 4 4.1 0 1.9-1.3 3.5-3 4M14 12v1m4-1v1m-2 1v2"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></path>

      <ellipse
        transform={"rotate(-44.871 8.496 24.502)"}
        cx={"8.5"}
        cy={"24.5"}
        rx={"2.8"}
        ry={"4.1"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></ellipse>

      <ellipse
        transform={"rotate(-45.13 23.503 24.5)"}
        cx={"23.5"}
        cy={"24.5"}
        rx={"4.1"}
        ry={"2.8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></ellipse>

      <path
        d={
          "M9 21.4V21c0-1.1.3-2.2.7-3.1m10.5 8.7C19 27.5 17.6 28 16 28s-3-.5-4.2-1.4m10.5-8.7c.5.9.7 2 .7 3.1v.4m-16.8-.1c-.1-.4-.2-.9-.2-1.3 0-2 1.1-3.7 2.6-4m14.8 0c1.5.2 2.6 1.9 2.6 4 0 .4-.1.9-.2 1.3M10 18c0-2.2 2.7-4 6-4s6 1.8 6 4"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeMiterlimit={"10"}
      ></path>
    </svg>
  );
}

export default ToyTeddyBearBabySvgrepoComSvgIcon;
/* prettier-ignore-end */
