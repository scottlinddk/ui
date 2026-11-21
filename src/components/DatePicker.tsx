import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import { parseISODate, toISODate } from "../lib/date.js";
import { Calendar, type CalendarProps } from "./Calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover.js";

export interface DatePickerProps extends Pick<
  CalendarProps,
  "locale" | "weekStartsOn" | "isDateDisabled" | "today"
> {
  /** ISO date `YYYY-MM-DD`, or "" when empty. Never a formatted string. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (iso: string) => void;
  /** ISO bounds. */
  min?: string;
  max?: string;
  /** How the typed field shows a date. Defaults to ISO; pass your locale formatter. */
  formatValue?: (iso: string) => string;
  /** Parse typed text to ISO, or null when it is not a date. Defaults to strict ISO. */
  parseValue?: (text: string) => string | null;
  placeholder?: string;
  calendarLabel?: string;
  calendarIcon?: ReactNode;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

const defaultParse = (text: string) => {
  const date = parseISODate(text);
  return date ? toISODate(date) : null;
};

/** Typed entry (always available) plus a calendar popover. */
export function DatePicker({
  value,
  defaultValue = "",
  onValueChange,
  min,
  max,
  formatValue = (iso) => iso,
  parseValue = defaultParse,
  placeholder = "YYYY-MM-DD",
  calendarLabel = "Choose date",
  calendarIcon = "▾",
  locale,
  weekStartsOn,
  isDateDisabled,
  today,
  name,
  className,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: DatePickerProps) {
  const [iso, setIso] = useControllable(value, defaultValue, onValueChange);
  const [text, setText] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);
  const date = iso ? parseISODate(iso) : null;
  return (
    <div className={cn("fds-input-group fds-date-picker", className)}>
      <input
        aria-invalid={invalid || ariaInvalid === true || ariaInvalid === "true" ? true : undefined}
        className="fds-control"
        inputMode="numeric"
        onBlur={() => {
          if (text !== null && text.trim() !== "" && parseValue(text) === null) setInvalid(true);
          setText(null);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          if (next.trim() === "") {
            setInvalid(false);
            setIso("");
            return;
          }
          const parsed = parseValue(next);
          setInvalid(parsed === null ? invalid : false);
          if (parsed !== null) setIso(parsed);
        }}
        placeholder={placeholder}
        type="text"
        value={text ?? (iso ? formatValue(iso) : "")}
        {...inputProps}
      />
      {name ? <input name={name} type="hidden" value={iso} /> : null}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          aria-label={calendarLabel}
          disabled={inputProps.disabled}
          variant="secondary"
        >
          <span aria-hidden="true">{calendarIcon}</span>
        </PopoverTrigger>
        <PopoverContent align="end" aria-label={calendarLabel}>
          <Calendar
            autoFocus
            defaultMonth={date ?? undefined}
            isDateDisabled={isDateDisabled}
            locale={locale}
            max={max ? (parseISODate(max) ?? undefined) : undefined}
            min={min ? (parseISODate(min) ?? undefined) : undefined}
            onValueChange={(picked) => {
              setIso(toISODate(picked));
              setText(null);
              setInvalid(false);
              setOpen(false);
            }}
            today={today}
            value={date}
            weekStartsOn={weekStartsOn}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
