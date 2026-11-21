import { useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionItem,
  AlertDialog,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  ButtonGroup,
  Calendar,
  Checkbox,
  Collapsible,
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DatePicker,
  Dialog,
  DistributionList,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  FieldSet,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputOTP,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Kbd,
  KbdGroup,
  KeyValue,
  Label,
  Menu,
  Meter,
  Metric,
  Notice,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Panel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  SegmentedMeter,
  Select,
  SelectMenu,
  Separator,
  Sheet,
  Skeleton,
  SkeletonGroup,
  SkeletonText,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastRegion,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from "../src/index.js";

export type ComponentGroup =
  | "Actions & content"
  | "Forms"
  | "Feedback & status"
  | "Navigation & disclosure"
  | "Overlays & anchored";

export interface ComponentEntry {
  /** Display name; also the anchor id. */
  name: string;
  group: ComponentGroup;
  description: string;
  /** Every runtime export from `@scttlnd/ui` this entry documents. */
  exports: readonly string[];
  /** True when the module is a client component (`"use client"`); false = server-compatible. */
  client: boolean;
  /** Notes on accessibility or intended use. */
  notes?: string;
  Demo: () => ReactNode;
}

const options = [
  { value: "dk", label: "Denmark" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
];

function DialogDemo() {
  const [open, setOpen] = useState<"dialog" | "sheet" | "alert" | null>(null);
  return (
    <div className="cp-row">
      <Button variant="secondary" onClick={() => setOpen("dialog")}>
        Dialog
      </Button>
      <Button variant="secondary" onClick={() => setOpen("sheet")}>
        Sheet
      </Button>
      <Button variant="danger" onClick={() => setOpen("alert")}>
        AlertDialog
      </Button>
      <Dialog
        description="Changes apply to this account only."
        footer={<Button onClick={() => setOpen(null)}>Done</Button>}
        onOpenChange={(next) => setOpen(next ? "dialog" : null)}
        open={open === "dialog"}
        title="Edit account"
      >
        <p>Native &lt;dialog&gt;: focus returns to the trigger and Escape closes.</p>
      </Dialog>
      <Sheet
        onOpenChange={(next) => setOpen(next ? "sheet" : null)}
        open={open === "sheet"}
        title="Filters"
      >
        <p>Slides from an edge and respects safe areas.</p>
      </Sheet>
      <AlertDialog
        confirmLabel="Delete"
        description="This cannot be undone."
        onConfirm={() => setOpen(null)}
        onOpenChange={(next) => setOpen(next ? "alert" : null)}
        open={open === "alert"}
        title="Delete account?"
        tone="danger"
      />
    </div>
  );
}

function ToastDemo() {
  const [shown, setShown] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setShown(true)}>
        Show toast
      </Button>
      <ToastRegion>
        {shown ? (
          <Toast
            action={{ label: "Undo", onSelect: () => setShown(false) }}
            onDismiss={() => setShown(false)}
            title="View archived"
            tone="success"
          />
        ) : null}
      </ToastRegion>
    </>
  );
}

function CheckboxDemo() {
  return (
    <FieldSet legend="Notifications">
      <Checkbox defaultChecked hint="Sent once a week" label="Email" />
      <Checkbox label="SMS" />
    </FieldSet>
  );
}

