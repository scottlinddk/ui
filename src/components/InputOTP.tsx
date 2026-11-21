import { useState, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface InputOTPProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "maxLength"
> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once all `length` characters are entered. */
  onComplete?: (value: string) => void;
}

/** One real numeric input (so autofill and paste work) drawn as separate slots. */
export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  className,
  ...props
}: InputOTPProps) {
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = value ?? inner;
  return (
    <div className={cn("fds-otp", className)}>
      <input
        autoComplete="one-time-code"
        className="fds-otp__input"
        inputMode="numeric"
        maxLength={length}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "").slice(0, length);
          if (value === undefined) setInner(next);
          onValueChange?.(next);
          if (next.length === length) onComplete?.(next);
        }}
        onFocus={() => setFocused(true)}
        pattern="[0-9]*"
        value={current}
        {...props}
      />
      <div aria-hidden="true" className="fds-otp__slots">
        {Array.from({ length }, (_, i) => (
          <span
            className="fds-otp__slot"
            data-active={focused && i === Math.min(current.length, length - 1) ? "" : undefined}
            key={i}
          >
            {current[i] ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
