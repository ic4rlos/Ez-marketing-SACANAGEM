/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Car2SvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Car2SvgrepoComSvgIcon(props: Car2SvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 -15.43 122.88 122.88"}
      version={"1.1"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M10.17 34.23C-.81 28.65.45 22.43 11.48 23.08l2.47 4.63 5.09-15.83C21.04 5.65 24.37 0 30.9 0H96c6.53 0 10.29 5.54 11.87 11.87l3.82 15.35 2.2-4.14c11.34-.66 12.35 5.93.35 11.62l1.95 2.99c7.89 8.11 7.15 22.45 5.92 42.48v8.14c0 2.04-1.67 3.71-3.71 3.71h-15.83c-2.04 0-3.71-1.67-3.71-3.71v-4.54H24.04v4.54c0 2.04-1.67 3.71-3.71 3.71H4.5c-2.04 0-3.71-1.67-3.71-3.71V78.2c0-.2.02-.39.04-.58-1.2-15.37-2.89-35.47 9.34-43.39zM30.38 58.7l-14.06-1.77c-3.32-.37-4.21 1.03-3.08 3.89l1.52 3.69c.49.95 1.14 1.64 1.9 2.12.89.55 1.96.82 3.15.87l12.54.1c3.03-.01 4.34-1.22 3.39-4-.78-2.61-2.56-4.25-5.36-4.9zm24-5.91h14.4c.85 0 1.55.7 1.55 1.55 0 .85-.7 1.55-1.55 1.55h-14.4c-.85 0-1.55-.7-1.55-1.55-.01-.85.69-1.55 1.55-1.55zm35.58 20.36h14.4c.85 0 1.55.7 1.55 1.55 0 .85-.7 1.55-1.55 1.55h-14.4c-.85 0-1.55-.7-1.55-1.55 0-.85.69-1.55 1.55-1.55zM92.5 58.7l14.06-1.77c3.32-.37 4.21 1.03 3.08 3.89l-1.52 3.69c-.49.95-1.14 1.64-1.9 2.12-.89.55-1.96.82-3.15.87l-12.54.1c-3.03-.01-4.34-1.22-3.39-4 .78-2.61 2.56-4.25 5.36-4.9zM18.41 73.15h14.4c.85 0 1.55.7 1.55 1.55 0 .85-.7 1.55-1.55 1.55h-14.4c-.85 0-1.55-.7-1.55-1.55 0-.85.7-1.55 1.55-1.55zm.82-41.95h86.82l-3.83-15.92c-1.05-4.85-4.07-9.05-9.05-9.05H33.06c-4.97 0-7.52 4.31-9.05 9.05L19.23 31.2v.75-.75z"
        }
        fillRule={"evenodd"}
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default Car2SvgrepoComSvgIcon;
/* prettier-ignore-end */
