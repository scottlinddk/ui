---
"@scttlnd/ui": minor
---

Add the anchored components, still with no new dependencies: `Popover`, `Tooltip`, `HoverCard`, `DropdownMenu` (items, checkbox items, label, separator), `ContextMenu`, `Combobox`, `SelectMenu`, `Calendar` and `DatePicker`. Floating surfaces use the native Popover API (top layer, so no portals, z-index or theme-scoping problems) with a small built-in placement helper that flips and stays inside the viewport. `Calendar` takes and returns `Date`, week starts Monday, `locale` and disabled days come from the app; `DatePicker` always allows typed entry and exchanges ISO `YYYY-MM-DD` strings (pass `formatValue`/`parseValue` for a local display format). The existing `Menu` and native `Select` are unchanged. CSS is one more file inside `@layer fds`.
