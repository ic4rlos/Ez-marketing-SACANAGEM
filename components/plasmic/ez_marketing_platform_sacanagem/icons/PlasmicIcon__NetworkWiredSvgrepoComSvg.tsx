/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type NetworkWiredSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function NetworkWiredSvgrepoComSvgIcon(
  props: NetworkWiredSvgrepoComSvgIconProps
) {
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
          "M3 12h18m-9-4v4m-5.5 0v4m11-4v4m-7.4-8h3.8c.56 0 .84 0 1.054-.109a1 1 0 00.437-.437c.109-.214.109-.494.109-1.054V4.6c0-.56 0-.84-.109-1.054a1 1 0 00-.437-.437C14.74 3 14.46 3 13.9 3h-3.8c-.56 0-.84 0-1.054.109a1 1 0 00-.437.437C8.5 3.76 8.5 4.04 8.5 4.6v1.8c0 .56 0 .84.109 1.054a1 1 0 00.437.437C9.26 8 9.54 8 10.1 8zm5.5 13h3.8c.56 0 .84 0 1.054-.109a1 1 0 00.437-.437C21 20.24 21 19.96 21 19.4v-1.8c0-.56 0-.84-.109-1.054a1 1 0 00-.437-.437C20.24 16 19.96 16 19.4 16h-3.8c-.56 0-.84 0-1.054.109a1 1 0 00-.437.437C14 16.76 14 17.04 14 17.6v1.8c0 .56 0 .84.109 1.054a1 1 0 00.437.437C14.76 21 15.04 21 15.6 21zm-11 0h3.8c.56 0 .84 0 1.054-.109a1 1 0 00.437-.437C10 20.24 10 19.96 10 19.4v-1.8c0-.56 0-.84-.109-1.054a1 1 0 00-.437-.437C9.24 16 8.96 16 8.4 16H4.6c-.56 0-.84 0-1.054.109a1 1 0 00-.437.437C3 16.76 3 17.04 3 17.6v1.8c0 .56 0 .84.109 1.054a1 1 0 00.437.437C3.76 21 4.04 21 4.6 21z"
        }
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default NetworkWiredSvgrepoComSvgIcon;
/* prettier-ignore-end */
