/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type JournalismInterviewConversationSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function JournalismInterviewConversationSvgrepoComSvgIcon(
  props: JournalismInterviewConversationSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 100 100"}
      version={"1.1"}
      xmlSpace={"preserve"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M88 64h-1v-4c0-.6-.4-1-1-1h-2v-7c0-.3-.1-.5-.3-.7l-5-5c-.1-.1-.2-.2-.3-.2.4-.6.6-1.3.6-2.1 0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4c.8 0 1.5-.2 2.1-.6 0 .1.1.2.2.3l4.7 4.7V59h-2c-.6 0-1 .4-1 1v4h-1.1l-.5-3.8C75.9 49.8 67 42 56.6 42c2.7-1.8 4.6-4.7 5.2-8H66c2.2 0 4-1.8 4-4v-4c0-1.9-1.3-3.4-3-3.9V15c0-6.1-4.9-11-11-11H44c-6.1 0-11 4.9-11 11v7.1c-1.7.4-3 2-3 3.9v4c0 2.2 1.8 4 4 4h4.2c.6 3.3 2.5 6.2 5.2 8-10.4 0-19.3 7.8-20.8 18.2l-.5 3.8H21v-4c0-.6-.4-1-1-1h-2v-6.6l4.7-4.7c.1-.1.2-.2.2-.3.6.4 1.3.6 2.1.6 2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4c0 .8.2 1.5.6 2.1-.1 0-.2.1-.3.2l-5 5c-.2.2-.3.4-.3.7v7h-2c-.6 0-1 .4-1 1v4h-1c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h2v23c0 .6.4 1 1 1h70c.6 0 1-.4 1-1V72h2c.6 0 1-.4 1-1v-6c0-.6-.4-1-1-1zM75 46c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-50-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm56 19h4v3h-4v-3zM39.1 22c-.1 0-.1 0 0 0H38v-6c0-3.9 3.1-7 7-7h10c3.9 0 7 3.1 7 7v6h-1c-4.1 0-5-3.1-5-3.2-.1-.4-.4-.7-.8-.7-.4-.1-.8.1-1 .5-2.3 3.5-11.7 3.7-15.1 3.4zM68 26v4c0 1.1-.9 2-2 2h-4v-8h4c1.1 0 2 .9 2 2zM44 6h12c5 0 9 4 9 9v7h-1v-6c0-5-4-9-9-9H45c-5 0-9 4-9 9v6h-1v-7c0-5 4-9 9-9zM34 32c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4v8h-4zm6 0v-7.9c3 .1 11.1.1 14.8-3.2.9 1.4 2.5 2.8 5.2 3.1v8c0 5.5-4.5 10-10 10s-10-4.5-10-10zM24.6 60.4C25.9 51.1 34 44 43.5 44h13.1c9.5 0 17.6 7.1 18.8 16.4l.5 3.6H24.1l.5-3.6zM15 61h4v3h-4v-3zm69 33H16V72h68v22zm3-24H13v-4h74v4z"
        }
      ></path>
    </svg>
  );
}

export default JournalismInterviewConversationSvgrepoComSvgIcon;
/* prettier-ignore-end */
