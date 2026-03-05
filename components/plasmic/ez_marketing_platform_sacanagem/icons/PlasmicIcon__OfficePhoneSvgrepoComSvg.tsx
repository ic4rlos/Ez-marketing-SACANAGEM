/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type OfficePhoneSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function OfficePhoneSvgrepoComSvgIcon(
  props: OfficePhoneSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      data-name={"Layer 1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M9.14 4.39h11.45A1.91 1.91 0 0122.5 6.3v11.45a1.91 1.91 0 01-1.91 1.91H9.14h0V4.39h0z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
      ></path>

      <rect
        x={"1.5"}
        y={"2.48"}
        width={"7.64"}
        height={"20.05"}
        rx={"1.96"}
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
      ></rect>

      <path
        fill={"none"}
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.91"}
        d={
          "M12 12.02h1.91m.95 0h1.91m.96 0h1.91M12 15.84h1.91m.95 0h1.91m.96 0h1.91M12 8.2h7.64"
        }
      ></path>
    </svg>
  );
}

export default OfficePhoneSvgrepoComSvgIcon;
/* prettier-ignore-end */
