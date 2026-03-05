/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FilmSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function FilmSvgrepoComSvgIcon(props: FilmSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M7 5v14M17 5v14M3 8h4m10 0h4M3 16h4m10 0h4M3 12h18M6.2 20h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 18.48 21 17.92 21 16.8V7.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 4 18.92 4 17.8 4H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 5.52 3 6.08 3 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 20 5.08 20 6.2 20z"
        }
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default FilmSvgrepoComSvgIcon;
/* prettier-ignore-end */
