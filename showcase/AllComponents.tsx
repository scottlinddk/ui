import { useMemo, useState } from "react";
import { Badge, Button, Input, Select } from "../src/index.js";
import {
  componentEntries,
  type ComponentEntry,
  type ComponentGroup,
} from "./components-registry.js";
import { modeThemes, search } from "./theme.js";

const repository = "https://github.com/scottlinddk/ui";
export const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const groups: readonly ComponentGroup[] = [
  "Actions & content",
  "Forms",
  "Feedback & status",
  "Navigation & disclosure",
  "Overlays & anchored",
];

const themeOptions: ReadonlyArray<[string, string]> = [
  ["studio", "Studio"],
  ["classic", "Classic"],
  ["nuance", "Nuance"],
  ["caffeine", "Caffeine"],
  ["boligdata", "BoligData"],
  ["tredjekort", "Tredjekort"],
  ["orbit", "Orbit"],
  ["funder", "Funder"],
  ["investor", "Investor"],
  ["portare", "Portare (proposed light)"],
];

function Entry({ entry }: { entry: ComponentEntry }) {
  const id = slug(entry.name);
  const Demo = entry.Demo;
  const importLine = `import { ${entry.exports.join(", ")} } from "@scttlnd/ui";`;
  return (
    <article aria-labelledby={`${id}-title`} className="cp-entry" id={id}>
      <header className="cp-entry__header">
        <h3 id={`${id}-title`}>
          <a href={`#${id}`}>{entry.name}</a>
        </h3>
        <Badge tone={entry.client ? "accent" : "success"}>
          {entry.client ? "Client component" : "Server-compatible"}
        </Badge>
      </header>
      <p className="cp-entry__description">{entry.description}</p>
      <div className="cp-demo">
        <Demo />
      </div>
      <pre className="cp-code">
        <code>{importLine}</code>
      </pre>
    </article>
  );
}

export function AllComponents({
  theme = "studio",
  initialMode = "light",
}: {
  theme?: string;
  initialMode?: "light" | "dark";
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState(initialMode);
  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      componentEntries.filter(
        (entry) =>
          !needle ||
          entry.name.toLowerCase().includes(needle) ||
          entry.description.toLowerCase().includes(needle) ||
          entry.exports.some((name) => name.toLowerCase().includes(needle)),
      ),
    [needle],
  );
  const exportCount = componentEntries.reduce((sum, entry) => sum + entry.exports.length, 0);

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.dataset.fdsMode = next;
    const url = new URL(location.href);
    url.searchParams.set("mode", next);
    history.replaceState(null, "", url);
  };

  return (
    <div className="cp-shell">
      <a className="skip-link" href="#cp-main">
        Skip to content
      </a>
      <header className="cp-header">
        <a className="cp-header__back" href={`./${search()}`}>
          <span aria-hidden="true">←</span> Showcase
        </a>
        <h1>All components</h1>
        <div className="cp-header__tools">
          <label className="sr-only" htmlFor="cp-theme">
            Theme
          </label>
          <Select
            id="cp-theme"
            onChange={(event) => {
              const url = new URL(location.href);
              url.searchParams.set("theme", event.target.value);
              location.href = url.href;
            }}
            value={theme}
          >
            {themeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {modeThemes.includes(theme) ? (
            <Button
              aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              onClick={toggleMode}
              variant="ghost"
            >
              <span aria-hidden="true">{mode === "light" ? "☾" : "☀"}</span>
            </Button>
          ) : null}
          <a href={repository}>GitHub</a>
        </div>
      </header>
      <div className="cp-layout">
        <aside aria-label="Component index" className="cp-nav">
          <label className="cp-nav__search">
            <span className="sr-only">Filter components</span>
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter components…"
              type="search"
              value={query}
            />
          </label>
          <p aria-live="polite" className="cp-nav__count" role="status">
            {visible.length} of {componentEntries.length} entries
          </p>
          <nav aria-label="Components by group">
            {groups.map((group) => {
              const items = visible.filter((entry) => entry.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <p className="cp-nav__group">{group}</p>
                  <ul>
                    {items.map((entry) => (
                      <li key={entry.name}>
                        <a href={`#${slug(entry.name)}`}>{entry.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>
        <main className="cp-main" id="cp-main">
          <p className="cp-intro">
            Every public export of <code>@scttlnd/ui</code>, rendered by the real components in the
            selected theme. {exportCount} exports in {componentEntries.length} entries. Each module
            is its own entry point, so importing one never pulls in the others.
          </p>
          {visible.length === 0 ? <p>No components match “{query}”.</p> : null}
          {groups.map((group) => {
            const items = visible.filter((entry) => entry.group === group);
            if (items.length === 0) return null;
            const headingId = `group-${slug(group)}`;
            return (
              <section aria-labelledby={headingId} className="cp-group" key={group}>
                <h2 id={headingId}>{group}</h2>
                {items.map((entry) => (
                  <Entry entry={entry} key={entry.name} />
                ))}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
