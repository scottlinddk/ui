import {
  createContext,
  useContext,
  useId,
  useState,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";

interface RadioContext {
  name: string;
  value: string | undefined;
  disabled?: boolean;
  onChange: (value: string) => void;
}
const Context = createContext<RadioContext | null>(null);

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "defaultValue"
> {
  legend: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** Radio group on native inputs: arrow-key navigation comes from the browser. */
export function RadioGroup({
  legend,
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const auto = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  return (
    <Context.Provider
      value={{
        name: name ?? auto,
        value: current,
        disabled,
        onChange: (next) => {
          if (value === undefined) setInner(next);
          onValueChange?.(next);
        },
      }}
    >
      <fieldset className={cn("fds-fieldset", className)} disabled={disabled} {...props}>
        <legend className="fds-fieldset__legend">{legend}</legend>
        {children}
      </fieldset>
    </Context.Provider>
  );
}

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "value" | "checked"
> {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Bordered card layout for plan/product choices. */
  card?: boolean;
}

export function Radio({ value, label, hint, card, className, id, ...props }: RadioProps) {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Radio must be rendered inside RadioGroup");
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("fds-choice", card && "fds-choice--card", className)}>
      <input
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        checked={ctx.value === value}
        className="fds-choice__input fds-choice__input--radio"
        disabled={ctx.disabled}
        id={inputId}
        name={ctx.name}
        onChange={() => ctx.onChange(value)}
        type="radio"
        value={value}
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
