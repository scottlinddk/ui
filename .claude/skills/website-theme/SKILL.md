---
name: website-theme
description: Turn a website's look and feel into a new opt-in scttlnd/ui theme. Use when asked to "make a theme from <url>", "get the look and feel of this site", "create a theme like this page", or when given screenshots of a design to translate into --fds-* tokens. Covers research (homepage plus about 10 sub-pages), token mapping, gradients, WCAG contrast, registration in every theme list, tests, changeset and PR.
---

# Website to scttlnd/ui theme

Produces one new file, `styles/themes/<name>.css`, plus its registration in the showcase, tests, e2e lists, README and a changeset. Follow `AGENTS.md`: tokens are `--fds-*`, themes are opt-in, existing themes never change.

## 0. Inputs and rules

- **Theme name**: use the name the user gives. If none, ask. Lowercase for the file and attribute (`exclusive`), title case in UI labels (`Exclusive`).
- **Anonymity**: if the user says not to reference the source, the source site's name, domain, product names, logo text **and its typeface names** must not appear anywhere: code, comments, README, changeset, commit messages, PR title/body, test names. Describe the look in neutral words ("boutique retail", "restrained", "navy and gold"). Verify with the grep in step 7 before every commit.
- Never copy logos, images, icons or copy text. Only colours, radii, spacing feel, shadows and gradients.
- Never ship a proprietary font. Use a system or open stack in `--fds-font-sans`; mention in README that consumers may override it.

## 1. Research the site

Scrape the homepage and about 10 sub-pages spread across page types (listing, product/detail, about, blog/journal, contact, a form page, a second audience section). Different templates expose different colours.

With Firecrawl, `firecrawl_scrape` with `formats: ["links", "branding"]` on the homepage gives the sub-page links and a branding summary; then `formats: ["branding"]` on each sub-page, in parallel. From each result note:

- `colors` (primary, secondary, accent, background, textPrimary, link)
- `components.buttonPrimary` / `buttonSecondary` (background, text colour, **border radius**)
- `components.input` (radius, border shadow colour)
- `spacing.borderRadius`, `typography`, `personality`
- Colours embedded in the logo SVG (e.g. a cream fill on a dark header hints at the dark palette)

Branding extraction is heuristic: trust values that recur across pages, discard one-offs (a campaign colour on one page). Screenshots from the user beat scraped data, especially for gradients, imagery-driven surfaces and campaign styling.

Write down a short palette summary before coding:

| Role | Light | Source evidence |
| --- | --- | --- |
| page background | `#f4f4f4` | listing pages |
| ink / text | `#1b1916` | all pages |
| action | ink, square corners | about, stores |
| brand 1 / brand 2 | gold / navy | homepage, header |

## 2. Map to tokens

Copy the newest theme in `styles/themes/` as the template (it has the current required token set). Every theme defines, in a light block and a dark block:

```
:root, [data-fds-theme="<name>"] { color-scheme: light; ... }
:root:where([data-fds-mode="dark"]), [data-fds-theme="<name>"][data-fds-mode="dark"] { color-scheme: dark; ... }
```

The test splits the file on the exact string `:root:where([data-fds-mode="dark"])`; keep it.

Required tokens (light, overridden in dark where they differ):

