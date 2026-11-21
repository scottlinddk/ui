import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type RefObject,
} from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import { rectOf, useDismiss, useFloating, type Align, type Side } from "../lib/floating.js";
import type { ButtonProps } from "./Button.js";

interface PopoverContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement>;
  contentId: string;
}
const Context = createContext<PopoverContext | null>(null);
const usePopover = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Popover parts must be rendered inside Popover");
  return ctx;
};

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/** Non-modal floating panel anchored to its trigger. Top layer via the native Popover API. */
export function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentId = useId();
  return (
    <Context.Provider value={{ open: isOpen, setOpen, triggerRef, contentId }}>
      {children}
    </Context.Provider>
  );
}

export function PopoverTrigger({ onClick, ...props }: ButtonProps) {
  const ctx = usePopover();
  return (
    <button
      aria-controls={ctx.open ? ctx.contentId : undefined}
      aria-expanded={ctx.open}
      aria-haspopup="dialog"
      className={cn("fds-button", `fds-button--${props.variant ?? "secondary"}`, props.className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      ref={ctx.triggerRef}
      type="button"
      {...stripVariant(props)}
    />
  );
}

function stripVariant({ variant: _variant, className: _className, ...rest }: ButtonProps) {
  return rest;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Required: the panel is a dialog landmark. */
  "aria-label": string;
  side?: Side;
  align?: Align;
}

export function PopoverContent({
  side = "bottom",
  align = "start",
  className,
  ...props
}: PopoverContentProps) {
  const ctx = usePopover();
  const ref = useFloating<HTMLDivElement>({
    open: ctx.open,
    anchor: () => rectOf(ctx.triggerRef.current),
    side,
    align,
  });
  const close = (focusTrigger: boolean) => {
    ctx.setOpen(false);
    if (focusTrigger) ctx.triggerRef.current?.focus();
  };
  useDismiss({
    open: ctx.open,
    inside: [ref, ctx.triggerRef],
    onOutside: () => close(false),
    onEscape: () => close(true),
  });
  useEffect(() => {
    if (ctx.open) ref.current?.focus({ preventScroll: true });
  }, [ctx.open, ref]);
  if (!ctx.open) return null;
  return (
    <div
      className={cn("fds-floating fds-popover", className)}
      id={ctx.contentId}
      ref={ref}
      role="dialog"
      tabIndex={-1}
      {...props}
    />
  );
}
