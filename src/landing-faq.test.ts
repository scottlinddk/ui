import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { faq } from "../showcase/landing-data.js";

test("FAQPage JSON-LD in index.html matches the visible FAQ", () => {
  const html = readFileSync("showcase/index.html", "utf8");
  const raw = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1];
  expect(raw).toBeDefined();
  const data = JSON.parse(raw!);
  expect(data["@type"]).toBe("FAQPage");
  expect(
    data.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => [
      q.name,
      q.acceptedAnswer.text,
    ]),
  ).toEqual(faq.map((item) => [item.question, item.answer]));
});
