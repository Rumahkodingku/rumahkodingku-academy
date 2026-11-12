import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Injectable,
  type NestInterceptor,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { catchError, finalize, tap, throwError, type Observable } from "rxjs";

import { MetricsService } from "./metrics.service";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const route = `${context.getClass().name}.${context.getHandler().name}`;
    const stopTimer = this.metrics.httpRequestDuration.startTimer({
      method: request.method,
      route,
    });
    let status = 500;

    return next.handle().pipe(
      tap(() => {
        status = response.statusCode;
      }),
      catchError((error: unknown) => {
        status = error instanceof HttpException ? error.getStatus() : 500;
        return throwError(() => error);
      }),
      finalize(() => {
        const statusCode = String(status);
        stopTimer({ status_code: statusCode });
        this.metrics.httpRequestsTotal.inc({
          method: request.method,
          route,
          status_code: statusCode,
        });
      }),
    );
  }
}
