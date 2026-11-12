import { describe, expect, it } from "vitest";

import { ApiProblemError, isProblemDetails, toApiProblemError } from "./problem-details";

describe("problem details", () => {
  it("recognizes an RFC 9457 payload", () => {
    const value = {
      type: "https://rumahkodingku.com/problems/validation-error",
      title: "Validation Error",
      status: 400,
      detail: "Invalid input.",
      code: "VALIDATION_ERROR",
      requestId: "req_1",
    };

    expect(isProblemDetails(value)).toBe(true);
  });

  it("rejects a non-problem payload", () => {
    expect(isProblemDetails({ message: "nope" })).toBe(false);
  });

  it("wraps a problem in ApiProblemError", () => {
    const error = toApiProblemError({
      type: "https://rumahkodingku.com/problems/conflict",
      title: "Conflict",
      status: 409,
      detail: "Already exists.",
    });

    expect(error).toBeInstanceOf(ApiProblemError);
    expect(error.status).toBe(409);
    expect(error.problem.code).toBeUndefined();
  });

  it("creates a safe fallback for an unknown error", () => {
    const error = toApiProblemError(new Error("secret"), 502);

    expect(error.status).toBe(502);
    expect(error.message).toBe("The API request failed.");
  });
});
