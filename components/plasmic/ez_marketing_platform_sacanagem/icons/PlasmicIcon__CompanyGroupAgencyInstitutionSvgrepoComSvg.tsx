/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CompanyGroupAgencyInstitutionSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function CompanyGroupAgencyInstitutionSvgrepoComSvgIcon(
  props: CompanyGroupAgencyInstitutionSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.2"}
      baseProfile={"tiny"}
      viewBox={"0 0 256 256"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M129.9 54.3v-13H151V22.1h-21.1v-3.8h-3.8v36L81 91.1h94l-45.1-36.8zM128 85.2c-5.4 0-9.8-4.4-9.8-9.8s4.4-9.8 9.8-9.8 9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zM243.5 232l.2-76H175V95H81v61H12.2l.2 76H5.3v21.2h245.4V232h-7.2zm-209-7.7h-9.6v-52.1h9.6v52.1zm17.3 0h-9.6v-52.1h9.6v52.1zm17.2 0h-9.6v-52.1H69v52.1zm38.9 11.5H94.4V124h13.4l.1 111.8zm26.8 0h-13.4V124h13.4v111.8zm26.9 0h-13.4V124h13.4v111.8zm35-11.5H187v-52.1h9.6v52.1zm17.2 0h-9.6v-52.1h9.6v52.1zm17.3 0h-9.6v-52.1h9.6v52.1z"
        }
      ></path>
    </svg>
  );
}

export default CompanyGroupAgencyInstitutionSvgrepoComSvgIcon;
/* prettier-ignore-end */
