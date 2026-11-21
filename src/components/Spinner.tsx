import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Accessible, visually hidden label. */
  label?: string;
}

export function Spinner({ label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn("fds-spinner", className)} {...props}>
      <span aria-hidden="true" className="fds-spinner__ring" />
      <span className="fds-visually-hidden">{label}</span>
    </span>
  );
}
