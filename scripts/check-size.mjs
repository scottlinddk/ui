import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { build } from "vite-plus/pack";

await build({
  config: false,
  entry: ["smoke/badge-entry.ts"],
  outDir: "artifacts/size",
  dts: false,
  platform: "neutral",
  format: ["esm"],
  minify: true,
  sourcemap: false,
  deps: { neverBundle: ["react", "react/jsx-runtime"] },
  inputOptions: {
    onLog(level, log, defaultHandler) {
      // Client boundaries are checked separately; this fixture deliberately simulates a client bundler.
      if (log.code !== "MODULE_LEVEL_DIRECTIVE") defaultHandler(level, log);
    },
  },
});
const code = readFileSync("artifacts/size/badge-entry.js", "utf8");
assert(
  !/useState|useEffect|fds-menu|fds-field|fds-button/.test(code),
  "Badge-only consumers must not include interactive modules",
);
const bytes = gzipSync(code).length;
assert(bytes <= 600, `Badge-only bundle is ${bytes} bytes gzip (budget 600, React external)`);
console.log(`Badge-only import: ${bytes} bytes gzip; budget 600, React external.`);

// Tree-shaking across the whole barrel: importing one named export from the root entry must not
// pull in any other component's code. Each component is bundled alone and its output must not
// contain the unique class prefix of any other component.
import { mkdirSync, writeFileSync } from "node:fs";
import { componentNames } from "./components.mjs";

const prefix = (name) => `fds-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
const sample = [
  "Separator",
  "Spinner",
  "Kbd",
  "Tabs",
  "Checkbox",
  "Avatar",
  "Tooltip",
  "Calendar",
  "Combobox",
];
mkdirSync("artifacts/treeshake", { recursive: true });
for (const name of sample) {
  writeFileSync(
    `artifacts/treeshake/${name}.ts`,
    `export { ${name} } from "../../dist/index.mjs";\n`,
  );
  await build({
    config: false,
    entry: [`artifacts/treeshake/${name}.ts`],
    outDir: `artifacts/treeshake/out-${name}`,
    dts: false,
    platform: "neutral",
    format: ["esm"],
    minify: false,
    sourcemap: false,
    deps: { neverBundle: ["react", "react/jsx-runtime"] },
    inputOptions: {
      onLog(level, log, handler) {
        if (log.code !== "MODULE_LEVEL_DIRECTIVE") handler(level, log);
      },
    },
  });
  const out = readFileSync(`artifacts/treeshake/out-${name}/${name}.js`, "utf8");
  for (const other of componentNames) {
    if (other === name) continue;
    // Skip names whose class prefix is a prefix/substring of the sampled component's own classes.
    if (prefix(name).includes(prefix(other)) || prefix(other).includes(prefix(name))) continue;
    assert(!out.includes(`"${prefix(other)}`), `${name}-only bundle contains ${other}`);
  }
}
console.log(`Tree-shaking verified for ${sample.join(", ")}.`);
