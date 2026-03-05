/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MedicinesMedicineSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function MedicinesMedicineSvgrepoComSvgIcon(
  props: MedicinesMedicineSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 496 496"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M256 320c0-48.52-39.48-88-88-88s-88 39.48-88 88 39.48 88 88 88 88-39.48 88-88zm-88 72c-39.704 0-72-32.296-72-72s32.296-72 72-72 72 32.296 72 72-32.296 72-72 72z"
        }
      ></path>

      <path
        d={
          "M440 384H336v-53.544c2.888 4.12 6.096 8.088 9.776 11.768 17.16 17.16 39.688 25.736 62.224 25.736s45.072-8.576 62.224-25.736c34.312-34.312 34.312-90.144 0-124.456s-90.144-34.312-124.456 0c-3.68 3.68-6.88 7.648-9.776 11.768v-28.56a50.162 50.162 0 00-32-46.816V144h32V0H0v144h32v10.168a50.17 50.17 0 00-32 46.816V496h440c30.872 0 56-25.128 56-56s-25.128-56-56-56zm18.912-53.088c-26.168 26.168-67.592 27.92-95.84 5.32l101.16-101.16c22.592 28.256 20.84 69.68-5.32 95.84zM357.088 229.088c14.04-14.04 32.48-21.056 50.912-21.056 15.92 0 31.832 5.256 44.92 15.728L351.76 324.92c-22.584-28.248-20.832-69.672 5.328-95.832zM16 128V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v96h16V16h16v112H16zm25.936 39.76L48 166.24V144h240v22.24l6.064 1.512c14.952 3.736 25.416 16.92 25.856 32.24H16.08c.44-15.312 10.912-28.496 25.856-32.232zM16 216h304v168h-40c-25.312 0-46.736 16.896-53.64 40H16V216zm0 264v-40h208c0 15.664 6.48 29.824 16.888 40H16zm336 0h-72c-22.056 0-40-17.944-40-40s17.944-40 40-40h72v80zm88 0h-72v-80h72c22.056 0 40 17.944 40 40s-17.944 40-40 40z"
        }
      ></path>

      <path
        d={
          "M192 296v-32h-48v32h-32v48h32v32h48v-32h32v-48h-32zm16 32h-32v32h-16v-32h-32v-16h32v-32h16v32h32v16z"
        }
      ></path>
    </svg>
  );
}

export default MedicinesMedicineSvgrepoComSvgIcon;
/* prettier-ignore-end */
