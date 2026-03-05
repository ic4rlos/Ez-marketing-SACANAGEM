/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WrenchSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function WrenchSvgrepoComSvgIcon(props: WrenchSvgrepoComSvgIconProps) {
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
        d={
          "M10 3.5L13.058.442a5 5 0 00-6.881 5.881L0 12.5 3.5 16l6.177-6.177A5.005 5.005 0 0016 5a4.98 4.98 0 00-.442-2.058L12.5 6H10V3.5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default WrenchSvgrepoComSvgIcon;
/* prettier-ignore-end */
