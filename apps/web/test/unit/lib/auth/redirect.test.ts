import { describe, expect, it } from "vitest";

import { safeNextPath } from "../../../../src/lib/auth/redirect";

describe("safeNextPath", () => {
  it("keeps a local path", () => {
    expect(safeNextPath("/learn/courses/1")).toBe("/learn/courses/1");
  });

  it("keeps query strings and hashes on local paths", () => {
    expect(safeNextPath("/learn?tab=active#top")).toBe("/learn?tab=active#top");
  });

  it("rejects an external URL", () => {
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example/path")).toBe("/");
    expect(safeNextPath("http://evil.example")).toBe("/");
  });

  it("rejects protocol-relative and encoded paths", () => {
    expect(safeNextPath("%2F%2Fevil.example")).toBe("/");
    expect(safeNextPath("/%2F%2Fevil.example")).toBe("/");
    expect(safeNextPath("javascript:alert(1)")).toBe("/");
  });

  it("rejects backslashes and control characters", () => {
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("/learn\nnext")).toBe("/");
  });

  it("uses a fallback for empty values", () => {
    expect(safeNextPath(undefined, "/learn")).toBe("/learn");
    expect(safeNextPath("", "/learn")).toBe("/learn");
  });
});
