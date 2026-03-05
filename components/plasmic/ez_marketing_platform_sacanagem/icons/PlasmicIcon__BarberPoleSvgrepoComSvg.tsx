/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type BarberPoleSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function BarberPoleSvgrepoComSvgIcon(
  props: BarberPoleSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 64 64"}
      aria-hidden={"true"}
      role={"img"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "iconify iconify--emojione-monotone"
      )}
      preserveAspectRatio={"xMidYMid meet"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M45 19.449c1.104 0 2-.824 2-1.84v-1.943c0-1.018-.896-1.842-2-1.842 0-15.766-26-15.766-26 0-1.104 0-2 .824-2 1.842v1.943c0 1.016.896 1.84 2 1.84h.281v36.926H19c-1.104 0-2 .824-2 1.84v1.943c0 1.016.896 1.842 2 1.842h26c1.104 0 2-.826 2-1.842v-1.943c0-1.016-.896-1.84-2-1.84h-.281V19.449H45M20.914 40.781v-5.898c7.391-1.809 14.781-8.826 22.172-10.635v5.896c-7.391 1.809-14.781 8.827-22.172 10.637m22.172-5.361v5.896c-7.391 1.809-14.781 8.826-22.172 10.635v-5.896c7.391-1.811 14.781-8.828 22.172-10.635M23.709 56.375c6.459-2.584 12.918-8.126 19.377-9.705v5.896c-3.299.808-5.967 2.272-8.566 3.809H23.709m-2.795-26.844v-5.898c3.058-.748 6.115-2.39 9.172-4.184h11.191c-6.788 2.377-13.576 8.419-20.363 10.082"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default BarberPoleSvgrepoComSvgIcon;
/* prettier-ignore-end */
