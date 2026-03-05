/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type BusinessBagSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function BusinessBagSvgrepoComSvgIcon(
  props: BusinessBagSvgrepoComSvgIconProps
) {
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

      <g fill={"currentColor"}>
        <path
          d={
            "M0 129.602v107.476l207.336 48.789v-30.929h96v30.929L512 236.766V129.602z"
          }
        ></path>

        <path
          d={
            "M303.336 382.938h-96v-64.352L0 269.805v235.797h512v-236.11l-208.664 49.094z"
          }
        ></path>

        <path
          d={
            "M231.336 278.938h48v80h-48zM180.398 56.805c.008-2.062.774-3.726 2.11-5.102 1.375-1.336 3.039-2.094 5.094-2.11h136.797c2.054.016 3.719.774 5.094 2.11 1.336 1.375 2.094 3.039 2.11 5.102v36h43.195v-36a50.365 50.365 0 00-14.766-35.649 50.355 50.355 0 00-35.633-14.758H187.602a50.392 50.392 0 00-35.641 14.758c-9.086 9.063-14.774 21.798-14.758 35.649v36h43.195v-36z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default BusinessBagSvgrepoComSvgIcon;
/* prettier-ignore-end */
