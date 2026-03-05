/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type BookSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function BookSvgrepoComSvgIcon(props: BookSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 32 32"}
      version={"1.1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M0 23.008V5.024Q0 4 .48 3.136t1.28-1.44Q2.784 1.024 4 1.024q.736 0 1.472.256l10.016 4q.064.032.512.32.448-.288.512-.32l10.016-4q.736-.256 1.472-.256 1.248 0 2.24.672.832.576 1.312 1.44T32 5.024v17.984q0 1.248-.672 2.24t-1.856 1.472l-9.984 4q-.736.288-1.472.288-1.024 0-2.016-.576-.992.576-1.984.576-.768 0-1.504-.288l-9.984-4q-1.152-.448-1.824-1.472T0 23.008zm4 0l10.016 4V9.024L4 5.024v17.984zm2.016-1.184v-2.016l5.984 2.4v2.016zm0-4v-2.016l5.984 2.4v2.016zm0-4v-2.016l5.984 2.4v2.016zm0-4V7.808l5.984 2.4v2.016zm12 17.184l9.984-4V5.024l-9.984 4v17.984zM20 24.224v-2.016l6.016-2.4v2.016zm0-4v-2.016l6.016-2.4v2.016zm0-4v-2.016l6.016-2.4v2.016zm0-4v-2.016l6.016-2.4v2.016z"
        }
      ></path>
    </svg>
  );
}

export default BookSvgrepoComSvgIcon;
/* prettier-ignore-end */