- `--fds-panel-background-image: none; --fds-panel-grain-content: none;` (light block; turns off Studio's decorative panel fields)
- Surfaces: `background`, `panel`, `panel-raised`, `panel-soft`, `line`, `line-soft`
- Text: `foreground`, `muted`, `muted-strong`
- Actions: `accent`, `accent-strong`, `on-accent`, `focus-ring`
- Status: `success`, `warn`, `danger`, `on-danger`, `on-success`
- Data: `chart-1`..`chart-6`, `chart-grid`
- Shape and depth: `radius-sm/md/lg`, `font-sans`, `shadow-card`, `shadow-popover`, `shadow-dialog`, `overlay`
- Brand: `brand-*` decorative fields, plus `brand-ink` (text on light fields), `brand-foreground` and `brand-muted` (text on deep fields)

Mapping guidance:

- If the site's primary button is ink/black, `accent` is the ink and `on-accent` white. A brand colour that fails 4.5:1 for text (gold, pastel) becomes a `brand-*` field, not `accent`.
- `focus-ring` must reach 3:1 on every surface: usually the darkest brand colour in light mode and a light brand colour in dark mode.
- Status and chart colours: sites rarely define them. Pick AA-safe values in the brand's temperature and say in README they are additions.
- **Dark mode**: if the site has none, derive it from the darkest brand colour (header, footer, logo background) with the light text/cream as foreground. Say in README it is derived.
- Component shape rules go after the token blocks, scoped `:is(:root, [data-fds-theme="<name>"]) .fds-button { ... }` (square buttons, pill badges, borderless panels etc.).

## 3. Gradients (when the design uses them)

- Tokens: `--fds-brand-gradient-<name>` for decorative fields; `--fds-page-background-image` for the page (consumers apply `background-image: var(--fds-page-background-image, none)` on `body`; the showcase body already does); `--fds-gradient-fill` for `.fds-meter__fill` / `.fds-progress__bar`; `--fds-surface-gradient` for tiles such as `.fds-metric`.
- **`background-image` cannot end in a bare colour.** `radial-gradient(...), #0d1220` is valid only in the `background` shorthand; in `background-image` the whole value is dropped silently. Use `linear-gradient(#0d1220, #0d1220)` as the base layer.
- Keep text-bearing surfaces (buttons, panels, body text) flat unless every stop passes contrast. A light page gradient should be subtle.
- Write every colour stop as a 6-digit hex so tests can extract stops. A highlight stop too light for text (a "sky" top stop) is allowed only if documented and excluded from the text check.

## 4. Register the theme everywhere

Grep for the previous newest theme name to find every list, then add the new one next to it:

```sh
git grep -n '<previous-theme>' -- . ':!CHANGELOG.md'
```

Expected touch points:

- `package.json` `exports`: `"./themes/<name>.css": "./styles/themes/<name>.css"`
- `showcase/theme.ts`: import `?url`, add to `themes` and, if it has light and dark, to `modeThemes`
- `showcase/Showcase.tsx`: `modeThemes` array and an `<option>`
- `showcase/AllComponents.tsx`: `themeOptions`
- `e2e/showcase.spec.ts`, `e2e/dialog.spec.ts`, `e2e/all-components.spec.ts`: theme lists; `showcase.spec.ts` also expects the body `background-color` as `rgb(...)` of `--fds-background`
- `src/product-themes.test.ts`: a `specs` entry with `fields` (deep brand fields checked against `brand-foreground`/`brand-muted`), `inkFields` (light brand fields checked against `brand-ink`) and `marks` (extra graphical tokens checked at 3:1). If the theme has gradients, add stop-contrast tests like the `exclusive gradients` block.
- `README.md`: product list in the first paragraph, a section with import snippet, brand-field pairing rules, additions and font note
- `.changeset/<name>-theme.md`: `"@scttlnd/ui": minor`, consumer-facing description, "Existing themes are unchanged."

Do not import the theme from `styles/index.css`; do not edit `CHANGELOG.md` or the package version.

## 5. Verify

```sh
npm ci
npx vp check --fix && npm run check
npm test                 # contrast failures name token, surface and ratio: adjust the colour, never the threshold
npm run build && npm run test:package
npm pack --dry-run | grep <name>
```

Playwright in the cloud container: the preinstalled Chromium may not match the project's Playwright version. Use a temporary config, then delete it:

```sh
cat > pw.tmp.config.ts <<'EOF'
import base from "./playwright.config";
const lo = { executablePath: "/opt/pw-browsers/chromium" };
export default { ...base, projects: (base as any).projects.map((p: any) => ({ ...p, use: { ...p.use, launchOptions: lo } })) };
EOF
npx playwright test -c pw.tmp.config.ts -g "<name>" --trace off
rm pw.tmp.config.ts
```

Look at it: run `npx vp dev --config showcase/vite.config.ts --port 5199`, screenshot `/?theme=<name>` and `/?theme=<name>&mode=dark` and compare with the source site or the user's screenshots. If a gradient or background does not show, check computed `background-image` in the browser before changing colours (an invalid value computes to `none`).

## 6. Ship

Branch, commit, push and open a PR as ready for review, using the repo's PR template (Summary, Release, Verification). Subscribe to PR activity and fix any red CI.

## 7. Anonymity check (when requested)

Before every commit and before opening the PR:

```sh
git grep -n -i -E '<site-name>|<domain>|<typeface>' -- . ':!*.png' ':!*lock*'
git ls-files --others --exclude-standard | xargs grep -n -i -E '<site-name>|<typeface>'
```

Both must return nothing. Re-read the commit message and PR body for the same terms.

## Reference

The `exclusive` theme (`styles/themes/exclusive.css`) was made with this workflow: ink square buttons, gold and navy brand fields, navy dark mode derived from the header, and champagne/cobalt/satin/pearl gradients from user screenshots with tested stop contrast.
