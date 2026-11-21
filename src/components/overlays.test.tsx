// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import {
  Button,
  Calendar,
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DatePicker,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SelectMenu,
  Tooltip,
} from "../index.js";

expect.extend(matchers);
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Popover", () => {
  it("opens, wires ARIA, and closes on Escape returning focus", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover>
        <PopoverTrigger>Filters</PopoverTrigger>
        <PopoverContent aria-label="Filters">Body</PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
    expect(await axe(container)).toHaveNoViolations();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it("closes on outside press", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent aria-label="Panel">x</PopoverContent>
        </Popover>
        <p>outside</p>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Tooltip", () => {
  it("opens on keyboard focus, describes the trigger, closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saves a draft">
        <Button>Save</Button>
      </Tooltip>,
    );
    await user.tab();
    const tip = screen.getByRole("tooltip");
    expect(screen.getByRole("button", { name: "Save" }).getAttribute("aria-describedby")).toBe(
      tip.id,
    );
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  it("opens on hover after the delay", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint" delay={300}>
        <Button>Info</Button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Info" }));
    expect(screen.queryByRole("tooltip")).toBeNull();
    act(() => void vi.advanceTimersByTime(300));
    expect(screen.getByRole("tooltip").textContent).toBe("Hint");
  });
});

describe("HoverCard", () => {
  it("opens on focus and stays open while the card is hovered", () => {
    vi.useFakeTimers();
    render(
      <HoverCard openDelay={0} closeDelay={100}>
        <HoverCardTrigger href="/fund">Fund</HoverCardTrigger>
        <HoverCardContent>Details</HoverCardContent>
      </HoverCard>,
    );
    fireEvent.focus(screen.getByRole("link", { name: "Fund" }));
    act(() => void vi.advanceTimersByTime(0));
    expect(screen.getByText("Details")).toBeTruthy();
    fireEvent.mouseLeave(screen.getByRole("link", { name: "Fund" }));
    fireEvent.mouseEnter(screen.getByText("Details"));
    act(() => void vi.advanceTimersByTime(200));
    expect(screen.getByText("Details")).toBeTruthy();
  });
});

describe("DropdownMenu", () => {
  function Menu({ onPick }: { onPick: () => void }) {
    const [checked, setChecked] = useState(false);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Actions">
          <DropdownMenuItem onClick={onPick}>Rename</DropdownMenuItem>
          <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
            Pinned
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  it("opens with ArrowDown, navigates, selects and returns focus", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    const { container } = render(<Menu onPick={onPick} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toBe("Rename");
    expect(await axe(container)).toHaveNoViolations();
    await user.keyboard("{ArrowDown}{ArrowUp}{Enter}");
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it("typeahead focuses the matching item and the checkbox item stays open", async () => {
    const user = userEvent.setup();
    render(<Menu onPick={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.keyboard("p");
    expect(document.activeElement?.textContent).toBe("Pinned");
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Pinned" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("ContextMenu", () => {
  it("opens on contextmenu and on Shift+F10", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenuTrigger aria-label="Row" tabIndex={0}>
          Row
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="Row actions">
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByLabelText("Row"), { clientX: 10, clientY: 10 });
    expect(screen.getByRole("menu", { name: "Row actions" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    screen.getByLabelText("Row").focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(screen.getByRole("menu")).toBeTruthy();
  });
});

const options = [
  { value: "dk", label: "Denmark" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway", disabled: true },
];

describe("Combobox", () => {
  it("filters, navigates and selects with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Country" onValueChange={onValueChange} options={options} />);
    const input = screen.getByRole("combobox", { name: "Country" }) as HTMLInputElement;
    await user.type(input, "s");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Sweden"]);
    expect(input.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option").id);
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("se");
    expect(input.value).toBe("Sweden");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("skips disabled options and shows empty text", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Country" options={options} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "zzz");
    expect(screen.getByText("No results")).toBeTruthy();
    await user.clear(input);
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(screen.getAllByRole("option")[2]?.hasAttribute("data-active")).toBe(false);
  });
});

describe("SelectMenu", () => {
  it("opens with the keyboard, selects, and submits through a hidden input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <SelectMenu
        aria-label="Country"
        name="country"
        onValueChange={onValueChange}
        options={options}
      />,
    );
    const button = screen.getByRole("combobox", { name: "Country" });
    button.focus();
    await user.keyboard("{ArrowDown}");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("se");
    expect((container.querySelector('input[name="country"]') as HTMLInputElement).value).toBe("se");
    expect(button.textContent).toBe("Sweden");
  });
});

describe("Calendar", () => {
  const today = new Date(2025, 0, 15);
  it("renders a labelled month grid starting on Monday", () => {
    const { container } = render(<Calendar locale="en" today={today} />);
    expect(screen.getByRole("grid").getAttribute("aria-labelledby")).toBeTruthy();
    expect(container.querySelector("th")?.textContent).toBe("Mon");
    expect(container.querySelectorAll("[data-date]").length).toBe(31);
    expect(container.querySelector("[data-today]")?.getAttribute("data-date")).toBe("2025-01-15");
  });
  it("moves focus with arrows, crosses months, and selects", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar locale="en" onValueChange={onValueChange} today={today} />);
    const day = (iso: string) => document.querySelector(`[data-date="${iso}"]`) as HTMLElement;
    day("2025-01-15").focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(day("2025-01-16"));
    await user.keyboard("{PageDown}");
    expect(document.activeElement).toBe(day("2025-02-16"));
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]?.[0].getDate()).toBe(16);
  });
  it("keeps disabled days focusable but not selectable", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        locale="en"
        onValueChange={onValueChange}
        today={today}
      />,
    );
    const saturday = document.querySelector('[data-date="2025-01-18"]') as HTMLElement;
    expect(saturday.getAttribute("aria-disabled")).toBe("true");
    await user.click(saturday);
    expect(onValueChange).not.toHaveBeenCalled();
  });
  it("has no axe violations", async () => {
    const { container } = render(<Calendar locale="en" today={today} value={today} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("DatePicker", () => {
  it("accepts typed ISO dates and flags invalid text on blur", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Settlement date" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Settlement date" });
    await user.type(input, "2025-03-14");
    expect(onValueChange).toHaveBeenLastCalledWith("2025-03-14");
    await user.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith("");
    await user.type(input, "14/03");
    await user.tab();
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
  it("picks from the calendar and uses the app's formatter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        aria-label="Date"
        defaultValue="2025-01-15"
        formatValue={(iso) => iso.split("-").reverse().join("-")}
        locale="en"
        onValueChange={onValueChange}
        today={new Date(2025, 0, 15)}
      />,
    );
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("15-01-2025");
    await user.click(screen.getByRole("button", { name: "Choose date" }));
    await user.click(document.querySelector('[data-date="2025-01-20"]') as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith("2025-01-20");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
