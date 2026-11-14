import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useDismissableLayer } from "../../../../src/lib/ui/use-dismissable-layer";

function pointerDown(target: EventTarget) {
  target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
}

describe("useDismissableLayer", () => {
  it("dismisses on outside pointerdown", () => {
    const onDismiss = vi.fn();
    const inside = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(inside, outside);

    renderHook(() => useDismissableLayer({ open: true, onDismiss, refs: [{ current: inside }] }));

    pointerDown(outside);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    pointerDown(inside);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    inside.remove();
    outside.remove();
  });

  it("dismisses on Escape", () => {
    const onDismiss = vi.fn();
    const inside = document.createElement("div");
    document.body.append(inside);

    renderHook(() => useDismissableLayer({ open: true, onDismiss, refs: [{ current: inside }] }));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    inside.remove();
  });

  it("does nothing when closed", () => {
    const onDismiss = vi.fn();
    const outside = document.createElement("div");
    document.body.append(outside);

    renderHook(() => useDismissableLayer({ open: false, onDismiss, refs: [{ current: null }] }));

    pointerDown(outside);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onDismiss).not.toHaveBeenCalled();
    outside.remove();
  });
});
