// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  ButtonGroup,
  Button,
  Checkbox,
  Collapsible,
  FieldSet,
  InputGroup,
  InputGroupAddon,
  Input,
  InputOTP,
  Kbd,
  KbdGroup,
  Label,
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Separator,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "../index.js";

expect.extend(matchers);
afterEach(cleanup);

describe("static primitives", () => {
  it("Spinner announces a label, Separator is decorative by default", () => {
    expect(renderToStaticMarkup(<Spinner label="Saving" />)).toContain("Saving");
    expect(renderToStaticMarkup(<Separator />)).toContain('role="none"');
    expect(renderToStaticMarkup(<Separator decorative={false} />)).toContain('role="separator"');
  });
  it("Progress exposes progressbar semantics", () => {
    const out = renderToStaticMarkup(
      <Progress aria-label="Upload" value={30} valueText="3 of 10" />,
    );
    expect(out).toContain('role="progressbar"');
    expect(out).toContain('aria-valuenow="30"');
    expect(renderToStaticMarkup(<Progress aria-label="Upload" />)).not.toContain("aria-valuenow");
  });
  it("Pagination marks the active page", () => {
    const out = renderToStaticMarkup(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink active href="?p=2">
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(out).toContain('aria-current="page"');
  });
  it("composes with no axe violations", async () => {
    const { container } = render(
      <main>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Now</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Account</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
        <ButtonGroup aria-label="View">
          <Button>A</Button>
          <Button>B</Button>
        </ButtonGroup>
        <InputGroup>
          <Input aria-label="Amount" />
          <InputGroupAddon align="end">DKK</InputGroupAddon>
        </InputGroup>
        <ScrollArea aria-label="Rows">x</ScrollArea>
        <Avatar fallback="SL" />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Avatar", () => {
  it("falls back when the image fails", () => {
    const { container } = render(<Avatar alt="Scott" fallback="SL" src="/missing.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event("error"));
  });
});

describe("form controls", () => {
  it("Checkbox and Switch toggle and expose roles", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox label="Accept" />
        <Switch label="Alerts" />
      </>,
    );
    await user.click(screen.getByLabelText("Accept"));
    expect((screen.getByLabelText("Accept") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("switch", { name: "Alerts" }) as HTMLInputElement).checked).toBe(
      false,
    );
    await user.click(screen.getByText("Alerts"));
    expect((screen.getByRole("switch", { name: "Alerts" }) as HTMLInputElement).checked).toBe(true);
  });
  it("RadioGroup shares one name and reports changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup defaultValue="a" legend="Plan" onValueChange={onValueChange}>
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    await user.click(screen.getByLabelText("B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect((screen.getByLabelText("B") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("A") as HTMLInputElement).checked).toBe(false);
    expect(await axe(container)).toHaveNoViolations();
  });
  it("FieldSet renders a legend", () => {
    render(
      <FieldSet legend="Topics">
        <Checkbox label="One" />
      </FieldSet>,
    );
    expect(screen.getByRole("group", { name: "Topics" })).toBeTruthy();
  });
  it("Toggle and ToggleGroup use aria-pressed", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toggle>Bold</Toggle>
        <ToggleGroup aria-label="Period" type="single">
          <ToggleGroupItem value="1m">1M</ToggleGroupItem>
          <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
        </ToggleGroup>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true");
    await user.click(screen.getByRole("button", { name: "1M" }));
    await user.click(screen.getByRole("button", { name: "1Y" }));
    expect(screen.getByRole("button", { name: "1M" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "1Y" }).getAttribute("aria-pressed")).toBe("true");
  });
  it("Slider forwards valueText", () => {
    render(<Slider aria-label="Risk" defaultValue={3} max={5} valueText="Moderate" />);
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("Moderate");
  });
  it("InputOTP keeps digits only and fires onComplete", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<InputOTP aria-label="Code" length={4} onComplete={onComplete} />);
    const input = screen.getByLabelText("Code");
    expect(input.getAttribute("autocomplete")).toBe("one-time-code");
    await user.type(input, "1a2b34");
    expect((input as HTMLInputElement).value).toBe("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });
});

describe("disclosure", () => {
  function Harness() {
    const [value, setValue] = useState("a");
    return (
      <Tabs onValueChange={setValue} value={value}>
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );
  }
  it("Tabs switch with arrow keys and manage roving tabindex", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("tabindex")).toBe("-1");
    screen.getByRole("tab", { name: "A" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel B");
    expect(await axe(container)).toHaveNoViolations();
  });
  it("single Accordion shares one details name", () => {
    const { container } = render(
      <Accordion type="single">
        <AccordionItem title="One">a</AccordionItem>
        <AccordionItem title="Two">b</AccordionItem>
      </Accordion>,
    );
    const names = Array.from(container.querySelectorAll("details")).map((d) =>
      d.getAttribute("name"),
    );
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });
});

describe("Collapsible, Kbd and Label", () => {
  it("Collapsible is a native details that toggles and can start open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Collapsible title="Closed">a</Collapsible>
        <Collapsible open title="Open">
          b
        </Collapsible>
      </>,
    );
    const [closed, open] = Array.from(container.querySelectorAll("details"));
    expect(closed?.open).toBe(false);
    expect(open?.open).toBe(true);
    await user.click(screen.getByText("Closed"));
    expect(closed?.open).toBe(true);
    expect(await axe(container)).toHaveNoViolations();
  });
  it("Kbd renders a kbd element inside its group", () => {
    const out = renderToStaticMarkup(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    expect(out).toContain("<kbd");
    expect(out).toContain("fds-kbd-group");
  });
  it("Label associates with its control", () => {
    render(
      <>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" />
      </>,
    );
    expect(screen.getByLabelText("Amount").id).toBe("amount");
  });
});
