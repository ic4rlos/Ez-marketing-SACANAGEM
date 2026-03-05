/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type IconIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function IconIcon(props: IconIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      viewBox={"0 0 24 24"}
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"12"} cy={"6"} r={"4"} fill={"#1C274C"}></circle>

      <ellipse
        opacity={".5"}
        cx={"12"}
        cy={"17"}
        rx={"7"}
        ry={"4"}
        fill={"#1C274C"}
      ></ellipse>
    </svg>
  );
}

export default IconIcon;
/* prettier-ignore-end */
