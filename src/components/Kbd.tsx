import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("fds-kbd", className)} {...props} />;
}

export function KbdGroup({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("fds-kbd-group", className)} {...props} />;
}
