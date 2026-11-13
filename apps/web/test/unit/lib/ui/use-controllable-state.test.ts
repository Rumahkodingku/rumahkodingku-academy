import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "../../../../src/lib/ui/use-controllable-state";

describe("useControllableState", () => {
  it("owns its state when uncontrolled", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: "a" }));

    act(() => result.current[1]("b"));

    expect(result.current[0]).toBe("b");
  });

  it("respects a controlled value", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: "a", onChange }),
      { initialProps: { value: "a" } },
    );

    act(() => result.current[1]("b"));

    expect(result.current[0]).toBe("a");
    expect(onChange).toHaveBeenCalledWith("b");

    rerender({ value: "b" });
    expect(result.current[0]).toBe("b");
  });

  it("supports an updater function", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));

    act(() => result.current[1]((previous) => previous + 1));

    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
