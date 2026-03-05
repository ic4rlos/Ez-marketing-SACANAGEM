/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type SpeechBubbleSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function SpeechBubbleSvgrepoComSvgIcon(
  props: SpeechBubbleSvgrepoComSvgIconProps
) {
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
          "M15.858 4.136c-7.772 0-14.072 4.661-14.072 10.412 0 3.234 1.992 6.123 5.119 8.033l-.874 6.614 6.292-4.566c1.129.216 2.314.331 3.535.331 7.772 0 14.072-4.662 14.072-10.412S23.63 4.136 15.858 4.136zM9.797 17.124a1.434 1.434 0 110 2.868 1.434 1.434 0 010-2.868zm6.041 2.868a1.434 1.434 0 110-2.868 1.434 1.434 0 010 2.868zm6.231 0a1.434 1.434 0 110-2.868 1.434 1.434 0 010 2.868z"
        }
      ></path>
    </svg>
  );
}

export default SpeechBubbleSvgrepoComSvgIcon;
/* prettier-ignore-end */
