/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type DogSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function DogSvgrepoComSvgIcon(props: DogSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 512 512"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M124.755 221.208l4.234 5.813 131.516-101.828c-38.656-49.891-68.422-88.453-68.422-88.453-7.359-10.016-17.484-8.922-22.578 2.391l-5.969 13.313c-5.063 11.313-19.109 18.344-31.188 15.594L18.552 42.317C6.474 39.583-1.729 47.333.317 59.567l8.609 51.094c2.031 12.219 13.625 24.359 25.75 27l63.672 13.75c12.125 2.625 11.875 4.453-.5 4.109l-35.531-1.094c-12.391-.344-18.141 8.234-12.766 19.094 5.375 10.891 19.75 21.594 31.922 23.875l7.891 1.453c12.188 2.266 28.11 12.313 35.391 22.36zm383.562 24.062c-4.313-18.094-12.516-9.297-15.938-3.094-2.781 5.047-28.703 58.297-69.813 90.344-25.094-31.031-86.219-109.531-139.219-177.859L150.802 257.286l17.188 24.531c-20 53.641-59.109 164.437-59.109 164.437-4.953 13.953 2.406 29.297 16.484 34.297 14.016 5.031 27.109-2.469 33.156-16.656l56.328-115.14 18.453 26.313c-7 7.703-11.516 17.75-11.719 28.938l-.25 12.078h-3.156c-58.469 0-61.719 64.953-3.25 64.953h181.906c60.813 0 79.938-47.406 60.828-96.015 23.766-24.424 67.235-79.189 50.656-139.752z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default DogSvgrepoComSvgIcon;
/* prettier-ignore-end */
