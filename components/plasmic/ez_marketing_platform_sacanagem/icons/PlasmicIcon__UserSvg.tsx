/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type UserSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function UserSvgIcon(props: UserSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeWidth={"2"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "feather feather-user"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"}></path>

      <circle cx={"12"} cy={"7"} r={"4"}></circle>
    </svg>
  );
}

export default UserSvgIcon;
/* prettier-ignore-end */
