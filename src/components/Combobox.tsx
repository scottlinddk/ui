import { useId, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import { rectOf, useDismiss, useFloating } from "../lib/floating.js";
import { Listbox, nextEnabled, optionId, type ListboxOption } from "../lib/listbox.js";

export type ComboboxOption = ListboxOption;

export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "role" | "type"
> {
  options: readonly ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  emptyText?: string;
  /** Submitted with forms (the input itself holds the visible label). */
  name?: string;
}

/**
 * Searchable single select (ARIA 1.2 combobox with list autocomplete). Options are filtered on their
 * label with a case-insensitive "contains"; pass fewer/other options yourself for server-side search.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  emptyText = "No results",
  name,
  className,
  onKeyDown,
  onBlur,
  onClick,
  ...props
}: ComboboxProps) {
  const [selected, setSelected] = useControllable<string | null>(
    value,
    defaultValue,
    onValueChange,
  );
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? "";
  const shown =
    query === null
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));
  const listRef = useFloating<HTMLUListElement>({
    open,
    anchor: () => rectOf(inputRef.current),
    matchWidth: true,
  });
  const close = () => {
    setOpen(false);
    setQuery(null);
    setActive(-1);
  };
  useDismiss({ open, inside: [listRef, inputRef], onOutside: close, onEscape: () => undefined });

  const choose = (option: ComboboxOption) => {
    setSelected(option.value);
    close();
  };
  const move = (step: 1 | -1, list = shown) => {
    setOpen(true);
    setActive(nextEnabled(list, active < 0 ? (step === 1 ? -1 : 0) : active, step));
  };
  const handle = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Enter" && open && active >= 0) {
      event.preventDefault();
      const option = shown[active];
      if (option && !option.disabled) choose(option);
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        close();
      } else if (selected !== null) setSelected(null);
    }
  };
  return (
    <>
      <input
        aria-activedescendant={open && active >= 0 ? optionId(listId, active) : undefined}
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        autoComplete="off"
        className={cn("fds-control fds-combobox", className)}
        onBlur={(event) => {
          onBlur?.(event);
          close();
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          const next = options.filter((o) =>
            o.label.toLowerCase().includes(event.target.value.trim().toLowerCase()),
          );
          setActive(next.findIndex((o) => !o.disabled));
        }}
        onClick={(event) => {
          onClick?.(event);
          setOpen(true);
        }}
        onKeyDown={handle}
        ref={inputRef}
        role="combobox"
        type="text"
        value={query ?? selectedLabel}
        {...props}
      />
      {name ? <input name={name} type="hidden" value={selected ?? ""} /> : null}
      {open ? (
        <Listbox
          activeIndex={active}
          emptyText={emptyText}
          id={listId}
          listRef={listRef}
          onSelect={choose}
          options={shown}
          selectedValue={selected}
        />
      ) : null}
    </>
  );
}
