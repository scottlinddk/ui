import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Omit for an indeterminate progress bar. */
  value?: number;
  max?: number;
  /** Accessible name (required: a bar has no visible text). */
  "aria-label": string;
  /** Pre-formatted text alternative, e.g. "3 of 5 steps". */
  valueText?: string;
}

/** Task progress (`role="progressbar"`). For bounded measurements use `Meter`. */
export function Progress({ value, max = 100, valueText, className, ...props }: ProgressProps) {
  const determinate = value !== undefined;
  const pct = determinate ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={determinate ? value : undefined}
      aria-valuetext={valueText}
      className={cn("fds-progress", !determinate && "fds-progress--indeterminate", className)}
      {...props}
    >
      <div
        className="fds-progress__bar"
        style={determinate ? { inlineSize: `${pct}%` } : undefined}
      />
    </div>
  );
}
