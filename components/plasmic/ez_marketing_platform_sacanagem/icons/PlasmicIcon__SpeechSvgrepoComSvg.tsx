/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type SpeechSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function SpeechSvgrepoComSvgIcon(props: SpeechSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 457 457"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M370.439 207.419h-61.262v-26.393c0-32.077-18.822-59.836-45.998-72.828 15.119-10.837 24.998-28.541 24.998-48.521C288.177 26.771 261.407 0 228.5 0s-59.678 26.771-59.678 59.677c0 19.98 9.88 37.685 25 48.522-27.175 12.992-45.995 40.75-45.995 72.826v26.393H86.561a9.5 9.5 0 00-9.5 9.5v42.352a9.5 9.5 0 009.5 9.5h10l21.835 179.875a9.5 9.5 0 009.431 8.355h201.352a9.5 9.5 0 009.431-8.355l21.835-179.875h9.995a9.5 9.5 0 009.5-9.5v-42.352a9.5 9.5 0 00-9.501-9.499zM187.823 59.677C187.823 37.248 206.071 19 228.5 19s40.677 18.248 40.677 40.677c0 22.413-18.221 40.649-40.628 40.676l-.047-.001-.049.001c-22.408-.025-40.63-18.262-40.63-40.676zm-20.994 121.349c0-33.991 27.641-61.646 61.625-61.673l.047.001.049-.001c33.986.026 61.628 27.681 61.628 61.673v26.393H275.65v-23.44a9.503 9.503 0 00-2.782-6.718l-5.214-5.214c.372-1.455.591-2.97.591-4.539 0-10.126-8.237-18.364-18.363-18.364s-18.364 8.238-18.364 18.364 8.238 18.364 18.364 18.364c1.454 0 2.862-.188 4.219-.508l2.55 2.55v19.505h-56.292v-19.505l2.591-2.591c1.406.346 2.867.55 4.379.55 10.126 0 18.364-8.238 18.364-18.364s-8.238-18.364-18.364-18.364-18.363 8.238-18.363 18.364c0 1.511.204 2.973.55 4.379l-5.374 5.374a9.5 9.5 0 00-2.782 6.717v23.44h-14.528v-26.393zm-70.768 45.393h264.878v23.352H96.061v-23.352zM320.761 438H136.244L115.7 268.771h225.605L320.761 438z"
        }
      ></path>
    </svg>
  );
}

export default SpeechSvgrepoComSvgIcon;
/* prettier-ignore-end */
