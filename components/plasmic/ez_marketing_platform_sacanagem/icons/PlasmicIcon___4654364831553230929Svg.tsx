/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type _4654364831553230929SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function _4654364831553230929SvgIcon(
  props: _4654364831553230929SvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 20 15"}
      height={"1em"}
      width={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {})
      }}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M10 12.474L0 3.649V15h20V3.649l-10 8.825zm.001-2.662L0 .981V0h20v.981l-9.999 8.831z"
        }
        fill={"currentColor"}
        fillRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default _4654364831553230929SvgIcon;
/* prettier-ignore-end */
