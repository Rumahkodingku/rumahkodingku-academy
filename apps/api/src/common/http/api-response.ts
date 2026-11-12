export type ApiMeta = {
  requestId?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  meta: ApiMeta;
};

export type ApiFailure = {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/**
 * Standardized API envelopes. HTTP status is set by the controller or filter.
 */
export class ApiResponse {
  static ok<T>(data: T, meta: ApiMeta = {}): ApiSuccess<T> {
    return { data, meta };
  }

  static created<T>(data: T, meta: ApiMeta = {}): ApiSuccess<T> {
    return { data, meta };
  }

  static noContent(meta: ApiMeta = {}): ApiSuccess<null> {
    return { data: null, meta };
  }

  static failure(code: string, message: string, details?: unknown, requestId?: string): ApiFailure {
    return {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
        ...(requestId !== undefined ? { requestId } : {}),
      },
    };
  }
}

/**
 * Throw from any handler to produce a structured HTTP error response via the
 * global error handler.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
