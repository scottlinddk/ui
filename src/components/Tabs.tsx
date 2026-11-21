import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/cn.js";

interface TabsContext {
  value: string | undefined;
  setValue: (value: string) => void;
  base: string;
}
const Context = createContext<TabsContext | null>(null);
const useTabs = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Tabs parts must be rendered inside Tabs");
  return ctx;
};

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** Controlled or uncontrolled tabs with automatic activation. */
export function Tabs({ value, defaultValue, onValueChange, className, ...props }: TabsProps) {
  const base = useId();
  const [inner, setInner] = useState(defaultValue);
  return (
    <Context.Provider
      value={{
        value: value ?? inner,
        base,
        setValue: (next) => {
          if (value === undefined) setInner(next);
          onValueChange?.(next);
        },
      }}
    >
      <div className={cn("fds-tabs", className)} {...props} />
    </Context.Provider>
  );
}

export function TabsList({ className, onKeyDown, ...props }: HTMLAttributes<HTMLDivElement>) {
  const handle = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)'),
    );
    const at = tabs.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    const go = (index: number) => {
      event.preventDefault();
      const tab = tabs[(index + tabs.length) % tabs.length];
      tab?.focus();
      tab?.click();
    };
    if (event.key === "ArrowRight") go(at + 1);
    else if (event.key === "ArrowLeft") go(at - 1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(tabs.length - 1);
  };
  return (
    <div role="tablist" className={cn("fds-tabs__list", className)} onKeyDown={handle} {...props} />
  );
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function TabsTrigger({ value, className, onClick, ...props }: TabsTriggerProps) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <button
      aria-controls={`${ctx.base}-panel-${value}`}
      aria-selected={selected}
      className={cn("fds-tabs__trigger", className)}
      id={`${ctx.base}-tab-${value}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setValue(value);
      }}
      role="tab"
      tabIndex={selected ? 0 : -1}
      type="button"
      {...props}
    />
  );
}

export interface TabsContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "value"> {
  value: string;
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useTabs();
  return (
    <div
      aria-labelledby={`${ctx.base}-tab-${value}`}
      className={cn("fds-tabs__content", className)}
      hidden={ctx.value !== value}
      id={`${ctx.base}-panel-${value}`}
      role="tabpanel"
      tabIndex={0}
      {...props}
    />
  );
}
