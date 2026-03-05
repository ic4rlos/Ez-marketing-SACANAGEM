/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LanguageSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LanguageSvgIcon(props: LanguageSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 128.33 103.81"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={"M0 .02l24.11 80.19h80.91l-2.36-12.58 16.36 36.18L128.33 0 0 .02z"}
      ></path>
    </svg>
  );
}

export default LanguageSvgIcon;
/* prettier-ignore-end */
