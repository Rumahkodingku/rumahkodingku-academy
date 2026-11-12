import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  StreamableFile,
  type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { map, type Observable } from "rxjs";

import { IS_SKIP_ENVELOPE, toEnvelope } from "./api-response";

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const skipEnvelope = this.reflector.getAllAndOverride<boolean>(IS_SKIP_ENVELOPE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipEnvelope) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((value) => {
        if (value instanceof StreamableFile) {
          return value;
        }

        return toEnvelope(value, request.requestId);
      }),
    );
  }
}
