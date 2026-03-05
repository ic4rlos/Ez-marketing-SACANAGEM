/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WebInterfaceComputerSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function WebInterfaceComputerSvgrepoComSvgIcon(
  props: WebInterfaceComputerSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 256 241"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M254 188V2H2v186h111v29H75v22h106v-22h-38v-29h111zM19 19h217v151H19V19zm139.818 82.623v46.183h-43.476l-14.18-23.745a13.985 13.985 0 01-1.979-7.172V91.57c0-2.613 1.549-5.032 3.988-5.97 4.153-1.597 8.276 1.776 8.276 5.727v13.277c0 .962 1.007 1.756 1.996 1.357.578-.233.929-.828.929-1.451V55.658c.225-2.982 2.813-5.457 5.964-5.457h.169c3.488 0 6.132 2.869 6.132 6.132v24.754l25.936 10.914c3.769 1.689 6.245 5.458 6.245 9.622zm-29.255-34.375c.338.338.788.506 1.294.506s1.181-.169 1.463-.675c2.475-2.813 3.769-6.639 3.769-10.408 0-8.777-7.145-15.865-15.865-15.865-8.777 0-15.865 7.145-15.865 15.865 0 3.657 1.294 7.257 3.657 10.07.675.788 1.969 1.013 2.982.338.788-.675 1.013-1.969.338-2.982-1.688-2.194-2.644-4.782-2.644-7.426 0-6.414 5.288-11.758 11.758-11.758s11.758 5.288 11.758 11.758c0 2.813-1.013 5.626-2.813 7.595-.845.957-.62 2.307.168 2.982z"
        }
      ></path>
    </svg>
  );
}

export default WebInterfaceComputerSvgrepoComSvgIcon;
/* prettier-ignore-end */
