import type { LabelHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Standalone label for controls outside `Field`. */
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("fds-field__label", className)} {...props} />;
}
