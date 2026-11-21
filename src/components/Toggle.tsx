import {
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export interface ToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "defaultValue"
> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** Two-state button (`aria-pressed`). */
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  return (
    <button
      aria-pressed={on}
      className={cn("fds-toggle", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (pressed === undefined) setInner(!on);
        onPressedChange?.(!on);
      }}
      type="button"
      {...props}
    />
  );
}

interface GroupContext {
  isOn: (value: string) => boolean;
  toggle: (value: string) => void;
}
const Context = createContext<GroupContext | null>(null);

export interface ToggleGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Array of pressed values. For single-choice pickers prefer `RadioGroup`. */
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  /** `single` allows at most one pressed item. */
  type?: "single" | "multiple";
}

/** Group of independent toggles (period filters, text formatting). */
export function ToggleGroup({
  value,
  defaultValue = [],
  onValueChange,
  type = "multiple",
  className,
  ...props
}: ToggleGroupProps) {
  const [inner, setInner] = useState<readonly string[]>(defaultValue);
  const current = value ?? inner;
  const toggle = (item: string) => {
    const has = current.includes(item);
    const next =
      type === "single"
        ? has
          ? []
          : [item]
        : has
          ? current.filter((v) => v !== item)
          : [...current, item];
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <Context.Provider value={{ isOn: (v) => current.includes(v), toggle }}>
      <div role="group" className={cn("fds-toggle-group", className)} {...props} />
    </Context.Provider>
  );
}

export interface ToggleGroupItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  value: string;
}

export function ToggleGroupItem({ value, className, onClick, ...props }: ToggleGroupItemProps) {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ToggleGroupItem must be rendered inside ToggleGroup");
  return (
    <button
      aria-pressed={ctx.isOn(value)}
      className={cn("fds-toggle", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.toggle(value);
      }}
      type="button"
      {...props}
    />
  );
}
