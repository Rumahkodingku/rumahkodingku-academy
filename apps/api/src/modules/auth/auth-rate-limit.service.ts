import { Inject, Injectable } from "@nestjs/common";
import { env } from "@rumahkodingku-academy/env/server";
import type { Request } from "express";

import { RedisService } from "../../infrastructure/redis/redis.service";
import { hashToken } from "./auth.constants";
import { normalizeEmail } from "@rumahkodingku-academy/helpers";
import { getRefreshCookie } from "./auth-cookies";
import type { AuthRateLimitAction } from "./auth-rate-limit.decorator";

type LimitConfig = { limit: number; windowSeconds: number };

@Injectable()
export class AuthRateLimitService {
  constructor(@Inject(RedisService) private readonly redis: RedisService) {}

  async consume(action: AuthRateLimitAction, request: Request): Promise<void> {
    const config = this.config(action);
    const key = this.key(action, request);
    const count = await this.redis.client.incr(key);

    if (count === 1) {
      await this.redis.client.pexpire(key, config.windowSeconds * 1000);
    }

    if (count <= config.limit) {
      return;
    }

    const ttl = await this.redis.client.pttl(key);
    const retryAfter = Math.max(1, Math.ceil(Math.max(ttl, 0) / 1000));
    const error = new Error("AUTH_RATE_LIMITED");
    Object.assign(error, { retryAfter });
    throw error;
  }

  private config(action: AuthRateLimitAction): LimitConfig {
    switch (action) {
      case "register":
        return {
          limit: env.AUTH_RATE_LIMIT_REGISTER,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "login":
        return {
          limit: env.AUTH_RATE_LIMIT_LOGIN,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "refresh":
        return {
          limit: env.AUTH_RATE_LIMIT_REFRESH,
          windowSeconds: env.AUTH_RATE_LIMIT_REFRESH_WINDOW_SECONDS,
        };
      case "forgot":
        return {
          limit: env.AUTH_RATE_LIMIT_FORGOT,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "reset":
        return {
          limit: env.AUTH_RATE_LIMIT_RESET,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "verify":
        return {
          limit: env.AUTH_RATE_LIMIT_VERIFY,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "resend":
        return {
          limit: env.AUTH_RATE_LIMIT_RESEND,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
      case "avatar":
        return {
          limit: env.AUTH_RATE_LIMIT_AVATAR,
          windowSeconds: env.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        };
    }
  }

  private key(action: AuthRateLimitAction, request: Request): string {
    const ip = request.ip ?? request.socket.remoteAddress ?? "unknown";
    const body = request.body as { email?: unknown } | undefined;
    const email = typeof body?.email === "string" ? normalizeEmail(body.email) : undefined;
    const refreshToken = getRefreshCookie(request);

    switch (action) {
      case "register":
      case "reset":
      case "verify":
        return `auth:rl:${action}:${ip}`;
      case "refresh":
        return `auth:rl:${action}:${ip}:${refreshToken ? hashToken(refreshToken) : "missing"}`;
      case "login":
      case "forgot":
      case "resend":
        return `auth:rl:${action}:${ip}:${email ? hashToken(email) : "missing"}`;
      case "avatar": {
        const userId = (request as Request & { user?: { id?: string } }).user?.id;
        return `auth:rl:${action}:${userId ?? ip}`;
      }
    }
  }
}
