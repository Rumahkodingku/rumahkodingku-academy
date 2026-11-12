import { randomUUID } from "node:crypto";

import { doubleCsrf } from "csrf-csrf";
import type { NextFunction, Request, Response } from "express";

import { env } from "@rumahkodingku-academy/env/server";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: (req: Request) => req.ip ?? "anonymous",
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
