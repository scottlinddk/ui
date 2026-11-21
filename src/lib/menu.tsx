import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from "react";
import { cn } from "./cn.js";

const CloseContext = createContext<(() => void) | null>(null);
export const useMenuClose = () => useContext(CloseContext);

export interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Called on Escape/Tab (`restoreFocus` true for Escape) and after an item is chosen. */
  onClose: (restoreFocus: boolean) => void;
  surfaceRef: Ref<HTMLDivElement>;
}

const ITEMS = '[role^="menuitem"]:not(:disabled)';

/** `role="menu"` with roving focus, Home/End, first-letter typeahead, Escape and Tab handling. */
export function MenuSurface({
  onClose,
  surfaceRef,
  className,
  onKeyDown,
  ...props
}: MenuSurfaceProps) {
  const local = useRef<HTMLDivElement | null>(null);
  const typed = useRef({ text: "", at: 0 });
  useEffect(() => {
    local.current?.querySelector<HTMLElement>(ITEMS)?.focus();
  }, []);
  const handle = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEMS));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const go = (index: number) => {
      event.preventDefault();
      items[(index + items.length) % items.length]?.focus();
    };
    if (event.key === "ArrowDown") go(current + 1);
    else if (event.key === "ArrowUp") go(current < 0 ? items.length - 1 : current - 1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(items.length - 1);
    else if (event.key === "Escape") {
      event.preventDefault();
      onClose(true);
    } else if (event.key === "Tab") onClose(false);
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      typed.current.text =
        now - typed.current.at > 700 ? event.key : typed.current.text + event.key;
      typed.current.at = now;
      const query = typed.current.text.toLowerCase();
      const start = typed.current.text.length === 1 ? current + 1 : current;
      const ordered = [...items.slice(start), ...items.slice(0, start)];
      ordered.find((el) => el.textContent?.trim().toLowerCase().startsWith(query))?.focus();
    }
  };
  return (
    <CloseContext.Provider value={() => onClose(true)}>
      <div
        className={cn("fds-floating fds-menu-surface", className)}
        onKeyDown={handle}
        ref={(node) => {
          local.current = node;
          if (typeof surfaceRef === "function") surfaceRef(node);
          else if (surfaceRef) (surfaceRef as { current: HTMLDivElement | null }).current = node;
        }}
        role="menu"
        {...props}
      />
    </CloseContext.Provider>
  );
}
