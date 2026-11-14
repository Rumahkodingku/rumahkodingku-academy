import { randomBytes, randomUUID } from "node:crypto";

import { doubleCsrf } from "csrf-csrf";
import type { NextFunction, Request, Response } from "express";

import { env } from "@rumahkodingku-academy/env/server";

const CSRF_SESSION_COOKIE = "csrf-session";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: (req: Request) => {
    const value: unknown = req.cookies?.[CSRF_SESSION_COOKIE];
    return typeof value === "string" ? value : "";
  },
  cookieName: "csrf-token",
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
  skipCsrfProtection: (req) => req.path.startsWith("/api/v1/payments/webhooks"),
});

export function ensureCsrfSession(request: Request, response: Response, next: NextFunction): void {
  const existing: unknown = request.cookies?.[CSRF_SESSION_COOKIE];

  if (typeof existing === "string" && existing.length >= 32) {
    next();
    return;
  }

  const value = randomBytes(32).toString("hex");

  request.cookies = { ...request.cookies, [CSRF_SESSION_COOKIE]: value };
  response.cookie(CSRF_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  next();
}

export function csrfProtection(request: Request, response: Response, next: NextFunction): void {
  doubleCsrfProtection(request, response, (error?: unknown) => {
    if (!error) {
      next();
      return;
    }

    const requestId =
      request.requestId ?? request.headers["x-request-id"]?.toString() ?? randomUUID();

    response.status(403).type("application/problem+json").json({
      type: "https://rumahkodingku.com/problems/invalid-csrf-token",
      title: "Forbidden",
      status: 403,
      detail: "Invalid or missing CSRF token",
      instance: request.path,
      code: "INVALID_CSRF_TOKEN",
      requestId,
    });
  });
}

export { generateCsrfToken };
