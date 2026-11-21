import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const themes = [
  "studio",
  "classic",
  "nuance",
  "caffeine",
  "boligdata",
  "tredjekort",
  "orbit",
  "funder",
  "investor",
  "portare",
];

async function open(page: import("@playwright/test").Page, query = "") {
  await page.goto(`/components.html${query}`);
  await page.waitForFunction(
    () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
  );
}

test("lists every entry, filters, and links back to the showcase", async ({ page }) => {
  await open(page);
  await expect(page.getByRole("heading", { level: 1, name: "All components" })).toBeVisible();
  const total = await page.locator("article.cp-entry").count();
  expect(total).toBeGreaterThan(40);
  await expect(page.locator(".cp-nav__count")).toHaveText(`${total} of ${total} entries`);
  await page.getByPlaceholder("Filter components…").fill("tooltip");
  await expect(page.locator("article.cp-entry")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 3, name: "Tooltip" })).toBeVisible();
  await page.getByPlaceholder("Filter components…").fill("zzzz");
  await expect(page.getByText("No components match")).toBeVisible();
  await page.getByPlaceholder("Filter components…").fill("");
  await page.getByRole("link", { name: "Showcase" }).click();
  await expect(page).toHaveURL(/\/(index\.html)?(\?.*)?$/);
});

test("demos on the page are live", async ({ page }) => {
  await open(page);
  await page.getByRole("link", { name: "Popover", exact: true }).first().click();
  const trigger = page.locator("#popover").getByRole("button", { name: "Filters" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Filters" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Filters" })).toHaveCount(0);
});

for (const theme of themes) {
  test(`no axe violations and no horizontal overflow: ${theme}`, async ({ page }) => {
    await open(page, `?theme=${theme}`);
    const axe = require("axe-core") as { source: string };
    await page.evaluate(axe.source);
    const violations = await page.evaluate(async () => {
      const run = (
        window as unknown as {
          axe: {
            run: (
              c: Element,
              o: object,
            ) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }>;
          };
        }
      ).axe;
      const r = await run.run(document.body, {});
      return r.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
    });
    expect(violations).toEqual([]);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
