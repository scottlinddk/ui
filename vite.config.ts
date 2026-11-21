import { defineConfig } from "vite-plus";
import { clientNames, componentNames } from "./scripts/components.mjs";

export default defineConfig({
  fmt: {
    // Docs are edited by hand (including in the GitHub web editor); don't let
    // Markdown whitespace fail `vp check` and block the release pipeline.
    ignorePatterns: ["**/*.md"],
  },
  test: { exclude: ["**/node_modules/**", "**/dist/**", "e2e/**", "smoke/**"] },
  pack: {
    entry: ["src/index.ts", ...componentNames.map((name) => `src/components/${name}.tsx`)],
    unbundle: true,
    outExtensions: () => ({ js: ".mjs", dts: ".d.mts" }),
    platform: "neutral",
    outputOptions: {
      banner: (chunk) =>
        clientNames.has(chunk.fileName.replace(/^(?:.*\/)?components\//, "").replace(/\.mjs$/, ""))
          ? '"use client";'
          : "",
    },
    dts: true,
    format: ["esm"],
    sourcemap: true,
  },
});
