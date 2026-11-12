export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  requestId?: string;
  errors?: unknown;
};

export class ApiProblemError extends Error {
  constructor(
    public readonly problem: ProblemDetails,
    public readonly status: number,
  ) {
    super(problem.detail ?? problem.title);
    this.name = "ApiProblemError";
  }
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "title" in value &&
    "status" in value
  );
}

export function toApiProblemError(value: unknown, fallbackStatus = 500): ApiProblemError {
  if (isProblemDetails(value)) {
    return new ApiProblemError(value, value.status);
  }

  return new ApiProblemError(
    {
      type: "about:blank",
      title: "Request failed",
      status: fallbackStatus,
      detail: "The API request failed.",
    },
    fallbackStatus,
  );
}
