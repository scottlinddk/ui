import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label: ReactNode;
}

/** Settings toggle on a real checkbox. Never use for actions that move money. */
export function Switch({ label, className, id, ...props }: SwitchProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("fds-switch", className)}>
      <input className="fds-switch__input" id={inputId} role="switch" type="checkbox" {...props} />
      <label className="fds-switch__label" htmlFor={inputId}>
        <span aria-hidden="true" className="fds-switch__track" />
        {label}
      </label>
    </div>
  );
}
