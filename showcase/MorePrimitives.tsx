import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  ButtonGroup,
  Calendar,
  Checkbox,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  Pagination,
  PaginationContent,
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
  SelectMenu,
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
  Tooltip,
} from "../src/index.js";

const countries = [
  { value: "dk", label: "Denmark" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
];

/** Every shadcn-style primitive added after the first release, on the real components. */
export function MorePrimitives() {
  const [pinned, setPinned] = useState(false);
  return (
    <>
      <Panel title="Navigation & lists" eyebrow="08 / PRIMITIVES" help="Static, server-compatible.">
        <div className="showcase__stack" data-testid="more-static">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Portfolio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Holdings</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink active href="#">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <ItemGroup>
            <Item>
              <ItemMedia>
                <AvatarGroup>
                  <Avatar fallback="SL" />
                  <Avatar fallback="NL" />
                </AvatarGroup>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Joint account</ItemTitle>
                <ItemDescription>Two owners</ItemDescription>
              </ItemContent>
              <ItemActions>
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </ItemActions>
            </Item>
          </ItemGroup>
          <Separator />
          <ButtonGroup aria-label="View">
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
          </ButtonGroup>
          <InputGroup>
            <Input aria-label="Amount" inputMode="decimal" />
            <InputGroupAddon align="end">DKK</InputGroupAddon>
          </InputGroup>
          <Progress aria-label="Upload" value={40} valueText="40 percent" />
          <Spinner label="Loading holdings" />
          <ScrollArea aria-label="Notes" style={{ maxBlockSize: "5rem" }}>
            <p>Contained, keyboard-scrollable region. Never the page.</p>
            <p>Second line.</p>
            <p>Third line.</p>
          </ScrollArea>
        </div>
      </Panel>
      <Panel title="Form controls" eyebrow="09 / CONTROLS" help="Real inputs underneath.">
        <div className="showcase__stack" data-testid="more-controls">
          <FieldSet legend="Notifications">
            <Checkbox label="Email" defaultChecked />
            <Checkbox label="SMS" />
          </FieldSet>
          <RadioGroup legend="Plan" defaultValue="basic">
            <Radio card label="Basic" value="basic" />
            <Radio card label="Plus" value="plus" />
          </RadioGroup>
          <Switch label="Weekly summary" />
          <Toggle>Pin</Toggle>
          <ToggleGroup aria-label="Period" type="single" defaultValue={["1m"]}>
            <ToggleGroupItem value="1m">1M</ToggleGroupItem>
            <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
          </ToggleGroup>
          <Slider aria-label="Risk" defaultValue={3} max={5} min={1} valueText="Moderate" />
          <InputOTP aria-label="Code" length={6} />
          <Combobox aria-label="Country" options={countries} placeholder="Search country" />
          <SelectMenu aria-label="Region" options={countries} />
          <DatePicker aria-label="Settlement date" locale="en" />
        </div>
      </Panel>
      <Panel
        title="Disclosure & overlays"
        eyebrow="10 / ANCHORED"
        help="Top layer via the native Popover API."
      >
        <div className="showcase__stack" data-testid="more-overlays">
          <Tabs defaultValue="a">
            <TabsList aria-label="Sections">
              <TabsTrigger value="a">Overview</TabsTrigger>
              <TabsTrigger value="b">Costs</TabsTrigger>
            </TabsList>
            <TabsContent value="a">Overview panel</TabsContent>
            <TabsContent value="b">Costs panel</TabsContent>
          </Tabs>
          <Accordion type="single">
            <AccordionItem title="What is the fee?">Shown in full on the cost page.</AccordionItem>
            <AccordionItem title="How is risk rated?">Scale of one to seven.</AccordionItem>
          </Accordion>
          <Popover>
            <PopoverTrigger>Filters</PopoverTrigger>
            <PopoverContent aria-label="Filters">Filter options</PopoverContent>
          </Popover>
          <Tooltip content="Supplementary hint">
            <Button variant="ghost">Hover or focus me</Button>
          </Tooltip>
          <HoverCard>
            <HoverCardTrigger href="#">Fund A</HoverCardTrigger>
            <HoverCardContent>Preview of Fund A</HoverCardContent>
          </HoverCard>
          <DropdownMenu>
            <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
            <DropdownMenuContent aria-label="Actions">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
                Pinned
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ContextMenu>
            <ContextMenuTrigger tabIndex={0}>
              Right-click this area (or Shift+F10)
            </ContextMenuTrigger>
            <ContextMenuContent aria-label="Area actions">
              <ContextMenuItem>Open</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <Calendar locale="en" />
        </div>
      </Panel>
    </>
  );
}
