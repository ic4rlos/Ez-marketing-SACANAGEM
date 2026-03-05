/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WorkWorkerJobLaborSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function WorkWorkerJobLaborSvgrepoComSvgIcon(
  props: WorkWorkerJobLaborSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 256 190"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M48.12 27.903C48.12 13.564 59.592 2 74.023 2c14.339 0 25.903 11.564 25.903 25.903-.092 14.432-11.656 25.903-25.903 25.903-14.339 0-25.903-11.564-25.903-25.903zM191 139h-47V97c0-20.461-17.881-37-38-37H43C20.912 60 1.99 79.14 2 98v77c-.026 8.533 6.001 12.989 12 13 6.014.011 12-4.445 12-13v-75h8v88h78v-88h8l.081 50.37c-.053 8.729 5.342 12.446 10.919 12.63h60c16.363 0 16.363-24 0-24zm47.527-34.843c-2.64-2.396-5.726-3.493-9.341-3.371-1.218 0-2.396.284-3.614.69l-18.113-16.569 11.655-13.767 18.519 16.326L254 68.825l-46.338-40.774-16.366 18.641 18.031 15.879-12.062 13.036L180.777 60.5c.284-1.218.406-2.396.284-3.614-.122-3.614-1.543-6.701-4.183-9.056-2.64-2.396-5.726-3.493-9.341-3.371-1.218 0-2.518.284-3.614.69l10.478 9.503-9.259 10.153-10.478-9.503c-.284 1.218-.406 2.518-.284 3.614.122 3.614 1.543 6.538 4.183 8.935 2.64 2.396 5.726 3.493 9.341 3.371a9.8 9.8 0 003.899-.853l16.001 14.661-26.479 27.453c-1.828 1.543-2.762 3.736-2.762 6.132a8.077 8.077 0 008.082 8.082c2.762 0 5.158-1.421 6.701-3.493L198.85 95.1l15.067 13.767 2.518 2.396c-.284 1.218-.406 2.64-.406 3.899.122 3.614 1.543 6.538 4.183 9.056 2.64 2.396 5.726 3.493 9.341 3.371 1.218 0 2.396-.284 3.614-.69l-10.478-9.503 9.341-10.193 10.356 9.544c.284-1.218.406-2.518.284-3.614-.082-3.697-1.503-6.621-4.143-8.976z"
        }
      ></path>
    </svg>
  );
}

export default WorkWorkerJobLaborSvgrepoComSvgIcon;
/* prettier-ignore-end */
