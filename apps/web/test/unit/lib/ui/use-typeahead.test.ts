import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useTypeahead } from "../../../../src/lib/ui/use-typeahead";

const items = ["Apple", "Apricot", "Banana", "Blueberry"];

describe("useTypeahead", () => {
  it("matches a single character", () => {
    const { result } = renderHook(() => useTypeahead({ items, getLabel: (item) => item }));

    expect(result.current("b", -1)).toBe(2);
  });

  it("cycles repeated characters", () => {
    const { result } = renderHook(() => useTypeahead({ items, getLabel: (item) => item }));

    act(() => {
      expect(result.current("b", -1)).toBe(2);
      expect(result.current("b", 2)).toBe(3);
      expect(result.current("b", 3)).toBe(2);
    });
  });

  it("matches a full prefix", () => {
    const { result } = renderHook(() => useTypeahead({ items, getLabel: (item) => item }));

    act(() => {
      expect(result.current("a", -1)).toBe(0);
      expect(result.current("p", 0)).toBe(0);
      expect(result.current("r", 0)).toBe(1);
    });
  });

  it("returns null when nothing matches", () => {
    const { result } = renderHook(() => useTypeahead({ items, getLabel: (item) => item }));

    expect(result.current("z", -1)).toBeNull();
  });
});
