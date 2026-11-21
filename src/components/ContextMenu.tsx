import {
  createContext,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../lib/cn.js";
import { useDismiss, useFloating } from "../lib/floating.js";
import { MenuSurface } from "../lib/menu.js";
import type { DropdownMenuContentProps } from "./DropdownMenu.js";

export {
  DropdownMenuItem as ContextMenuItem,
  DropdownMenuCheckboxItem as ContextMenuCheckboxItem,
  DropdownMenuLabel as ContextMenuLabel,
  DropdownMenuSeparator as ContextMenuSeparator,
} from "./DropdownMenu.js";

interface ContextMenuContext {
  point: { x: number; y: number } | null;
  setPoint: (point: { x: number; y: number } | null) => void;
  areaRef: RefObject<HTMLDivElement>;
}
const Context = createContext<ContextMenuContext | null>(null);
const useContextMenu = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ContextMenu parts must be rendered inside ContextMenu");
  return ctx;
};

/**
 * Right-click / long-press / Shift+F10 menu. Right-click is invisible on touch and to many users:
 * always offer the same actions through a visible control such as `DropdownMenu`.
 */
export function ContextMenu({ children }: { children: ReactNode }) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  return <Context.Provider value={{ point, setPoint, areaRef }}>{children}</Context.Provider>;
}

export function ContextMenuTrigger({
  className,
  onContextMenu,
  onKeyDown,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const ctx = useContextMenu();
  return (
    <div
      className={cn("fds-context-menu-area", className)}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        ctx.setPoint({ x: event.clientX, y: event.clientY });
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          ctx.setPoint({ x: rect.left + 8, y: rect.top + 8 });
        }
      }}
      ref={ctx.areaRef}
      {...props}
    />
  );
}

export function ContextMenuContent(props: Omit<DropdownMenuContentProps, "side" | "align">) {
  const ctx = useContextMenu();
  const open = ctx.point !== null;
  const ref = useFloating<HTMLDivElement>({
    open,
    anchor: () => (ctx.point ? { x: ctx.point.x, y: ctx.point.y, width: 0, height: 0 } : null),
    side: "bottom",
    align: "start",
    offset: 0,
  });
  const close = (restore: boolean) => {
    ctx.setPoint(null);
    if (restore) ctx.areaRef.current?.focus();
  };
  useDismiss({ open, inside: [ref], onOutside: () => close(false), onEscape: () => undefined });
  if (!open) return null;
  return <MenuSurface onClose={close} surfaceRef={ref} {...props} />;
}
