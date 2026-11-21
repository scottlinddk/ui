import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Purely visual divider (default). Set false to expose `role="separator"`. */
  decorative?: boolean;
}

export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      className={cn("fds-separator", `fds-separator--${orientation}`, className)}
      {...(decorative ? { role: "none" } : { role: "separator", "aria-orientation": orientation })}
      {...props}
    />
  );
}
