import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(
    () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
  );
});

const inViewport = async (page: import("@playwright/test").Page, selector: string) => {
  const box = await page.locator(selector).boundingBox();
  const size = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(size.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(size.height);
};

test("popover renders in the top layer, inside the viewport, and closes on Escape", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Filters" });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Filters" });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.matches(":popover-open"))).toBe(true);
  await inViewport(page, '[role="dialog"][aria-label="Filters"]');
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("dropdown menu is keyboard operable and stays inside the viewport", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Actions", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Actions" });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused();
  await inViewport(page, '[role="menu"]');
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("combobox and select menu list in the top layer", async ({ page }) => {
  const input = page.getByRole("combobox", { name: "Country" });
  await input.scrollIntoViewIfNeeded();
  await input.fill("sw");
  const list = page.getByRole("listbox");
  await expect(list.getByRole("option")).toHaveText(["Sweden"]);
  expect(await list.evaluate((el) => el.matches(":popover-open"))).toBe(true);
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Sweden");
});

test("calendar keyboard navigation moves focus between days", async ({ page }) => {
  const day = page.locator(".fds-calendar__day[tabindex='0']").last();
  await day.scrollIntoViewIfNeeded();
  await day.focus();
  const before = await day.getAttribute("data-date");
  await page.keyboard.press("ArrowRight");
  const after = await page.evaluate(() => document.activeElement?.getAttribute("data-date"));
  expect(after).not.toBe(before);
});

test("new primitives have no axe violations", async ({ page }) => {
  const axe = require("axe-core") as { source: string };
  await page.evaluate(axe.source);
  const result = await page.evaluate(async () => {
    const run = (
      window as unknown as {
        axe: { run: (c: Element, o: object) => Promise<{ violations: unknown[] }> };
      }
    ).axe;
    const out = [];
    for (const id of ["more-static", "more-controls", "more-overlays"]) {
      const r = await run.run(document.querySelector(`[data-testid="${id}"]`)!, {});
      out.push(...r.violations);
    }
    return out;
  });
  expect(result).toEqual([]);
});
