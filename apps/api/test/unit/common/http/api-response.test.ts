import { describe, expect, it } from "vitest";

import { ApiError, ApiResponse } from "../../../../src/common/http/api-response";

describe("ApiResponse", () => {
  it("wraps success data with meta", () => {
    expect(ApiResponse.ok({ status: "ok" }, { requestId: "req_1" })).toEqual({
      data: { status: "ok" },
      meta: { requestId: "req_1" },
    });
  });

  it("preserves ApiError metadata", () => {
    const error = new ApiError(409, "CONFLICT", "Already exists", { field: "email" });

    expect(error.status).toBe(409);
    expect(error.code).toBe("CONFLICT");
    expect(error.details).toEqual({ field: "email" });
  });
});
