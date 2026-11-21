import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Pre-formatted text alternative for the current value (the app formats it). */
  valueText?: string;
}

/** Native `<input type="range">`: keyboard, touch and screen readers work out of the box. */
export function Slider({ valueText, className, ...props }: SliderProps) {
  return (
    <input
      aria-valuetext={valueText}
      className={cn("fds-slider", className)}
      type="range"
      {...props}
    />
  );
}
