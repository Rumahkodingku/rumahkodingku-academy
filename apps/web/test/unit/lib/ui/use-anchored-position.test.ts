import { describe, expect, it } from "vitest";

import { computeAnchoredPosition } from "../../../../src/lib/ui/use-anchored-position";

const trigger = {
  top: 900,
  bottom: 940,
  left: 100,
  right: 200,
  width: 100,
  height: 40,
};

describe("computeAnchoredPosition", () => {
  it("flips above when below lacks space", () => {
    expect(
      computeAnchoredPosition({
        triggerRect: trigger,
        contentRect: { width: 200, height: 300 },
        viewport: { width: 1024, height: 900 },
        side: "bottom",
        align: "start",
        offset: 8,
      }),
    ).toEqual({ top: 592, left: 100, placement: "top" });
  });

  it("clamps horizontally to the viewport", () => {
    expect(
      computeAnchoredPosition({
        triggerRect: { ...trigger, left: 950, right: 1050 },
        contentRect: { width: 200, height: 200 },
        viewport: { width: 1024, height: 900 },
        side: "bottom",
        align: "start",
        offset: 8,
      }).left,
    ).toBe(816);
  });

  it("centers and ends against the trigger", () => {
    const contentRect = { width: 200, height: 200 };
    const viewport = { width: 1024, height: 900 };

    expect(
      computeAnchoredPosition({
        triggerRect: trigger,
        contentRect,
        viewport,
        side: "bottom",
        align: "center",
        offset: 8,
      }).left,
    ).toBe(50);

    expect(
      computeAnchoredPosition({
        triggerRect: trigger,
        contentRect,
        viewport,
        side: "bottom",
        align: "end",
        offset: 8,
      }).left,
    ).toBe(8);
  });
});
