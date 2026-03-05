/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon8IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon8Icon(props: Icon8IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      version={"1.1"}
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 512 512"}
      xmlSpace={"preserve"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g fill={"#000"}>
        <path
          d={
            "M119.256 222.607h50.881v50.885h-50.881zm222.607 0h50.881v50.885h-50.881zm-74.201 0h50.881v50.885h-50.881zM119.256 302.11h50.881v50.885h-50.881zm148.406 0h50.881v50.885h-50.881zm-74.202 0h50.881v50.885H193.46zm148.403 79.502h50.881v50.885h-50.881zm-74.201 0h50.881v50.885h-50.881zm-74.202 0h50.881v50.885H193.46z"
          }
        ></path>

        <path
          d={
            "M439.277 55.046h-41.376v39.67c0 14.802-12.195 26.84-27.183 26.84h-54.025c-14.988 0-27.182-12.038-27.182-26.84v-39.67h-67.094v39.297c0 15.008-12.329 27.213-27.484 27.213h-53.424c-15.155 0-27.484-12.205-27.484-27.213V55.046H72.649c-26.906 0-48.796 21.692-48.796 48.354v360.246c0 26.661 21.89 48.354 48.796 48.354h366.628c26.947 0 48.87-21.692 48.87-48.354V103.4c0-26.661-21.923-48.354-48.87-48.354zm13.89 407.661c0 8.56-5.751 14.309-14.311 14.309H73.144c-8.56 0-14.311-5.749-14.311-14.309V178.089h394.334v284.618z"
          }
        ></path>

        <path
          d={
            "M141.525 102.507h53.392c4.521 0 8.199-3.653 8.199-8.144v-73.87c0-11.3-9.27-20.493-20.666-20.493h-28.459c-11.395 0-20.668 9.192-20.668 20.493v73.87c.001 4.491 3.679 8.144 8.202 8.144zm175.168 0h54.025c4.348 0 7.884-3.513 7.884-7.826V20.178C378.602 9.053 369.474 0 358.251 0H329.16c-11.221 0-20.349 9.053-20.349 20.178v74.503c-.001 4.313 3.536 7.826 7.882 7.826z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default Icon8Icon;
/* prettier-ignore-end */
