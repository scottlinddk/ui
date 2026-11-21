import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

import { clientNames, componentNames } from "./components.mjs";

for (const name of componentNames) {
  const code = readFileSync(`dist/components/${name}.mjs`, "utf8");
  assert.equal(code.startsWith('"use client";'), clientNames.has(name), `${name} client boundary`);
  assert(existsSync(`dist/components/${name}.d.mts`), `${name} declarations`);
}
// Tree-shaking: the barrel is plain re-exports, and no component module imports another
// component except through its own path (so unused components are never pulled in).
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.deepEqual(pkg.sideEffects, ["**/*.css"], "only CSS may have side effects");
for (const name of componentNames) {
  const code = readFileSync(`dist/components/${name}.mjs`, "utf8");
  for (const [, dep] of code.matchAll(/from "\.\/(\w+)\.mjs"/g))
    assert(componentNames.includes(dep), `${name} imports unknown module ${dep}`);
  assert(!/^(?:document|window)\./m.test(code), `${name} has top-level side effects`);
}
const index = readFileSync("dist/index.mjs", "utf8");
assert(!index.includes('"use client"'), "the barrel must remain usable from the server");
assert(!index.includes("useState"), "the barrel must re-export separate modules");
assert(
  !JSON.stringify(readdirSync("dist", { recursive: true })).includes("test."),
  "tests must not ship",
);
const { exports: exportsMap } = JSON.parse(readFileSync("package.json", "utf8"));
for (const target of Object.values(exportsMap))
  for (const file of typeof target === "string" ? [target] : Object.values(target))
    assert(existsSync(file), `export ${file} exists`);
console.log("Built module boundaries, declarations, exports and exclusions passed.");
