import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  hint?: ReactNode;
  indeterminate?: boolean;
}

/** Real `<input type="checkbox">` with a 44px hit area. */
export function Checkbox({ label, hint, indeterminate, className, id, ...props }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <div className={cn("fds-choice", className)}>
      <input
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        className="fds-choice__input"
        id={inputId}
        ref={ref}
        type="checkbox"
        {...props}
      />
      <label className="fds-choice__label" htmlFor={inputId}>
        {label}
      </label>
      {hint ? (
        <p className="fds-choice__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface FieldSetProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "title"
> {
  legend: ReactNode;
}

/** Groups related checkboxes or radios under a legend. */
export function FieldSet({ legend, className, children, ...props }: FieldSetProps) {
  return (
    <fieldset className={cn("fds-fieldset", className)} {...props}>
      <legend className="fds-fieldset__legend">{legend}</legend>
      {children}
    </fieldset>
  );
}
