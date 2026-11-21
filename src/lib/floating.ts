import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** Pure placement: prefers `side`, flips when it does not fit, then keeps the box inside the viewport. */
export function computePosition(
  anchor: Box,
  size: { width: number; height: number },
  side: Side,
  align: Align,
  offset: number,
  viewport: { width: number; height: number },
  margin = 8,
): { x: number; y: number; side: Side } {
  const room: Record<Side, number> = {
    top: anchor.y - margin,
    bottom: viewport.height - (anchor.y + anchor.height) - margin,
    left: anchor.x - margin,
    right: viewport.width - (anchor.x + anchor.width) - margin,
  };
  const need = (s: Side) => (s === "top" || s === "bottom" ? size.height : size.width) + offset;
  const placed =
    room[side] < need(side) && room[OPPOSITE[side]] >= need(OPPOSITE[side]) ? OPPOSITE[side] : side;

  const alignAxis = (start: number, length: number, floating: number) =>
    align === "start"
      ? start
      : align === "end"
        ? start + length - floating
        : start + (length - floating) / 2;

  let x: number;
  let y: number;
  if (placed === "top" || placed === "bottom") {
    x = alignAxis(anchor.x, anchor.width, size.width);
    y = placed === "top" ? anchor.y - offset - size.height : anchor.y + anchor.height + offset;
  } else {
    y = alignAxis(anchor.y, anchor.height, size.height);
    x = placed === "left" ? anchor.x - offset - size.width : anchor.x + anchor.width + offset;
  }
  const clamp = (v: number, total: number, length: number) =>
    Math.max(margin, Math.min(v, total - length - margin));
  return {
    x: clamp(x, viewport.width, size.width),
    y: clamp(y, viewport.height, size.height),
    side: placed,
  };
}

const useIsoLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

export interface FloatingOptions {
  open: boolean;
  /** Viewport-relative rect of whatever the floating element is anchored to. */
  anchor: () => Box | null;
  side?: Side;
  align?: Align;
  offset?: number;
  /** Make the floating element at least as wide as the anchor (listboxes). */
  matchWidth?: boolean;
}

/**
 * Puts an element in the browser top layer (native `popover="manual"`, so no portal, z-index or theme
 * scoping problems) and positions it with `position: fixed`. Falls back to plain fixed positioning
 * where the Popover API is missing.
 */
export function useFloating<T extends HTMLElement>(options: FloatingOptions): RefObject<T> {
  const ref = useRef<T>(null);
  const latest = useRef(options);
  latest.current = options;
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!options.open || !el) return;
    el.setAttribute("popover", "manual");
    try {
      (el as unknown as { showPopover?: () => void }).showPopover?.();
    } catch {
      /* already open or unsupported: positioning below still works */
    }
    const update = () => {
      const { anchor, side = "bottom", align = "start", offset = 4, matchWidth } = latest.current;
      const box = anchor();
      if (!box) return;
      if (matchWidth) el.style.minInlineSize = `${box.width}px`;
      const pos = computePosition(
        box,
        { width: el.offsetWidth, height: el.offsetHeight },
        side,
        align,
        offset,
        { width: window.innerWidth, height: window.innerHeight },
      );
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.dataset.side = pos.side;
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      try {
        (el as unknown as { hidePopover?: () => void }).hidePopover?.();
      } catch {
        /* element already detached */
      }
    };
  }, [options.open]);
  return ref;
}

export function rectOf(el: Element | null | undefined): Box | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

export interface DismissOptions {
  open: boolean;
  /** Elements that count as "inside" (trigger and floating content). */
  inside: ReadonlyArray<RefObject<Element | null>>;
  onOutside: () => void;
  onEscape: () => void;
}

/** Outside press and Escape while open. */
export function useDismiss({ open, inside, onOutside, onEscape }: DismissOptions) {
  const latest = useRef({ inside, onOutside, onEscape });
  latest.current = { inside, onOutside, onEscape };
  useEffect(() => {
    if (!open) return;
    const down = (event: Event) => {
      const target = event.target as Node;
      if (latest.current.inside.some((ref) => ref.current?.contains(target))) return;
      latest.current.onOutside();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") latest.current.onEscape();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
}
