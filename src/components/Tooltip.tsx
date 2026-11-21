import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";
import { rectOf, useFloating, type Align, type Side } from "../lib/floating.js";

export interface TooltipProps {
  /** Short supplementary text. Never put required information (fees, risk) here. */
  content: ReactNode;
  /** The single element that triggers the tooltip; it must accept `aria-describedby` and handlers. */
  children: ReactElement<Record<string, unknown>>;
  side?: Side;
  align?: Align;
  /** Hover delay in ms (focus opens immediately). */
  delay?: number;
  className?: string;
}

/** Opens on hover and keyboard focus, closes on Escape, blur or leave. */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 300,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ref = useFloating<HTMLDivElement>({
    open,
    anchor: () => rectOf(anchorRef.current),
    side,
    align,
  });
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  const props = children.props as {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    ref?: unknown;
  };
  return (
    <>
      {cloneElement(children, {
        "aria-describedby": open ? id : undefined,
        onMouseEnter: (e: MouseEvent<HTMLElement>) => {
          props.onMouseEnter?.(e);
          anchorRef.current = e.currentTarget;
          show(delay);
        },
        onMouseLeave: (e: MouseEvent<HTMLElement>) => {
          props.onMouseLeave?.(e);
          hide();
        },
        onFocus: (e: FocusEvent<HTMLElement>) => {
          props.onFocus?.(e);
          anchorRef.current = e.currentTarget;
          show(0);
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          props.onBlur?.(e);
          hide();
        },
      })}
      {open ? (
        <div className={cn("fds-floating fds-tooltip", className)} id={id} ref={ref} role="tooltip">
          {content}
        </div>
      ) : null}
    </>
  );
}
