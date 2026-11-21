import {
  createContext,
  useContext,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import { rectOf, useDismiss, useFloating, type Align, type Side } from "../lib/floating.js";
import { MenuSurface, useMenuClose } from "../lib/menu.js";
import type { ButtonProps } from "./Button.js";

interface DropdownContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement>;
}
const Context = createContext<DropdownContext | null>(null);
const useDropdown = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("DropdownMenu parts must be rendered inside DropdownMenu");
  return ctx;
};

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <Context.Provider value={{ open: isOpen, setOpen, triggerRef }}>{children}</Context.Provider>
  );
}

export function DropdownMenuTrigger({
  variant = "secondary",
  className,
  onClick,
  onKeyDown,
  ...props
}: ButtonProps) {
  const ctx = useDropdown();
  return (
    <button
      aria-expanded={ctx.open}
      aria-haspopup="menu"
      className={cn("fds-button", `fds-button--${variant}`, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && event.key === "ArrowDown") {
          event.preventDefault();
          ctx.setOpen(true);
        }
      }}
      ref={ctx.triggerRef}
      type="button"
      {...props}
    />
  );
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Required: names the menu. */
  "aria-label": string;
  side?: Side;
  align?: Align;
}

export function DropdownMenuContent({
  side = "bottom",
  align = "start",
  ...props
}: DropdownMenuContentProps) {
  const ctx = useDropdown();
  const ref = useFloating<HTMLDivElement>({
    open: ctx.open,
    anchor: () => rectOf(ctx.triggerRef.current),
    side,
    align,
  });
  const close = (restore: boolean) => {
    ctx.setOpen(false);
    if (restore) ctx.triggerRef.current?.focus();
  };
  useDismiss({
    open: ctx.open,
    inside: [ref, ctx.triggerRef],
    onOutside: () => close(false),
    onEscape: () => undefined, // Escape is handled by the focused menu so focus returns to the trigger
  });
  if (!ctx.open) return null;
  return <MenuSurface onClose={close} surfaceRef={ref} {...props} />;
}

export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "danger";
  /** Keep the menu open after selection. */
  keepOpen?: boolean;
}

export function DropdownMenuItem({
  tone,
  keepOpen,
  className,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const close = useMenuClose();
  return (
    <button
      className={cn("fds-menu-item", tone && `fds-menu-item--${tone}`, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !keepOpen) close?.();
      }}
      role="menuitem"
      type="button"
      {...props}
    />
  );
}

export interface DropdownMenuCheckboxItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Stays open after toggling so several options can be changed in one visit. */
export function DropdownMenuCheckboxItem({
  checked,
  onCheckedChange,
  className,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      aria-checked={checked}
      className={cn("fds-menu-item fds-menu-item--check", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(!checked);
      }}
      role="menuitemcheckbox"
      type="button"
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-menu-label", className)} role="presentation" {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-menu-separator", className)} role="separator" {...props} />;
}
