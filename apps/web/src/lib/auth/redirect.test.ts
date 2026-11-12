import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("keeps a local path", () => {
    expect(safeNextPath("/learn/courses/1")).toBe("/learn/courses/1");
  });

  it("rejects an external URL", () => {
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example/path")).toBe("/");
  });

  it("uses a fallback for empty values", () => {
    expect(safeNextPath(undefined, "/learn")).toBe("/learn");
  });
});
