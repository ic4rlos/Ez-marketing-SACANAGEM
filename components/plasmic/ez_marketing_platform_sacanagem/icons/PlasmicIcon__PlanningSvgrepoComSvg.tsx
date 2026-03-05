/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PlanningSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PlanningSvgrepoComSvgIcon(
  props: PlanningSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 60 60"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M8.3 19l2.8 7.4c.1.3.5.6.9.6s.8-.3 1.1-.6l2.8-7.4H33v3H22v2h12c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1H7c-3.9 0-7 3.1-7 7v14h2V24c0-2.8 2.2-5 5-5h1.3zm3.8 4.2L10.5 19h3.2l-1.6 4.2z"
        }
      ></path>

      <path
        d={
          "M11 29h2v2h-2zm0 4h2v2h-2zm0-17h2c2.8 0 5-2.2 5-5V8c0-2.8-2.2-5-5-5h-2C8.2 3 6 5.2 6 8v3c0 2.8 2.2 5 5 5zM8 8c0-1.7 1.3-3 3-3h2c1.7 0 3 1.3 3 3v3c0 1.7-1.3 3-3 3h-2c-1.7 0-3-1.3-3-3V8z"
        }
      ></path>

      <path
        d={
          "M59 50h-3v-6c0-.6-.4-1-1-1h-7V16h5c.6 0 1-.4 1-1V3c0-1.7-1.3-3-3-3H27c-1.7 0-3 1.3-3 3v12c0 .6.4 1 1 1h21v27H32V26h-2v17h-7c-.6 0-1 .4-1 1v6h-3V25h-2v33h-4V39h-2v19H7V25H5v34c0 .6.4 1 1 1h53c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zM27 2h24c.6 0 1 .4 1 1v6H26V3c0-.6.4-1 1-1zm4 12h-5v-3h26v3H31zm-7 31h30v5H24v-5zm-5 13v-6h39v2H35v2h23v2H19z"
        }
      ></path>

      <path d={"M29 54h4v2h-4z"}></path>
    </svg>
  );
}

export default PlanningSvgrepoComSvgIcon;
/* prettier-ignore-end */
