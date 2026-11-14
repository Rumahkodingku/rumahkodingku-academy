import { env } from "@rumahkodingku-academy/env/server";
import type { NextFunction, Request, Response } from "express";

export function cookieToBearer(request: Request, _response: Response, next: NextFunction): void {
  if (!request.headers.authorization) {
    const token: unknown = request.cookies?.[env.AUTH_SESSION_COOKIE];

    if (typeof token === "string" && token.length > 0) {
      request.headers.authorization = `Bearer ${token}`;
    }
  }

  next();
}
