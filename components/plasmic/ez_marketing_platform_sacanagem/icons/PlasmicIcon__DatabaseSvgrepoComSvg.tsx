/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type DatabaseSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function DatabaseSvgrepoComSvgIcon(
  props: DatabaseSvgrepoComSvgIconProps
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
        d={
          "M13.137 6.91c.281-.14.575-.31.863-.51V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.4c.288.2.582.37.863.51C4.28 7.62 6.1 8 8 8c1.9 0 3.719-.38 5.137-1.09zM2 11.4V13c0 1.657 2.686 3 6 3s6-1.343 6-3v-1.6c-.288.2-.582.37-.863.51C11.72 12.62 9.9 13 8 13c-1.9 0-3.719-.38-5.137-1.09A7.037 7.037 0 012 11.4zM8 0c3.314 0 6 1.343 6 3s-2.686 3-6 3-6-1.343-6-3 2.686-3 6-3z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default DatabaseSvgrepoComSvgIcon;
/* prettier-ignore-end */
