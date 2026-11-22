import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Combobox,
  DatePicker,
  DistributionList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Kbd,
  KbdGroup,
  Meter,
  Metric,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  Radio,
  RadioGroup,
  SegmentedMeter,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from "../src/index.js";

export type PreviewTab = "Overview" | "Activity" | "Settings";

const team = [
  { name: "Ada Lindholm", role: "Design systems", status: "Online", tone: "success" as const },
  { name: "Noor Haddad", role: "Frontend", status: "In review", tone: "warn" as const },
  { name: "Mikkel Sand", role: "Accessibility", status: "Away", tone: "neutral" as const },
];

const projects = [
  { name: "Atlas redesign", owner: "AL", progress: 82, state: "On track" },
  { name: "Docs migration", owner: "NH", progress: 54, state: "At risk" },
  { name: "Token audit", owner: "MS", progress: 100, state: "Done" },
];

const events = [
  {
    id: "statement",
    label: "Monthly statement",
    detail: "November · Ready to view",
    status: "Available",
    kind: "open",
    who: "AL",
    body: "Generated automatically on the first of every month and archived for a year.",
  },
  {
    id: "preferences",
    label: "Account preferences",
    detail: "Your changes have been saved",
    status: "Completed",
    kind: "done",
    who: "NH",
    body: "Notification and density preferences were updated from the settings tab.",
  },
  {
    id: "verification",
    label: "Profile verification",
    detail: "A few details need your attention",
    status: "Review",
    kind: "open",
    who: "MS",
    body: "Add a contact person and confirm the workspace region to finish.",
  },
  {
    id: "export",
    label: "Quarterly export",
    detail: "CSV and PDF · 3 files",
    status: "Completed",
    kind: "done",
    who: "AL",
    body: "Files are kept for 30 days. Download links are private to workspace members.",
  },
];

const regions = [
  { value: "cph", label: "Copenhagen (CET)" },
  { value: "sto", label: "Stockholm (CET)" },
  { value: "lon", label: "London (GMT)" },
  { value: "nyc", label: "New York (EST)" },
];

