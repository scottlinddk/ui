import { useId, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent } from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import { rectOf, useDismiss, useFloating } from "../lib/floating.js";
import { Listbox, nextEnabled, optionId, type ListboxOption } from "../lib/listbox.js";

export type SelectMenuOption = ListboxOption;

export interface SelectMenuProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "role" | "type"
> {
  options: readonly SelectMenuOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  name?: string;
}

/**
 * Custom select (ARIA select-only combobox). Prefer the native `Select`: it is the best mobile picker.
 * Use this only when options need a consistent look across platforms.
 */
export function SelectMenu({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Select…",
  name,
  className,
  onKeyDown,
  onClick,
  onBlur,
  ...props
}: SelectMenuProps) {
  const [selected, setSelected] = useControllable<string | null>(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const listId = `${id}-list`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const listRef = useFloating<HTMLUListElement>({
    open,
    anchor: () => rectOf(buttonRef.current),
    matchWidth: true,
  });
  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  useDismiss({ open, inside: [listRef, buttonRef], onOutside: close, onEscape: () => undefined });

  const openList = () => {
    setOpen(true);
    setActive(selectedIndex >= 0 ? selectedIndex : nextEnabled(options, -1, 1));
  };
  const choose = (option: SelectMenuOption) => {
    setSelected(option.value);
    close();
  };
  const handle = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const key = event.key;
    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      if (!open) openList();
      else setActive(nextEnabled(options, active, key === "ArrowDown" ? 1 : -1));
    } else if (key === "Home" || key === "End") {
      if (!open) return;
      event.preventDefault();
      setActive(key === "Home" ? nextEnabled(options, -1, 1) : nextEnabled(options, 0, -1));
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (!open) openList();
      else {
        const option = options[active];
        if (option && !option.disabled) choose(option);
        else close();
      }
    } else if (key === "Escape" && open) {
      event.preventDefault();
      close();
    } else if (key === "Tab") close();
    else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
      typed.current.at = now;
      const query = typed.current.text.toLowerCase();
      const hit = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(query));
      if (hit >= 0) {
        if (open) setActive(hit);
        else setSelected(options[hit]!.value);
      }
    }
  };
  return (
    <>
      <button
        aria-activedescendant={open && active >= 0 ? optionId(listId, active) : undefined}
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn("fds-control fds-select-menu", className)}
        onBlur={(event) => {
          onBlur?.(event);
          close();
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) (open ? close : openList)();
        }}
        onKeyDown={handle}
        ref={buttonRef}
        role="combobox"
        type="button"
        {...props}
      >
        <span className={selectedIndex < 0 ? "fds-select-menu__placeholder" : undefined}>
          {selectedIndex >= 0 ? options[selectedIndex]!.label : placeholder}
        </span>
      </button>
      {name ? <input name={name} type="hidden" value={selected ?? ""} /> : null}
      {open ? (
        <Listbox
          activeIndex={active}
          id={listId}
          listRef={listRef}
          onSelect={choose}
          options={options}
          selectedValue={selected}
        />
      ) : null}
    </>
  );
}
