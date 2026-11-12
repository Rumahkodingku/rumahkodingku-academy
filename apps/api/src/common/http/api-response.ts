import { SetMetadata, type CustomDecorator } from "@nestjs/common";

export const IS_SKIP_ENVELOPE = "skipEnvelope";

export type ApiMeta = {
  requestId?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  meta: ApiMeta;
};

/**
 * Excludes a handler or controller from the global success envelope.
 * Used by operational endpoints such as health checks.
 */
export const SkipEnvelope = (): CustomDecorator<string> => SetMetadata(IS_SKIP_ENVELOPE, true);

function isEnvelope(value: unknown): value is ApiSuccess<unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { data?: unknown; meta?: unknown };
  return (
    "data" in candidate &&
    "meta" in candidate &&
    typeof candidate.meta === "object" &&
    candidate.meta !== null
  );
}

/**
 * Normalizes a handler result into the `{ data, meta }` success envelope.
 * Existing envelopes keep their metadata and gain the request id.
 */
export function toEnvelope<T>(value: T, requestId: string): ApiSuccess<T> {
  if (isEnvelope(value)) {
    return {
      data: value.data as T,
      meta: { ...value.meta, requestId },
    };
  }

  return {
    data: (value ?? null) as T,
    meta: { requestId },
  };
}

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
}

/**
 * Throw from any handler to produce a structured HTTP error response via the
 * global Problem Details filter.
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
