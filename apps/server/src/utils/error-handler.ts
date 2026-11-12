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

/**
 * Global exception filter aligned with NestJS's lifecycle. Wire it up in
 * `src/main.ts`:
 *
 *   import { GlobalExceptionFilter } from "./utils/error-handler";
 *   app.useGlobalFilters(new GlobalExceptionFilter());
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponseLike>();

    if (exception instanceof ApiError) {
      response
        .status(exception.status)
        .json(ApiResponse.failure(exception.status, exception.message, exception.details));
      return;
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json(ApiResponse.failure(status, exception.message));
      return;
    }
    console.error("Unhandled exception:", exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.internal());
  }
}
