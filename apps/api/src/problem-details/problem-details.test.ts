import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { ApiError } from "../utils/api-response";
import { ProblemDetailsError, toProblemDetails } from "./problem-details";

describe("toProblemDetails", () => {
  it("maps ApiError to RFC 9457", () => {
    const problem = toProblemDetails(
      new ApiError(409, "COURSE_EXISTS", "Course already exists", { field: "slug" }),
      { url: "/api/v1/courses" },
      "req_1",
    );

    expect(problem).toMatchObject({
      type: "https://rumahkodingku.com/problems/course-exists",
      title: "Conflict",
      status: 409,
      detail: "Course already exists",
      code: "COURSE_EXISTS",
      requestId: "req_1",
      instance: "/api/v1/courses",
      errors: { field: "slug" },
    });
  });

  it("maps validation errors to the errors extension", () => {
    const problem = toProblemDetails(
      new BadRequestException({
        message: ["email must be an email", "password is too short"],
      }),
      { url: "/api/v1/auth/register" },
      "req_2",
    );

    expect(problem.status).toBe(400);
    expect(problem.code).toBe("VALIDATION_ERROR");
    expect(problem.errors).toEqual(["email must be an email", "password is too short"]);
  });

  it("preserves an explicit problem", () => {
    const problem = toProblemDetails(
      new ProblemDetailsError({
        type: "https://rumahkodingku.com/problems/custom",
        title: "Custom",
        status: 422,
        code: "CUSTOM",
      }),
      { url: "/api/v1/custom" },
      "req_3",
    );

    expect(problem.type).toBe("https://rumahkodingku.com/problems/custom");
    expect(problem.instance).toBe("/api/v1/custom");
    expect(problem.requestId).toBe("req_3");
  });

  it("hides unknown errors", () => {
    const problem = toProblemDetails(new Error("secret"), undefined, "req_4");

    expect(problem).toMatchObject({
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      detail: "Internal server error",
      requestId: "req_4",
    });
    expect(problem.detail).not.toContain("secret");
  });
});
