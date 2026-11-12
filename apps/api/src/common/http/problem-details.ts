import { HttpException, HttpStatus } from "@nestjs/common";

import { ApiError } from "./api-response";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  requestId?: string;
  errors?: unknown;
  [key: string]: unknown;
}

export class ProblemDetailsError extends Error {
  constructor(public readonly problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = "ProblemDetailsError";
  }
}

const statusTitles: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.CONFLICT]: "Conflict",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
  [HttpStatus.TOO_MANY_REQUESTS]: "Too Many Requests",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
  [HttpStatus.SERVICE_UNAVAILABLE]: "Service Unavailable",
};

function problemType(code: string): string {
  const slug = code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://rumahkodingku.com/problems/${slug || "internal-server-error"}`;
}

function problemFromCode(
  status: number,
  code: string,
  detail?: string,
  errors?: unknown,
  requestId?: string,
): ProblemDetails {
  return {
    type: problemType(code),
    title: statusTitles[status] ?? "Request Failed",
    status,
    ...(detail ? { detail } : {}),
    ...(errors !== undefined ? { errors } : {}),
    ...(requestId ? { requestId } : {}),
    code,
  };
}

export function toProblemDetails(
  exception: unknown,
  request: { url?: string; originalUrl?: string } | undefined,
  requestId: string,
): ProblemDetails {
  const instance = request?.originalUrl ?? request?.url;

  if (exception instanceof ProblemDetailsError) {
    return {
      ...exception.problem,
      instance: exception.problem.instance ?? instance,
      requestId: exception.problem.requestId ?? requestId,
    };
  }

  if (exception instanceof ApiError) {
    return {
      ...problemFromCode(
        exception.status,
        exception.code,
        exception.message,
        exception.details,
        requestId,
      ),
      instance,
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    const responseObject = typeof response === "object" && response !== null ? response : undefined;
    const message =
      typeof response === "string"
        ? response
        : responseObject && "message" in responseObject
          ? String(responseObject.message)
          : exception.message;
    const errors =
      responseObject && "message" in responseObject ? responseObject.message : undefined;

    return {
      ...problemFromCode(
        status,
        status === HttpStatus.BAD_REQUEST ? "VALIDATION_ERROR" : `HTTP_${status}`,
        message,
        Array.isArray(errors) ? errors : undefined,
        requestId,
      ),
      instance,
    };
  }

  return {
    ...problemFromCode(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR",
      "Internal server error",
      undefined,
      requestId,
    ),
    instance,
  };
}
