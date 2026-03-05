/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CodeSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CodeSvgrepoComSvgIcon(props: CodeSvgrepoComSvgIconProps) {
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
          "M8.01.859l-2 14 1.98.282 2-14L8.01.86zM12.5 11.5l-1.414-1.414L13.172 8l-2.086-2.086L12.5 4.5 16 8l-3.5 3.5zM2.828 8l2.086 2.086L3.5 11.5 0 8l3.5-3.5 1.414 1.414L2.828 8z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CodeSvgrepoComSvgIcon;
/* prettier-ignore-end */
