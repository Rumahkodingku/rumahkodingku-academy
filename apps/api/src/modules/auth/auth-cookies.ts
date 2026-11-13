import type { Request, Response } from "express";
import type { TokenPair } from "@nestjs/authentication";

import { env } from "@rumahkodingku-academy/env/server";

import { durationToMs } from "./auth.constants";

const sameSite = "lax" as const;
const path = "/";

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite,
    path,
  };
}

export function setAuthCookies(response: Response, tokens: TokenPair): void {
  response.cookie(env.AUTH_SESSION_COOKIE, tokens.accessToken, {
    ...baseCookieOptions(),
    maxAge: tokens.expiresIn * 1000,
  });

  response.cookie(env.AUTH_REFRESH_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions(),
    maxAge: durationToMs(env.JWT_REFRESH_TTL),
  });
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie(env.AUTH_SESSION_COOKIE, baseCookieOptions());
  response.clearCookie(env.AUTH_REFRESH_COOKIE, baseCookieOptions());
}

export function getRefreshCookie(request: Request): string | undefined {
  const value: unknown = request.cookies?.[env.AUTH_REFRESH_COOKIE];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
