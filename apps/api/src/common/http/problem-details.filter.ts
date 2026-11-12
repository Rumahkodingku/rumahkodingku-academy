import { randomUUID } from "node:crypto";

import { type ArgumentsHost, Catch, type ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";

import { toProblemDetails } from "./problem-details";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const requestId =
      request.requestId ?? request.headers["x-request-id"]?.toString() ?? randomUUID();
    const problem = toProblemDetails(exception, request, requestId);

    response.status(problem.status).type("application/problem+json").json(problem);
  }
}
