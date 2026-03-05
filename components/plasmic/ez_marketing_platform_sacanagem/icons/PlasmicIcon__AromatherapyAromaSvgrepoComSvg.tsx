/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AromatherapyAromaSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function AromatherapyAromaSvgrepoComSvgIcon(
  props: AromatherapyAromaSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 512.001 512.001"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M461.159 512L430.58 272.264c-3.634-28.496-27.884-49.848-56.611-49.848h-9.017c35.277-18.932 59.268-56.162 59.268-99.001H87.779c0 42.839 23.992 80.069 59.268 99.001h-9.017c-28.727 0-52.975 21.353-56.611 49.848L50.842 512H154.1v-94.153c0-56.279 45.622-101.9 101.9-101.9s101.9 45.622 101.9 101.9V512h103.259zM310.52 60.014c0-2.806.326-3.34 2.135-6.302 2.799-4.582 7.029-11.509 7.029-23.707s-4.231-19.124-7.03-23.707c-1.808-2.96-2.134-3.493-2.134-6.299h-33.391c0 12.197 4.231 19.123 7.029 23.706 1.809 2.961 2.135 3.494 2.135 6.3s-.326 3.34-2.135 6.302c-2.798 4.582-7.029 11.509-7.029 23.707s4.231 19.124 7.029 23.708c1.809 2.962 2.135 3.496 2.135 6.302h33.391c0-12.197-4.231-19.123-7.029-23.707-1.809-2.961-2.135-3.496-2.135-6.303zm-84.812 0c0-2.806.326-3.34 2.135-6.302 2.799-4.582 7.029-11.509 7.029-23.707s-4.231-19.124-7.03-23.707c-1.808-2.96-2.134-3.493-2.134-6.299h-33.391c0 12.197 4.231 19.123 7.029 23.706 1.809 2.961 2.135 3.494 2.135 6.3s-.326 3.34-2.135 6.302c-2.798 4.582-7.029 11.509-7.029 23.707s4.231 19.124 7.029 23.708c1.809 2.962 2.135 3.496 2.135 6.302h33.391c0-12.197-4.231-19.123-7.029-23.707-1.809-2.961-2.135-3.496-2.135-6.303z"
        }
      ></path>

      <path
        d={
          "M248.552 393.943c-8.306 27.316-32.203 49.046-32.203 79.321 0 21.394 17.343 38.737 38.736 38.737h1.795c21.303 0 38.607-17.2 38.736-38.502l.001-.235c1.279-34.363-20.303-58.493-47.065-79.321z"
        }
      ></path>
    </svg>
  );
}

export default AromatherapyAromaSvgrepoComSvgIcon;
/* prettier-ignore-end */
