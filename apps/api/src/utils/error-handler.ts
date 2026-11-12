import { randomUUID } from "node:crypto";

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { ApiError, ApiResponse } from "./api-response";

type HttpResponseLike = {
  status(code: number): { json(body: unknown): unknown };
};

type HttpRequestLike = {
  headers?: Record<string, string | string[] | undefined>;
  requestId?: string;
};

function requestIdFrom(request?: HttpRequestLike): string {
  const header = request?.headers?.["x-request-id"];
  const fromHeader = Array.isArray(header) ? header[0] : header;
  return request?.requestId ?? fromHeader ?? randomUUID();
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<HttpResponseLike>();
    const request = context.getRequest<HttpRequestLike>();
    const requestId = requestIdFrom(request);

    if (exception instanceof ApiError) {
      response
        .status(exception.status)
        .json(ApiResponse.failure(exception.code, exception.message, exception.details, requestId));
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const details =
        typeof exceptionResponse === "object" && exceptionResponse !== null
          ? exceptionResponse
          : undefined;
      const message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : typeof exceptionResponse === "object" &&
              exceptionResponse !== null &&
              "message" in exceptionResponse
            ? String(exceptionResponse.message)
            : exception.message;

      response
        .status(status)
        .json(
          ApiResponse.failure(
            status === HttpStatus.BAD_REQUEST ? "VALIDATION_ERROR" : `HTTP_${status}`,
            message,
            details,
            requestId,
          ),
        );
      return;
    }

    console.error("Unhandled exception:", { requestId, exception });
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.failure("INTERNAL_SERVER_ERROR", "Internal server error", undefined, requestId),
      );
  }
}
