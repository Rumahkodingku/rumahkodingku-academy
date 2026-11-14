import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useLockScroll } from "../../../../src/lib/ui/use-lock-scroll";

describe("useLockScroll", () => {
  it("locks and restores body overflow", () => {
    document.body.style.overflow = "scroll";

    const { rerender, unmount } = renderHook(({ locked }) => useLockScroll(locked), {
      initialProps: { locked: true },
    });

    expect(document.body.style.overflow).toBe("hidden");

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe("scroll");

    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
