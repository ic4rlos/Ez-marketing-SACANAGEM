/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type InformationArchitectureSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function InformationArchitectureSvgrepoComSvgIcon(
  props: InformationArchitectureSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M5.5 3a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-9zm0-1h9A1.5 1.5 0 0116 3.5v3A1.5 1.5 0 0114.5 8h-9A1.5 1.5 0 014 6.5v-3A1.5 1.5 0 015.5 2zm1 2h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5zm3 0h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5zM17 16v-1h-2.5a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5H17v-.5a.5.5 0 00-.5-.5h-9a.5.5 0 00-.5.5v.5h2.5a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 019.5 15h-6A1.5 1.5 0 012 13.5v-1A1.5 1.5 0 013.5 11H6v-.5A1.5 1.5 0 017.5 9H10V7.5a.5.5 0 111 0V9h5.5a1.5 1.5 0 011.5 1.5v.5h2.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H18v1.085a1.5 1.5 0 011 1.415v.5h.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-2a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5h.5v-.5a.5.5 0 00-.5-.5H12v1h.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 019 20.5v-1a1.5 1.5 0 011.5-1.5h.5v-1H5.5a.5.5 0 00-.5.5v.5h.5A1.5 1.5 0 017 19.5v1A1.5 1.5 0 015.5 22h-2A1.5 1.5 0 012 20.5v-1A1.5 1.5 0 013.5 18H4v-.5A1.5 1.5 0 015.5 16H17zM12.5 4h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5zm2 8a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h6a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-6zm-11 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h6a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-6zm0 7a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2zm7 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2zm7 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2z"
        }
      ></path>
    </svg>
  );
}

export default InformationArchitectureSvgrepoComSvgIcon;
/* prettier-ignore-end */
