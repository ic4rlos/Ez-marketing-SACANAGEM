"use client";

import * as React from "react";
import { AntdInput } from "@plasmicpkgs/antd5/skinny/registerInput";

type Props = {
  type?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: Props) {
  return <AntdInput {...props} />;
}
