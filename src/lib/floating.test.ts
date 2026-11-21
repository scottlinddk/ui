import { describe, expect, it } from "vitest";
import { addMonths, parseISODate, toISODate } from "./date.js";
import { computePosition } from "./floating.js";

const viewport = { width: 400, height: 300 };
const size = { width: 100, height: 50 };

describe("computePosition", () => {
  it("places below and left-aligned when there is room", () => {
    const pos = computePosition(
      { x: 20, y: 20, width: 60, height: 30 },
      size,
      "bottom",
      "start",
      4,
      viewport,
    );
    expect(pos).toEqual({ x: 20, y: 54, side: "bottom" });
  });
  it("flips to the opposite side when the preferred side does not fit", () => {
    const pos = computePosition(
      { x: 20, y: 250, width: 60, height: 30 },
      size,
      "bottom",
      "start",
      4,
      viewport,
    );
    expect(pos.side).toBe("top");
    expect(pos.y).toBe(196);
  });
  it("keeps the box inside the viewport", () => {
    const pos = computePosition(
      { x: 380, y: 20, width: 20, height: 20 },
      size,
      "bottom",
      "start",
      4,
      viewport,
    );
    expect(pos.x).toBe(292);
  });
  it("centres on the cross axis", () => {
    const pos = computePosition(
      { x: 100, y: 100, width: 60, height: 30 },
      size,
      "top",
      "center",
      0,
      viewport,
    );
    expect(pos.x).toBe(80);
  });
});

describe("date helpers", () => {
  it("parses only real ISO dates", () => {
    expect(parseISODate("2025-02-30")).toBeNull();
    expect(parseISODate("30-02-2025")).toBeNull();
    expect(toISODate(parseISODate("2024-02-29")!)).toBe("2024-02-29");
  });
  it("clamps the day when adding months", () => {
    expect(toISODate(addMonths(new Date(2025, 0, 31), 1))).toBe("2025-02-28");
  });
});
