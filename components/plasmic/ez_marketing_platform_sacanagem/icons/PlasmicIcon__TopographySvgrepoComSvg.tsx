/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TopographySvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TopographySvgrepoComSvgIcon(
  props: TopographySvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 100 100"}
      aria-hidden={"true"}
      role={"img"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "iconify iconify--gis"
      )}
      preserveAspectRatio={"xMidYMid meet"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M36.771 7.082a3.274 3.274 0 00-3.273 3.273v4.582H15.063v45.38h18.435v4.581a3.274 3.274 0 003.273 3.274h3.575v4.746h3.588L39.143 100h5.67l4.79-27.082h.793L55.19 100h5.67l-4.79-27.082h3.585v-4.746h3.575a3.274 3.274 0 003.273-3.274v-4.582h18.436V14.937H66.501v-4.582a3.274 3.274 0 00-3.273-3.273H36.77zm3.272 6.547h19.914v37.523H40.043V13.63zm9.885 6.816a6.708 6.708 0 00-6.637 6.71 6.709 6.709 0 106.637-6.71z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default TopographySvgrepoComSvgIcon;
/* prettier-ignore-end */
