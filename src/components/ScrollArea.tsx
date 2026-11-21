import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Required: a focusable scroll region needs a name. */
  "aria-label": string;
  orientation?: "vertical" | "horizontal" | "both";
}

/** Keyboard-scrollable contained region. Use for tables/lists, never the page. */
export function ScrollArea({ orientation = "vertical", className, ...props }: ScrollAreaProps) {
  return (
    <div
      role="region"
      tabIndex={0}
      className={cn("fds-scroll-area", `fds-scroll-area--${orientation}`, className)}
      {...props}
    />
  );
}
