import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request, Response } from "express";

import { ApiError } from "../../common/http/api-response";
import { AUTH_RATE_LIMIT_KEY, type AuthRateLimitAction } from "./auth-rate-limit.decorator";
import { AuthRateLimitService } from "./auth-rate-limit.service";

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthRateLimitService) private readonly limiter: AuthRateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.getAllAndOverride<AuthRateLimitAction>(AUTH_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!action) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    try {
      await this.limiter.consume(action, request);
      return true;
    } catch (error) {
      const retryAfter = (error as { retryAfter?: number }).retryAfter ?? 60;
      const response = context.switchToHttp().getResponse<Response>();
      response.setHeader("Retry-After", String(retryAfter));
      throw new ApiError(429, "AUTH_RATE_LIMITED", "Terlalu banyak percobaan. Coba lagi nanti.", {
        retryAfter,
      });
    }
  }
}
