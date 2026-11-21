import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/cn.js";
import { useControllable } from "../lib/controllable.js";
import {
  addDays,
  addMonths,
  daysInMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  toISODate,
} from "../lib/date.js";

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Selected day. Always a `Date`, never a formatted string. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Visible month (any day in it). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** BCP 47 tag for month and weekday names, from the app. */
  locale?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Bank holidays, settlement days, etc. Disabled days stay focusable but cannot be chosen. */
  isDateDisabled?: (date: Date) => boolean;
  min?: Date;
  max?: Date;
  /** Override "today" (tests, server-defined business date). */
  today?: Date;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  /** Move focus into the grid on mount (used inside popovers). */
  autoFocus?: boolean;
}

/** Month grid with full keyboard support (arrows, Home/End, PageUp/PageDown, Shift+Page for years). */
export function Calendar({
  value,
  defaultValue = null,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  locale,
  weekStartsOn = 1,
  isDateDisabled,
  min,
  max,
  today: todayProp,
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  autoFocus,
  className,
  ...props
}: CalendarProps) {
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const [selected, setSelected] = useControllable<Date | null>(
    value,
    defaultValue,
    onValueChange as ((d: Date | null) => void) | undefined,
  );
  const [visible, setVisible] = useControllable<Date>(
    month === undefined ? undefined : startOfMonth(month),
    startOfMonth(defaultMonth ?? selected ?? today),
    onMonthChange,
  );
  const [focused, setFocused] = useState<Date>(() =>
    selected && isSameMonth(selected, visible)
      ? selected
      : isSameMonth(today, visible)
        ? today
        : visible,
  );
  const wantFocus = useRef(Boolean(autoFocus));
  const gridRef = useRef<HTMLTableElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISODate(focused)}"]`)?.focus();
  });

  const disabled = (date: Date) =>
    Boolean(
      (min && date < startOfDay(min)) || (max && date > startOfDay(max)) || isDateDisabled?.(date),
    );

  const dayFormat = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);
  const headingFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const day = new Date(2023, 0, 1 + ((weekStartsOn + i) % 7)); // 2023-01-01 is a Sunday
        return {
          short: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day),
          long: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(day),
        };
      }),
    [locale, weekStartsOn],
  );

  const goTo = (date: Date, moveFocus: boolean) => {
    setFocused(date);
    if (!isSameMonth(date, visible)) setVisible(startOfMonth(date));
    wantFocus.current = moveFocus;
  };
  const shiftMonth = (delta: number) => goTo(addMonths(focused, delta), false);

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const keys: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      Home: addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const next = keys[event.key];
    if (!next) return;
    event.preventDefault();
    goTo(next, true);
  };

  const lead = (visible.getDay() - weekStartsOn + 7) % 7;
  const total = daysInMonth(visible);
  const cells: Array<Date | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: total },
      (_, i) => new Date(visible.getFullYear(), visible.getMonth(), i + 1),
    ),
  ];
  while (cells.length % 7) cells.push(null);
  const rows = Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  return (
    <div className={cn("fds-calendar", className)} {...props}>
      <div className="fds-calendar__header">
        <button
          aria-label={previousMonthLabel}
          className="fds-calendar__nav"
          onClick={() => shiftMonth(-1)}
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div aria-live="polite" className="fds-calendar__heading" id={headingId}>
          {headingFormat.format(visible)}
        </div>
        <button
          aria-label={nextMonthLabel}
          className="fds-calendar__nav"
          onClick={() => shiftMonth(1)}
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <table
        aria-labelledby={headingId}
        className="fds-calendar__grid"
        onKeyDown={onKeyDown}
        ref={gridRef}
        role="grid"
      >
        <thead>
          <tr>
            {weekdays.map((d) => (
              <th abbr={d.long} key={d.long} scope="col">
                {d.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((date, c) =>
                date ? (
                  <td
                    aria-selected={selected ? isSameDay(date, selected) : false}
                    key={c}
                    role="gridcell"
                  >
                    <button
                      aria-current={isSameDay(date, today) ? "date" : undefined}
                      aria-disabled={disabled(date) || undefined}
                      aria-label={dayFormat.format(date)}
                      className="fds-calendar__day"
                      data-date={toISODate(date)}
                      data-selected={selected && isSameDay(date, selected) ? "" : undefined}
                      data-today={isSameDay(date, today) ? "" : undefined}
                      onClick={() => {
                        if (disabled(date)) return;
                        setFocused(date);
                        setSelected(date);
                      }}
                      tabIndex={isSameDay(date, focused) ? 0 : -1}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  </td>
                ) : (
                  <td key={c} role="gridcell" />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
