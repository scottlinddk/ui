import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { clientNames, componentNames } from "../scripts/components.mjs";
import { AllComponents, slug } from "../showcase/AllComponents.js";
import { componentEntries } from "../showcase/components-registry.js";
import * as ui from "./index.js";

const documented = new Set(componentEntries.flatMap((entry) => entry.exports));

it("documents every public export on the all-components page", () => {
  const missing = Object.keys(ui).filter((name) => !documented.has(name));
  expect(missing, `add these to showcase/components-registry.tsx: ${missing.join(", ")}`).toEqual(
    [],
  );
  const stale = [...documented].filter((name) => !(name in ui));
  expect(stale, `no longer exported: ${stale.join(", ")}`).toEqual([]);
});

it("has unique entry names and each export documented once", () => {
  const names = componentEntries.map((entry) => entry.name);
  expect(new Set(names).size).toBe(names.length);
  const all = componentEntries.flatMap((entry) => entry.exports);
  expect(new Set(all).size).toBe(all.length);
});

it("labels client and server-compatible modules the way the build does", () => {
  const sources = new Map(
    componentNames.map((name) => [name, readFileSync(`src/components/${name}.tsx`, "utf8")]),
  );
  for (const entry of componentEntries) {
    for (const name of entry.exports) {
      if (name === "cn") continue;
      const owner = componentNames.find((file) =>
        new RegExp(`export (?:function|const) ${name}\\b|\\bas ${name}\\b`).test(
          sources.get(file)!,
        ),
      );
      expect(owner, `${name} must be defined in src/components`).toBeDefined();
      expect(entry.client, `${entry.name}: ${name} lives in ${owner}`).toBe(
        clientNames.has(owner!),
      );
    }
  }
});

it("renders every entry on the server with an anchor and a labelled article", () => {
  const html = renderToStaticMarkup(<AllComponents />);
  for (const entry of componentEntries) {
    expect(html).toContain(`id="${slug(entry.name)}"`);
    expect(html).toContain(`import { ${entry.exports.join(", ")} } from &quot;@scttlnd/ui&quot;;`);
  }
  expect(html).toContain("All components");
});
