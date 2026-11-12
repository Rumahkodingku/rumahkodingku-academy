import { describe, expect, it } from "vitest";

import { ApiError, ApiResponse } from "./api-response";

describe("ApiResponse", () => {
  it("wraps success data with meta", () => {
    expect(ApiResponse.ok({ status: "ok" }, { requestId: "req_1" })).toEqual({
      data: { status: "ok" },
      meta: { requestId: "req_1" },
    });
  });

  it("wraps failure with a stable code and request id", () => {
    expect(ApiResponse.failure("VALIDATION_ERROR", "Invalid input", [], "req_2")).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: [],
        requestId: "req_2",
      },
    });
  });

  it("preserves ApiError metadata", () => {
    const error = new ApiError(409, "CONFLICT", "Already exists", { field: "email" });

    expect(error.status).toBe(409);
    expect(error.code).toBe("CONFLICT");
    expect(error.details).toEqual({ field: "email" });
  });
});
