/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ReportSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ReportSvgrepoComSvgIcon(props: ReportSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M4 1a1 1 0 00-1 1v20a1 1 0 102 0v-8.402a10.222 10.222 0 011.993-.753c1.416-.354 2.553-.223 3.175.71 1.161 1.741 3.378 1.895 5.085 1.725 1.8-.18 3.582-.77 4.482-1.102A1.947 1.947 0 0021 12.34V5.723c0-1.551-1.642-2.457-2.951-1.863-1.061.481-2.472 1.019-3.746 1.196-1.333.186-2.107-.065-2.471-.61-1.312-1.968-3.556-2.201-5.165-2.067-.618.051-1.191.16-1.667.273V2a1 1 0 00-1-1zm1 3.721v6.684c.44-.18.956-.362 1.507-.5 1.584-.396 3.947-.526 5.325 1.54.479.718 1.582 1.008 3.222.845 1.522-.152 3.088-.658 3.946-.973V5.723c0-.045-.092-.057-.125-.042-1.117.507-2.735 1.139-4.296 1.356-1.501.21-3.369.082-4.411-1.482-.688-1.032-1.944-1.3-3.335-1.183A9.6 9.6 0 005 4.722z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ReportSvgrepoComSvgIcon;
/* prettier-ignore-end */
