import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Injectable,
  type NestInterceptor,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { catchError, tap, throwError, type Observable } from "rxjs";

import { ApiError } from "../http/api-response";
import { createChildLogger } from "./logger";
import { redact } from "./redact";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();
    const child = createChildLogger({ requestId: request.requestId });
    const meta = { method: request.method, url: request.originalUrl };

    return next.handle().pipe(
      tap(() => {
        child.info("request completed", {
          ...meta,
          status: response.statusCode,
          durationMs: Date.now() - startedAt,
        });
      }),
      catchError((error: unknown) => {
        child.error("request failed", {
          ...meta,
          status:
            error instanceof ApiError
              ? error.status
              : error instanceof HttpException
                ? error.getStatus()
                : 500,
          durationMs: Date.now() - startedAt,
          error: redact(
            error instanceof Error
              ? { name: error.name, message: error.message, stack: error.stack }
              : error,
          ),
        });

        return throwError(() => error);
      }),
    );
  }
}
