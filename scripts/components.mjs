import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../src/components/", import.meta.url);
/** Components that take event handlers from consumers but use no hooks themselves. */
const ALWAYS_CLIENT = new Set(["Button", "Panel"]);

/** Every component module: one build entry each, so consumers import only what they use. */
export const componentNames = readdirSync(dir)
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .map((file) => file.slice(0, -4))
  .sort();

/** Modules that need a client boundary: they use React hooks/context, or are listed above. */
export const clientNames = new Set(
  componentNames.filter(
    (name) =>
      ALWAYS_CLIENT.has(name) ||
      /\b(use[A-Z]\w*|createContext)\b/.test(readFileSync(new URL(`${name}.tsx`, dir), "utf8")),
  ),
);
