/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ExerciseGymSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ExerciseGymSvgrepoComSvgIcon(
  props: ExerciseGymSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 511.999 511.999"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M364.917 374.977l-18.376-17.894c-13.436 5.551-29.424 1.533-38.492-10.667-6.877-9.25-8.095-20.952-4.282-30.983l-33.107-32.236c-7.547-7.349-19.218-8.39-27.947-2.494l-55.298 37.353-23.495-90.658 50.16-75.24a16.669 16.669 0 00-12.64-25.871l-66.788-4.947c6.406 6.782 10.969 15.211 13.077 24.371a53.232 53.232 0 011.327 10.126l21.441 1.588-29.629 44.443L79.773 217.4l21.785 19.402-59.234-33.965 11.844-13.876a52.786 52.786 0 01-9.085-19.618 52.612 52.612 0 01-.68-20.297L3.99 196.4a16.67 16.67 0 004.313 25.24l78.38 45.49-16.537-3.997 25.961 111.895a35.5 35.5 0 0054.424 21.417l102.074-68.782 81.298 79.162c8.797 8.565 22.871 8.375 31.432-.417 8.564-8.795 8.377-22.867-.418-31.431z"
        }
      ></path>

      <circle cx={"96.409"} cy={"157.528"} r={"38.575"}></circle>

      <circle cx={"385.972"} cy={"139.583"} r={"40.711"}></circle>

      <path
        d={
          "M510.761 307.093c-3.264-12.484-4.826-18.202-28.48-104.096-4.559-16.559-21.766-26.22-38.271-21.499l-27.318 7.811c-16.497 4.717-25.989 21.994-21.131 38.444l2.036 6.895 16.477-17.368-28.024 48.171-62.908 46.764c-8.175 6.078-9.875 17.631-3.799 25.807 6.076 8.175 17.631 9.876 25.807 3.799l65.944-49.022a18.448 18.448 0 004.939-5.527l29.929-51.445-17.765 58.522c-1.517 4.996-4.733 6.792-8.707 9.745l-50.315 37.403c2.252 2.627-3.793-2.215 87.974 67.07 9.757 7.367 23.636 5.427 31.002-4.327 7.367-9.756 5.428-23.635-4.327-31.002l-40.839-30.834 49.568-6.077c13.921-1.707 22.852-15.826 18.208-29.234z"
        }
      ></path>
    </svg>
  );
}

export default ExerciseGymSvgrepoComSvgIcon;
/* prettier-ignore-end */
