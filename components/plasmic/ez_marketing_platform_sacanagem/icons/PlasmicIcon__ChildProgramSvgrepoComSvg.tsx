/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChildProgramSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChildProgramSvgrepoComSvgIcon(
  props: ChildProgramSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 48 48"}
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
          "M15 20.25a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-2.5 1.5a1.5 1.5 0 00-1.248.668l-4 6a1.5 1.5 0 002.496 1.664L11 28.204v9.046a1.5 1.5 0 103 0v-5h2v5a1.5 1.5 0 103 0v-9.046l1.252 1.878a1.5 1.5 0 002.496-1.664l-4-6a1.5 1.5 0 00-1.248-.668h-5zM37 10.405c0-.297-.34-.493-.635-.365L33 11.5l-3.364-1.46c-.295-.128-.636.068-.636.366v2.188c0 .298.34.494.636.366L33 11.5l3.365 1.46c.295.128.635-.068.635-.366v-2.188zm-4 9.845a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-2.5 1.5a1.5 1.5 0 00-1.248.668l-4 6a1.5 1.5 0 002.496 1.664L29 28.204V30l-2 4h2v3.25a1.5 1.5 0 103 0V34h2v3.25a1.5 1.5 0 103 0V34h2l-2-4v-1.796l1.252 1.878a1.5 1.5 0 002.496-1.664l-4-6a1.5 1.5 0 00-1.248-.668h-5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ChildProgramSvgrepoComSvgIcon;
/* prettier-ignore-end */
