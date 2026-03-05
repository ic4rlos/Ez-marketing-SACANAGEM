/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type VeterinaryClinicSymbolOfACatInACrossSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function VeterinaryClinicSymbolOfACatInACrossSvgrepoComSvgIcon(
  props: VeterinaryClinicSymbolOfACatInACrossSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 25 25"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"16.34"} cy={"13.476"} r={".526"}></circle>

      <path
        d={
          "M24.067 7.5h-4.924v2.645a.849.849 0 01-.32.614l-2.156 1.49a.616.616 0 01-.646 0l-2.156-1.49a.844.844 0 01-.322-.614v-3.41c0-.216.125-.268.277-.115l.732.734c.152.153.457.277.67.277h2.241c.188 0 .424-.1.584-.223a.939.939 0 01-.543-.85V.94a.94.94 0 00-.943-.938H8.443a.942.942 0 00-.944.938v5.62c0 .046-.021.084-.025.128l1.778-.303c.215-.037.367.109.346.322l-.018.152a.802.802 0 01-.393.566l-1.429.726a.324.324 0 00-.12.493l.126.174a.614.614 0 00.611.218l1.181-.31c.21-.057.557-.087.772-.071l2.82.212v1.481a.83.83 0 00.322.614l2.547 1.762a.62.62 0 00.646 0l.395-.271c.008.102.008.205-.01.288l-1.061 5.497a.5.5 0 01-.467.387h-.074a.476.476 0 01-.451-.389l-.422-2.941a.466.466 0 00-.445-.389h-.393a.451.451 0 00-.439.391l-.354 2.939a.455.455 0 01-.439.389h-.084a.444.444 0 01-.43-.391l-.364-3.998a.44.44 0 00-.426-.391h-.783a.472.472 0 00-.453.389l-.589 4a.471.471 0 01-.447.389h-.146a.469.469 0 01-.448-.389l-.866-6.36a1.781 1.781 0 00-.29-.702L6.025 9.655a.971.971 0 01-.157-.694l.326-1.463H.934A.94.94 0 000 8.437v8.126c0 .516.419.939.934.939h5.63c.516 0 .935.418.935.939v5.619c0 .514.419.938.944.938h8.116a.94.94 0 00.943-.938v-5.625c0-.516.418-.936.936-.936h5.629a.938.938 0 00.934-.938V8.437a.94.94 0 00-.934-.937z"
        }
      ></path>
    </svg>
  );
}

export default VeterinaryClinicSymbolOfACatInACrossSvgrepoComSvgIcon;
/* prettier-ignore-end */
