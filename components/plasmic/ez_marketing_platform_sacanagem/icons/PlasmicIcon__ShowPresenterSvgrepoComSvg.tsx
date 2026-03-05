/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ShowPresenterSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function ShowPresenterSvgrepoComSvgIcon(
  props: ShowPresenterSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 26.811 26.811"}
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
            "M15.222 19.028v2.827c0 .584-.476 1.062-1.062 1.062-.31 0-.583-.131-.777-.341a1.064 1.064 0 01-1.844-.721l.001-2.823c-2.683.404-4.637 1.68-4.637 3.188 0 1.836 2.902 3.326 6.483 3.326s6.483-1.49 6.483-3.326c0-1.511-1.962-2.785-4.647-3.192zm-.373-7.055h-2.925l1.48 1.55z"
          }
        ></path>

        <path
          d={
            "M8.197 19.585l-.144.17c.884-.663 2.221-1.154 3.783-1.358l-.002 3.479c0 .368.299.67.669.67s.875-.299.875-.668l-.001-3.577.047-.001v3.584l.004.006c.005.36.347.652.711.652.37 0 .669-.296.669-.664l-.002-3.502-1.354-.077.133-.003-.147.003-.013-.001v-1.846h-.047V18.3l-1.54.098.001-4.646-2.867-2.942h.001l-.002-.006a.492.492 0 010-.7.496.496 0 01.699 0l.003.003 1.854 1.866h.396L1.722 1.308 0 1.265l6.815 20.66.021-.006a1.328 1.328 0 01-.022-.274c0-.776.521-1.49 1.383-2.06zM24.798 1.308L14.85 11.973h.276v.005l.001-.005 1.853-1.866a.501.501 0 01.706-.003.5.5 0 01-.001.703l-.002.003h.001l-2.879 2.952.002 4.612c1.634.189 3.037.69 3.955 1.38l-.146-.169c.863.568 1.384 1.282 1.384 2.06 0 .095-.009.188-.021.274l.018.006 6.814-20.66-2.013.043zM13.395 11.594a1.173 1.173 0 100-2.348 1.173 1.173 0 000 2.348z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default ShowPresenterSvgrepoComSvgIcon;
/* prettier-ignore-end */
