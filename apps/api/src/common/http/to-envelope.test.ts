import { describe, expect, it } from "vitest";

import { ApiResponse, IS_SKIP_ENVELOPE, SkipEnvelope, toEnvelope } from "./api-response";

describe("toEnvelope", () => {
  it("wraps plain data", () => {
    expect(toEnvelope({ id: 1 }, "r1")).toEqual({
      data: { id: 1 },
      meta: { requestId: "r1" },
    });
  });

  it("merges an existing envelope", () => {
    expect(toEnvelope(ApiResponse.ok({ id: 1 }), "r1")).toEqual({
      data: { id: 1 },
      meta: { requestId: "r1" },
    });
  });

  it("keeps existing meta fields", () => {
    expect(toEnvelope({ data: [], meta: { page: 2 } }, "r1")).toEqual({
      data: [],
      meta: { requestId: "r1", page: 2 },
    });
  });

  it("wraps null", () => {
    expect(toEnvelope(null, "r1")).toEqual({ data: null, meta: { requestId: "r1" } });
  });

  it("marks a handler or controller to skip the envelope", () => {
    @SkipEnvelope()
    class SampleController {}

    expect(Reflect.getMetadata(IS_SKIP_ENVELOPE, SampleController)).toBe(true);
  });
});
