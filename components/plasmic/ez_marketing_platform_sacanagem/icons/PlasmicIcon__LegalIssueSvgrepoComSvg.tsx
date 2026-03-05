/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LegalIssueSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LegalIssueSvgrepoComSvgIcon(
  props: LegalIssueSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 483.668 483.668"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M464.885 267.229l-190.808-64.75 21.489-63.297 11.471 3.887c9.606 3.286 20.099-1.864 23.354-11.503 3.253-9.669-1.866-20.13-11.535-23.385L158.48 53.733c-9.638-3.286-20.099 1.896-23.354 11.535-3.286 9.638 1.864 20.098 11.502 23.384l11.472 3.887-59.251 174.533-11.44-3.856c-9.638-3.286-20.13 1.864-23.384 11.503-3.287 9.638 1.864 20.099 11.535 23.384l160.343 54.45c9.67 3.253 20.13-1.896 23.384-11.535 3.288-9.638-1.896-20.098-11.534-23.385l-11.439-3.888 20.003-58.904 190.808 64.752c14.442 4.928 30.148-2.814 35.078-17.287 4.897-14.471-2.878-30.146-17.318-35.077zM256.316 380.931H25.028C11.219 380.931 0 392.118 0 405.927c0 13.81 11.219 24.996 25.028 24.996h231.288c13.809 0 24.998-11.187 24.998-24.996s-11.189-24.996-24.998-24.996z"
        }
      ></path>
    </svg>
  );
}

export default LegalIssueSvgrepoComSvgIcon;
/* prettier-ignore-end */
