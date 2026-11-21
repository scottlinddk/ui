import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/** Visually joins adjacent buttons. Give it an `aria-label` when the group needs a name. */
export function ButtonGroup({ orientation = "horizontal", className, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn("fds-button-group", `fds-button-group--${orientation}`, className)}
      {...props}
    />
  );
}