function OverviewPanel() {
  return (
    <div className="preview-stack">
      <div className="preview-metrics">
        <Metric label="Active projects" value="24" />
        <Metric label="Weekly change" value="+4.82 %" tone="success" />
        <Metric label="Team capacity" value="72 %" />
      </div>
      <div className="preview-grid">
        <section className="preview-card" aria-labelledby="pv-delivery">
          <header className="preview-card__head">
            <h3 id="pv-delivery">Delivery</h3>
            <Badge tone="accent">Q4</Badge>
          </header>
          <Meter label="Release readiness" value={78} valueText="78 percent" />
          <SegmentedMeter label="Milestones reached" value={7} segments={10} valueText="7 of 10" />
          <DistributionList
            aria-label="Work by status"
            items={[
              { label: "Shipped", value: 42 },
              { label: "In review", value: 18 },
              { label: "In progress", value: 27 },
              { label: "Blocked", value: 5 },
            ]}
            formatValue={(value) => `${value} items`}
          />
        </section>
        <section className="preview-card" aria-labelledby="pv-team">
          <header className="preview-card__head">
            <h3 id="pv-team">Team</h3>
            <AvatarGroup aria-label="Team members">
              <Avatar fallback="AL" size="sm" />
              <Avatar fallback="NH" size="sm" />
              <Avatar fallback="MS" size="sm" />
            </AvatarGroup>
          </header>
          <ItemGroup>
            {team.map((member) => (
              <Item key={member.name}>
                <ItemMedia>
                  <Avatar
                    fallback={member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{member.name}</ItemTitle>
                  <ItemDescription>{member.role}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge tone={member.tone}>{member.status}</Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </section>
      </div>
      <Table caption="Projects" density="compact">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>State</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell>
                <span className="preview-owner">
                  <Avatar fallback={project.owner} size="sm" /> {project.name}
                </span>
              </TableCell>
              <TableCell>
                <Progress
                  aria-label={`${project.name} progress`}
                  value={project.progress}
                  valueText={`${project.progress} percent`}
                />
              </TableCell>
              <TableCell>
                <Badge
                  tone={
                    project.state === "Done"
                      ? "success"
                      : project.state === "At risk"
                        ? "warn"
                        : "accent"
                  }
                >
                  {project.state}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ActivityPanel() {
  const [filter, setFilter] = useState<string[]>(["all"]);
  const [query, setQuery] = useState("");
  const active = filter[0] ?? "all";
  const visible = events.filter(
    (event) =>
      (active === "all" || event.kind === active) &&
      event.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="preview-stack">
      <div className="preview-toolbar-row">
        <InputGroup className="preview-search">
          <Input
            aria-label="Search activity"
            type="search"
            placeholder="Search activity"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <InputGroupAddon align="end">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
        <ToggleGroup
          aria-label="Filter activity"
          type="single"
          value={filter}
          onValueChange={(next) => setFilter(next.length ? next : ["all"])}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="done">Done</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {visible.length ? (
        <ItemGroup>
          {visible.map((event) => (
            <Item key={event.id} variant="outline">
              <ItemMedia>
                <Avatar fallback={event.who} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{event.label}</ItemTitle>
                <ItemDescription>{event.detail}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge tone={event.status === "Review" ? "warn" : "success"}>{event.status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label={`Actions for ${event.label}`}>
                    ⋯
                  </DropdownMenuTrigger>
                  <DropdownMenuContent aria-label={`${event.label} actions`}>
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem tone="danger">Dismiss</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <p className="preview-empty" role="status">
          Nothing matches “{query}”.
        </p>
      )}
      <Accordion type="single">
        <AccordionItem title="About these events">
          Events are generated from workspace activity. Filters and search run entirely in the
          browser.
        </AccordionItem>
      </Accordion>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#preview-panel" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink active href="#preview-panel">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#preview-panel">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#preview-panel" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SettingsPanel() {
  const [saved, setSaved] = useState(false);
  const markDirty = () => setSaved(false);
  return (
    <form
      className="preview-settings"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Field label="Workspace name">
        {(control) => <Input {...control} defaultValue="Personal workspace" onChange={markDirty} />}
      </Field>
      <div className="preview-field">
        <span className="preview-field__label" id="pv-region">
          Region
        </span>
        <Combobox
          aria-labelledby="pv-region"
          options={regions}
          defaultValue="cph"
          onValueChange={markDirty}
        />
      </div>
      <div className="preview-field">
        <label className="preview-field__label" htmlFor="pv-review">
          Next review
        </label>
        <DatePicker
          id="pv-review"
          locale="en"
          defaultValue="2026-12-01"
          placeholder="YYYY-MM-DD"
          onValueChange={markDirty}
        />
      </div>
      <div className="preview-field">
        <span className="preview-field__label" id="pv-capacity">
          Capacity target
        </span>
        <Slider
          aria-labelledby="pv-capacity"
          defaultValue={70}
          min={0}
          max={100}
          step={5}
          valueText="70 percent"
          onChange={markDirty}
        />
      </div>
      <RadioGroup legend="Density" defaultValue="comfortable" onValueChange={markDirty}>
        <Radio card label="Comfortable" hint="More space" value="comfortable" />
        <Radio card label="Compact" hint="More data" value="compact" />
      </RadioGroup>
      <FieldSet legend="Notify me about">
        <Checkbox label="Mentions" defaultChecked onChange={markDirty} />
        <Checkbox label="Weekly summary" hint="Sent on Mondays" onChange={markDirty} />
        <Switch label="Pause all notifications" onChange={markDirty} />
      </FieldSet>
      <div className="preview-settings__actions">
        <ButtonGroup aria-label="Save options">
          <Button type="submit">Save preferences</Button>
          <Tooltip content="Restores the defaults shown here">
            <Button type="reset" variant="secondary" onClick={markDirty}>
              Reset
            </Button>
          </Tooltip>
        </ButtonGroup>
        <span className="save-status" role="status">
          {saved ? "Preferences saved." : ""}
        </span>
      </div>
    </form>
  );
}

/** Composed, interactive app surface built only from the package's own primitives. */
export function PreviewWorkspace({ tab }: { tab: PreviewTab }) {
  if (tab === "Overview") return <OverviewPanel />;
  if (tab === "Activity") return <ActivityPanel />;
  return <SettingsPanel />;
}