function ControlledMenu() {
  const [pinned, setPinned] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Account actions">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pinned
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** One entry per documented export. `all-components.test.tsx` fails if a public export is missing. */
export const componentEntries: readonly ComponentEntry[] = [
  {
    name: "Button",
    group: "Actions & content",
    description: "Primary, secondary, ghost and danger actions with 44px touch targets.",
    exports: ["Button"],
    client: true,
    Demo: () => (
      <div className="cp-row">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
  },
  {
    name: "ButtonGroup",
    group: "Actions & content",
    description: "Joins adjacent buttons into one control.",
    exports: ["ButtonGroup"],
    client: false,
    Demo: () => (
      <ButtonGroup aria-label="View">
        <Button variant="secondary">Day</Button>
        <Button variant="secondary">Week</Button>
        <Button variant="secondary">Month</Button>
      </ButtonGroup>
    ),
  },
  {
    name: "Toggle & ToggleGroup",
    group: "Actions & content",
    description: "Two-state buttons with aria-pressed, alone or in a group (period filters).",
    exports: ["Toggle", "ToggleGroup", "ToggleGroupItem"],
    client: true,
    Demo: () => (
      <div className="cp-row">
        <Toggle>Pin</Toggle>
        <ToggleGroup aria-label="Period" defaultValue={["1m"]} type="single">
          <ToggleGroupItem value="1d">1D</ToggleGroupItem>
          <ToggleGroupItem value="1m">1M</ToggleGroupItem>
          <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
  },
  {
    name: "Panel",
    group: "Actions & content",
    description: "Titled surface with eyebrow, help text and action; a labelled section.",
    exports: ["Panel"],
    client: true,
    Demo: () => (
      <Panel eyebrow="OVERVIEW" help="Supporting text" headingLevel={3} title="Account summary">
        Content
      </Panel>
    ),
  },
  {
    name: "Metric & KeyValue",
    group: "Actions & content",
    description: "Label/value pairs for pre-formatted figures. No formatting or arithmetic here.",
    exports: ["Metric", "KeyValue"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Metric label="Change" tone="success" value="+4,82 %" />
        <KeyValue label="Account" value="Everyday account" />
      </div>
    ),
  },
  {
    name: "Table",
    group: "Actions & content",
    description: "Semantic table: keyboard-scrollable, sticky header, numeric columns, aria-sort.",
    exports: ["Table", "TableHead", "TableBody", "TableRow", "TableCell", "TableHeaderCell"],
    client: false,
    Demo: () => (
      <Table caption="Holdings">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Fund</TableHeaderCell>
            <TableHeaderCell numeric>Value</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Fund A</TableCell>
            <TableCell numeric>1.240,50</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fund B</TableCell>
            <TableCell numeric>860,00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    name: "Item",
    group: "Actions & content",
    description: "List rows with media, title, description and actions.",
    exports: [
      "Item",
      "ItemGroup",
      "ItemMedia",
      "ItemContent",
      "ItemTitle",
      "ItemDescription",
      "ItemActions",
    ],
    client: false,
    Demo: () => (
      <ItemGroup>
        <Item>
          <ItemMedia>
            <Avatar fallback="SL" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Savings</ItemTitle>
            <ItemDescription>Everyday account</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge tone="success">Active</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    ),
  },
  {
    name: "Avatar",
    group: "Actions & content",
    description: "Image with initials fallback; group overlaps avatars.",
    exports: ["Avatar", "AvatarGroup"],
    client: true,
    Demo: () => (
      <AvatarGroup>
        <Avatar fallback="SL" />
        <Avatar fallback="NL" size="lg" />
        <Avatar alt="Broken" fallback="BR" src="/missing.png" size="sm" />
      </AvatarGroup>
    ),
  },
  {
    name: "Badge",
    group: "Actions & content",
    description: "Status chip. Always include meaningful text; never rely on tone alone.",
    exports: ["Badge"],
    client: false,
    Demo: () => (
      <div className="cp-row">
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warn">Warn</Badge>
        <Badge tone="danger">Danger</Badge>
      </div>
    ),
  },
  {
    name: "Kbd",
    group: "Actions & content",
    description: "Keyboard key hint.",
    exports: ["Kbd", "KbdGroup"],
    client: false,
    Demo: () => (
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    ),
  },
  {
    name: "Separator",
    group: "Actions & content",
    description: "Horizontal or vertical divider; decorative by default.",
    exports: ["Separator"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Separator />
        <div className="cp-row" style={{ blockSize: "1.5rem" }}>
          <span>A</span>
          <Separator orientation="vertical" />
          <span>B</span>
        </div>
      </div>
    ),
  },
  {
    name: "ScrollArea",
    group: "Actions & content",
    description: "Focusable, labelled scroll region for contained content. Never the page.",
    exports: ["ScrollArea"],
    client: false,
    Demo: () => (
      <ScrollArea aria-label="Notes" style={{ maxBlockSize: "5rem" }}>
        <p>First line.</p>
        <p>Second line.</p>
        <p>Third line.</p>
        <p>Fourth line.</p>
      </ScrollArea>
    ),
  },
  {
    name: "Field, Input, Select, Textarea",
    group: "Forms",
    description: "Label, hint and error wiring with 44px targets and 16px mobile font size.",
    exports: ["Field", "Input", "Select", "Textarea"],
    client: true,
    Demo: () => (
      <div className="cp-stack">
        <Field hint="Shown to you only" label="Name">
          {(control) => <Input {...control} defaultValue="Savings" />}
        </Field>
        <Field error="Pick a region" label="Region">
          {(control) => (
            <Select {...control} defaultValue="">
              <option value="">Choose…</option>
              <option value="dk">Denmark</option>
            </Select>
          )}
        </Field>
        <Field label="Notes">{(control) => <Textarea {...control} />}</Field>
      </div>
    ),
  },
  {
    name: "Label",
    group: "Forms",
    description: "Standalone label for controls outside Field.",
    exports: ["Label"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Label htmlFor="cp-label">Standalone label</Label>
        <Input id="cp-label" />
      </div>
    ),
  },
  {
    name: "InputGroup",
    group: "Forms",
    description: "Display-only prefix/suffix around an input (currency, percent).",
    exports: ["InputGroup", "InputGroupAddon"],
    client: false,
    Demo: () => (
      <InputGroup>
        <Input aria-label="Amount" inputMode="decimal" />
        <InputGroupAddon align="end">DKK</InputGroupAddon>
      </InputGroup>
    ),
  },
  {
    name: "Checkbox & FieldSet",
    group: "Forms",
    description: "Real checkbox with a 44px hit area; FieldSet groups related controls.",
    exports: ["Checkbox", "FieldSet"],
    client: true,
    Demo: CheckboxDemo,
  },
  {
    name: "RadioGroup",
    group: "Forms",
    description: "Native radios with a card variant for plan or product choices.",
    exports: ["RadioGroup", "Radio"],
    client: true,
    Demo: () => (
      <RadioGroup defaultValue="basic" legend="Plan">
        <Radio card hint="Free" label="Basic" value="basic" />
        <Radio card hint="Priority support" label="Plus" value="plus" />
      </RadioGroup>
    ),
  },
  {
    name: "Switch",
    group: "Forms",
    description: "Settings toggle on a checkbox. Never for actions that move money.",
    exports: ["Switch"],
    client: true,
    Demo: () => <Switch defaultChecked label="Weekly summary" />,
  },
  {
    name: "Slider",
    group: "Forms",
    description: "Native range input; pass a pre-formatted valueText.",
    exports: ["Slider"],
    client: false,
    Demo: () => <Slider aria-label="Risk" defaultValue={3} max={7} min={1} valueText="Moderate" />,
  },
  {
    name: "InputOTP",
    group: "Forms",
    description: "One real numeric input drawn as slots; autofill and paste work.",
    exports: ["InputOTP"],
    client: true,
    Demo: () => <InputOTP aria-label="Verification code" length={6} />,
  },
  {
    name: "Combobox",
    group: "Forms",
    description: "Searchable single select (ARIA 1.2 combobox).",
    exports: ["Combobox"],
    client: true,
    Demo: () => <Combobox aria-label="Country" options={options} placeholder="Search country" />,
  },
  {
    name: "SelectMenu",
    group: "Forms",
    description: "Custom select. Prefer the native Select, the best mobile picker.",
    exports: ["SelectMenu"],
    client: true,
    Demo: () => <SelectMenu aria-label="Region" options={options} />,
  },
  {
    name: "Calendar",
    group: "Forms",
    description: "Month grid with full keyboard support. Takes and returns Date.",
    exports: ["Calendar"],
    client: true,
    Demo: () => <Calendar locale="en" />,
  },
  {
    name: "DatePicker",
    group: "Forms",
    description: "Typed ISO entry plus a calendar popover.",
    exports: ["DatePicker"],
    client: true,
    Demo: () => <DatePicker aria-label="Settlement date" locale="en" />,
  },
  {
    name: "Notice & EmptyState",
    group: "Feedback & status",
    description: "Inline messages (danger is role=alert) and empty placeholders.",
    exports: ["Notice", "EmptyState"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Notice tone="warn">Check your details before continuing.</Notice>
        <EmptyState description="Create one to get started." title="No saved views" />
      </div>
    ),
  },
  {
    name: "Meter, SegmentedMeter, DistributionList",
    group: "Feedback & status",
    description: "Bounded values (role=meter). Not for task progress.",
    exports: ["Meter", "SegmentedMeter", "DistributionList"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Meter label="Profile completeness" value={72} valueText="72 of 100" />
        <SegmentedMeter label="Risk level" value={3} valueText="3 of 7" />
        <DistributionList
          formatValue={(v) => `${v} %`}
          items={[
            { label: "Category A", value: 60 },
            { label: "Category B", value: 40 },
          ]}
        />
      </div>
    ),
  },
  {
    name: "Progress",
    group: "Feedback & status",
    description: "Task progress (role=progressbar), determinate or indeterminate.",
    exports: ["Progress"],
    client: false,
    Demo: () => (
      <div className="cp-stack">
        <Progress aria-label="Upload" value={40} valueText="40 percent" />
        <Progress aria-label="Working" />
      </div>
    ),
  },
  {
    name: "Spinner",
    group: "Feedback & status",
    description: "role=status with a visually hidden label.",
    exports: ["Spinner"],
    client: false,
    Demo: () => <Spinner label="Loading holdings" />,
  },
  {
    name: "Skeleton",
    group: "Feedback & status",
    description: "Decorative loading placeholders; the group announces loading.",
    exports: ["Skeleton", "SkeletonText", "SkeletonGroup"],
    client: false,
    Demo: () => (
      <SkeletonGroup>
        <Skeleton height={16} shape="rect" width="40%" />
        <SkeletonText lines={2} />
      </SkeletonGroup>
    ),
  },
  {
    name: "Toast",
    group: "Feedback & status",
    description: "Controlled transient message with optional undo; pauses on hover and focus.",
    exports: ["Toast", "ToastRegion"],
    client: true,
    Demo: ToastDemo,
  },
  {
    name: "Breadcrumb",
    group: "Navigation & disclosure",
    description: "Landmark with aria-current on the page.",
    exports: ["Breadcrumb", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage"],
    client: false,
    Demo: () => (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#breadcrumb">Portfolio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Holdings</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  {
    name: "Pagination",
    group: "Navigation & disclosure",
    description: "Presentational links; page state stays in the app.",
    exports: [
      "Pagination",
      "PaginationContent",
      "PaginationItem",
      "PaginationLink",
      "PaginationPrevious",
      "PaginationNext",
      "PaginationEllipsis",
    ],
    client: false,
    Demo: () => (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#pagination" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink active href="#pagination">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagination">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#pagination" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  {
    name: "Tabs",
    group: "Navigation & disclosure",
    description: "Controlled or uncontrolled, arrow-key navigation, roving tabindex.",
    exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
    client: true,
    Demo: () => (
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">Overview</TabsTrigger>
          <TabsTrigger value="b">Costs</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Overview panel</TabsContent>
        <TabsContent value="b">Costs panel</TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Accordion",
    group: "Navigation & disclosure",
    description: "Group of native <details>: works without JavaScript. Single mode is exclusive.",
    exports: ["Accordion", "AccordionItem"],
    client: true,
    Demo: () => (
      <Accordion type="single">
        <AccordionItem title="What is the fee?">Shown in full on the cost page.</AccordionItem>
        <AccordionItem title="How is risk rated?">A scale from one to seven.</AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Collapsible",
    group: "Navigation & disclosure",
    description: "A single native <details>; server-compatible and works without JavaScript.",
    exports: ["Collapsible"],
    client: false,
    Demo: () => <Collapsible title="Standalone collapsible">Content</Collapsible>,
  },
  {
    name: "Menu",
    group: "Navigation & disclosure",
    description: "Original items-array action menu. DropdownMenu is the compound alternative.",
    exports: ["Menu"],
    client: true,
    Demo: () => (
      <Menu
        ariaLabel="Row actions"
        items={[
          { label: "Rename", onSelect: () => undefined },
          { label: "Delete", tone: "danger", onSelect: () => undefined },
        ]}
      />
    ),
  },
  {
    name: "Dialog, Sheet, AlertDialog",
    group: "Overlays & anchored",
    description: "Modals on native <dialog>: focus returns, background inert, Escape closes.",
    exports: ["Dialog", "Sheet", "AlertDialog"],
    client: true,
    Demo: DialogDemo,
  },
  {
    name: "Popover",
    group: "Overlays & anchored",
    description: "Non-modal floating panel in the top layer; flips at viewport edges.",
    exports: ["Popover", "PopoverTrigger", "PopoverContent"],
    client: true,
    Demo: () => (
      <Popover>
        <PopoverTrigger>Filters</PopoverTrigger>
        <PopoverContent aria-label="Filters">Filter options</PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Tooltip",
    group: "Overlays & anchored",
    description: "Opens on hover and focus. Supplementary only; never required information.",
    exports: ["Tooltip"],
    client: true,
    Demo: () => (
      <Tooltip content="Supplementary hint">
        <Button variant="ghost">Hover or focus me</Button>
      </Tooltip>
    ),
  },
  {
    name: "HoverCard",
    group: "Overlays & anchored",
    description: "Preview card for a link. Hover does not exist on touch: link must stand alone.",
    exports: ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
    client: true,
    Demo: () => (
      <HoverCard>
        <HoverCardTrigger href="#hover-card">Fund A</HoverCardTrigger>
        <HoverCardContent>Preview of Fund A</HoverCardContent>
      </HoverCard>
    ),
  },
  {
    name: "DropdownMenu",
    group: "Overlays & anchored",
    description: "Roving focus, typeahead, checkbox items, Escape returns focus.",
    exports: [
      "DropdownMenu",
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuCheckboxItem",
      "DropdownMenuLabel",
      "DropdownMenuSeparator",
    ],
    client: true,
    Demo: ControlledMenu,
  },
  {
    name: "ContextMenu",
    group: "Overlays & anchored",
    description: "Right-click or Shift+F10. Always offer the same actions in a visible control.",
    exports: [
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
      "ContextMenuCheckboxItem",
      "ContextMenuLabel",
      "ContextMenuSeparator",
    ],
    client: true,
    Demo: () => (
      <ContextMenu>
        <ContextMenuTrigger
          style={{ padding: "1rem", border: "1px dashed var(--fds-line)" }}
          tabIndex={0}
        >
          Right-click this area (or focus it and press Shift+F10)
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="Area actions">
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  {
    name: "cn",
    group: "Actions & content",
    description: "Tiny class-name joiner used by every component.",
    exports: ["cn"],
    client: false,
    Demo: () => <code>cn("a", false, "b") → "a b"</code>,
  },
];
