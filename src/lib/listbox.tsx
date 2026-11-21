import { useEffect, type Ref } from "react";
import { cn } from "./cn.js";

export interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const optionId = (id: string, index: number) => `${id}-option-${index}`;

export interface ListboxProps {
  id: string;
  options: readonly ListboxOption[];
  activeIndex: number;
  selectedValue: string | null | undefined;
  onSelect: (option: ListboxOption) => void;
  emptyText?: string;
  listRef: Ref<HTMLUListElement>;
  label?: string;
  className?: string;
}

/** Popup list: focus stays on the owning input/button, which points here with `aria-activedescendant`. */
export function Listbox({
  id,
  options,
  activeIndex,
  selectedValue,
  onSelect,
  emptyText,
  listRef,
  label,
  className,
}: ListboxProps) {
  useEffect(() => {
    document.getElementById(optionId(id, activeIndex))?.scrollIntoView?.({ block: "nearest" });
  }, [id, activeIndex]);
  return (
    <ul
      aria-label={label}
      className={cn("fds-floating fds-listbox", className)}
      id={id}
      ref={listRef}
      role="listbox"
    >
      {options.length === 0 ? (
        <li aria-disabled="true" className="fds-listbox__empty" role="option">
          {emptyText}
        </li>
      ) : (
        options.map((option, index) => (
          <li
            aria-disabled={option.disabled || undefined}
            aria-selected={option.value === selectedValue}
            className="fds-listbox__option"
            data-active={index === activeIndex ? "" : undefined}
            id={optionId(id, index)}
            key={option.value}
            // Keep focus on the input/button so blur does not close the list before the click lands.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!option.disabled) onSelect(option);
            }}
            role="option"
          >
            {option.label}
          </li>
        ))
      )}
    </ul>
  );
}

export const nextEnabled = (
  options: readonly ListboxOption[],
  from: number,
  step: 1 | -1,
): number => {
  if (options.length === 0) return -1;
  for (let i = 1; i <= options.length; i++) {
    const index = (from + step * i + options.length * 2) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
};
