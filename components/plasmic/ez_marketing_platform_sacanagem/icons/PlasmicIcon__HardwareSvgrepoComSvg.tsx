/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HardwareSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function HardwareSvgrepoComSvgIcon(
  props: HardwareSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 16 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        data-name={"Path 94"}
        d={
          "M14.5 0h-13A1.5 1.5 0 000 1.5v13A1.5 1.5 0 001.5 16h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0014.5 0zm0 15H5v-.5a.5.5 0 00-1 0v.5H3v-2.5a.5.5 0 00-1 0V15h-.5a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5H6v8.5a.5.5 0 00.5.5h1.592a1.5 1.5 0 100-1H7V1h7.5a.5.5 0 01.5.5V2h-2.5a.5.5 0 000 1H15v1h-1.5a.5.5 0 000 1H15v1h-5V4.908a1.5 1.5 0 10-1 0V6.5a.5.5 0 00.5.5H15v7.5a.5.5 0 01-.5.5zM9 9.5a.5.5 0 11.5.5.5.5 0 01-.5-.5zm0-6a.5.5 0 11.5.5.5.5 0 01-.5-.5zm3.5 7.5a1.5 1.5 0 00-1.408 1H5.707L4 10.293V4.908a1.5 1.5 0 10-1 0V10.5a.5.5 0 00.146.354l2 2A.5.5 0 005.5 13h5.592a1.5 1.5 0 101.408-2zm-9-8a.5.5 0 11-.5.5.5.5 0 01.5-.5zm9 10a.5.5 0 11.5-.5.5.5 0 01-.5.5z"
        }
      ></path>
    </svg>
  );
}

export default HardwareSvgrepoComSvgIcon;
/* prettier-ignore-end */
