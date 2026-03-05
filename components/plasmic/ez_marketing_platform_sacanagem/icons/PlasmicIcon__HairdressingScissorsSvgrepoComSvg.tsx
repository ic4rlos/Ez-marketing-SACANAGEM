/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HairdressingScissorsSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function HairdressingScissorsSvgrepoComSvgIcon(
  props: HairdressingScissorsSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 19.384 19.384"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g fill={"currentColor"}>
        <path
          d={
            "M17.575 5.917l-5.296.786-1.49.71-1.194.064-2.717.741c-.146-.521-.499-.937-.971-1.207-.597-.341-1.379-.447-2.165-.234-1.412.384-2.294 1.657-1.971 2.845.143.526.5.944.975 1.217.596.341 1.38.448 2.164.235a3.02 3.02 0 00.929-.428c.002-.002.004-.004.008-.004.021-.017.044-.032.067-.051C7.55 9.379 8.679 9.053 9.317 8.984c-.07.638-.396 1.767-1.608 3.403-.018.022-.034.046-.051.066l-.002.008a3.067 3.067 0 00-.429.929c-.212.785-.106 1.568.235 2.166.271.474.691.831 1.218.974.018.006.036.008.054.012a4.095 4.095 0 001.192 2.674l.003.004a.561.561 0 00.8-.79 2.97 2.97 0 01-.876-1.954c.759-.27 1.413-.974 1.671-1.916.213-.786.106-1.568-.235-2.166-.269-.471-.686-.825-1.205-.969l.739-2.719c.578-.192 2.41-.675 2.41-.675s3.391-1.449 4.066-1.632c.646-.391.276-.482.276-.482zM4.597 9.919c-.445.122-.916.078-1.257-.118-.151-.086-.345-.24-.415-.493-.146-.539.373-1.169 1.132-1.376.451-.122.91-.081 1.257.118.15.085.345.242.414.494.147.539-.372 1.17-1.131 1.375zm5.655 3.069c.197.347.24.806.117 1.257-.207.76-.836 1.277-1.376 1.131-.253-.068-.407-.263-.493-.413-.195-.343-.239-.813-.118-1.258.207-.76.837-1.278 1.376-1.132.251.07.408.266.494.415z"
          }
        ></path>

        <path
          d={
            "M11.642 5.597l.694-5.454s-.145-.503-.385.375c-.128.474-1.701 4.253-1.701 4.253s-.471 1.619-.655 2.172l1.194-.063.853-1.283z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default HairdressingScissorsSvgrepoComSvgIcon;
/* prettier-ignore-end */
