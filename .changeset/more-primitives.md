---
"@scttlnd/ui": minor
---

Add 26 components following the shadcn/ui set and API shape, with no new dependencies: `Separator`, `Spinner`, `Kbd`/`KbdGroup`, `Label`, `ButtonGroup`, `InputGroup`/`InputGroupAddon`, `Item*`, `Breadcrumb*`, `Pagination*`, `Progress`, `ScrollArea`, `Collapsible`, `Accordion`/`AccordionItem`, `Avatar`/`AvatarGroup`, `Checkbox`, `FieldSet`, `RadioGroup`/`Radio`, `Switch`, `Toggle`/`ToggleGroup`, `Slider`, `InputOTP` and `Tabs*`. Interactive ones carry `"use client"`; the rest stay server-compatible. Every component is its own build entry (derived from `src/components`), and `npm run test:package` now fails if a component pulls in another or has top-level side effects. New CSS is in three additional files inside `@layer fds`, using existing `--fds-*` tokens only.
