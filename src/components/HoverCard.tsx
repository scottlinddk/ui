import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../lib/cn.js";
import { rectOf, useFloating, type Align, type Side } from "../lib/floating.js";

interface HoverCardContext {
  open: boolean;
  schedule: (open: boolean) => void;
  triggerRef: RefObject<HTMLAnchorElement>;
}
const Context = createContext<HoverCardContext | null>(null);
const useHoverCard = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("HoverCard parts must be rendered inside HoverCard");
  return ctx;
};

export interface HoverCardProps {
  openDelay?: number;
  closeDelay?: number;
  children: ReactNode;
}

/** Preview card for a link. Never the only way to reach the information: hover does not exist on touch. */
export function HoverCard({ openDelay = 500, closeDelay = 200, children }: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  const schedule = (next: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };
  return <Context.Provider value={{ open, schedule, triggerRef }}>{children}</Context.Provider>;
}

export function HoverCardTrigger({
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ctx = useHoverCard();
  return (
    <a
      className={cn("fds-hover-card__trigger", className)}
      onBlur={(e) => {
        onBlur?.(e);
        ctx.schedule(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        ctx.schedule(true);
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        ctx.schedule(true);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        ctx.schedule(false);
      }}
      ref={ctx.triggerRef}
      {...props}
    />
  );
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
}

export function HoverCardContent({
  side = "bottom",
  align = "center",
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: HoverCardContentProps) {
  const ctx = useHoverCard();
  const ref = useFloating<HTMLDivElement>({
    open: ctx.open,
    anchor: () => rectOf(ctx.triggerRef.current),
    side,
    align,
  });
  if (!ctx.open) return null;
  return (
    <div
      className={cn("fds-floating fds-hover-card", className)}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        ctx.schedule(true);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        ctx.schedule(false);
      }}
      ref={ref}
      {...props}
    />
  );
}
