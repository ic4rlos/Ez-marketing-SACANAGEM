/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ActorSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ActorSvgrepoComSvgIcon(props: ActorSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 512 512"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M397.907 484.519c-.179-.156-61.403-53.641-61.586-53.791l-56.498-49.361 77.772-67.95h-47.637L256 360.552l-53.958-47.135h-47.637l77.772 67.95-57.031 49.821-61.053 53.332c-6.52 5.695-7.189 15.6-1.494 22.121 5.693 6.497 15.564 7.199 22.12 1.494l56.863-49.674h128.836l56.863 49.674c6.555 5.704 16.427 5.004 22.12-1.494 5.695-6.521 5.027-16.427-1.494-22.122zm-170.443-57.407L256 402.181l28.536 24.931h-57.072zm201.801-286.155c-8.662 0-15.673 7.022-15.673 15.673v35.035h-10.658V15.673C402.933 7.022 395.912 0 387.26 0H124.74c-8.652 0-15.673 7.022-15.673 15.673v175.992H98.408V156.63c0-8.652-7.011-15.673-15.673-15.673-8.652 0-15.673 7.022-15.673 15.673v109.767c0 8.662 7.022 15.673 15.673 15.673h346.53c8.652 0 15.674-7.011 15.674-15.673V156.63c-.001-8.652-7.022-15.673-15.674-15.673zM231.831 65.128l13.96-2.017 6.238-12.57c1.62-3.26 6.322-3.26 7.941 0l6.238 12.57 13.96 2.017c3.626.522 5.078 4.953 2.456 7.502l-10.104 9.78 2.382 13.814c.627 3.615-3.197 6.322-6.416 4.639L256 94.344l-12.487 6.52c-3.239 1.693-7.043-1.045-6.416-4.639l2.382-13.814-10.104-9.78c-2.622-2.539-1.169-6.98 2.456-7.503zm139.755 126.538H140.413v-42.203h231.173v42.203z"
        }
      ></path>
    </svg>
  );
}

export default ActorSvgrepoComSvgIcon;
/* prettier-ignore-end */
