import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Wraps an `Input` with display-only affixes (`DKK`, `%`). No parsing or formatting. */
export function InputGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-input-group", className)} {...props} />;
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  align?: "start" | "end";
}

export function InputGroupAddon({ align = "start", className, ...props }: InputGroupAddonProps) {
  return (
    <span
      className={cn("fds-input-group__addon", `fds-input-group__addon--${align}`, className)}
      {...props}
    />
  );
}
