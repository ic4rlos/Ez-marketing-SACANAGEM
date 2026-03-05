/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type GraphSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function GraphSvgrepoComSvgIcon(props: GraphSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 32 32"}
      version={"1.1"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M0 25.406h22.406v-1.75H1.75V6.593H0v18.813zm3.063-3.437h19.25V8.156l-4.063 3.719-3.781-1.375-4 4.563-4.094-1.469-3.313 3.438v4.938z"
        }
      ></path>
    </svg>
  );
}

export default GraphSvgrepoComSvgIcon;
/* prettier-ignore-end */
