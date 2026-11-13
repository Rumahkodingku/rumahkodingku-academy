import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import {
  csrfProtection,
  ensureCsrfSession,
  generateCsrfToken,
} from "../../../src/modules/csrf/csrf";

function request(overrides: Record<string, unknown> = {}): Request {
  return {
    method: "POST",
    path: "/api/v1/auth/login",
    cookies: {},
    headers: {},
    ...overrides,
  } as unknown as Request;
}

function response() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    cookie: vi.fn(),
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    type: vi.fn(),
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };

  res.type = vi.fn(() => res) as never;
  return res as unknown as Response & typeof res;
}

describe("CSRF protection", () => {
  it("creates a session cookie when absent", () => {
    const req = request();
    const res = response();
    const next = vi.fn();

    ensureCsrfSession(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const value = req.cookies["csrf-session"] as string;
    expect(value).toMatch(/^[0-9a-f]{64}$/);
    expect(res.cookie).toHaveBeenCalledWith("csrf-session", value, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  });

  it("keeps an existing valid session cookie", () => {
    const value = "a".repeat(64);
    const req = request({ cookies: { "csrf-session": value } });
    const res = response();
    const next = vi.fn();

    ensureCsrfSession(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("rejects a missing token", () => {
    const req = request({ cookies: { "csrf-session": "a".repeat(64) } });
    const res = response();
    const next = vi.fn();

    csrfProtection(req, res, next as unknown as NextFunction);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({ code: "INVALID_CSRF_TOKEN", status: 403 });
  });

  it("rejects a token bound to another session", () => {
    const firstSession = "a".repeat(64);
    const signingResponse = response();
    const signingRequest = request({ cookies: { "csrf-session": firstSession } });
    const token = generateCsrfToken(signingRequest, signingResponse);

    const req = request({
      cookies: { "csrf-session": "b".repeat(64), "csrf-token": token },
      headers: { "x-csrf-token": token },
    });
    const res = response();
    const next = vi.fn();

    csrfProtection(req, res, next as unknown as NextFunction);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({ code: "INVALID_CSRF_TOKEN", status: 403 });
  });

  it("accepts a valid token", () => {
    const session = "c".repeat(64);
    const signingResponse = response();
    const signingRequest = request({ cookies: { "csrf-session": session } });
    const token = generateCsrfToken(signingRequest, signingResponse);

    const req = request({
      cookies: { "csrf-session": session, "csrf-token": token },
      headers: { "x-csrf-token": token },
    });
    const res = response();
    const next = vi.fn();

    csrfProtection(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith();
  });

  it("skips GET and webhook requests", () => {
    const getNext = vi.fn();
    csrfProtection(request({ method: "GET" }), response(), getNext as unknown as NextFunction);
    expect(getNext).toHaveBeenCalledWith();

    const webhookNext = vi.fn();
    csrfProtection(
      request({ path: "/api/v1/payments/webhooks/midtrans" }),
      response(),
      webhookNext as unknown as NextFunction,
    );
    expect(webhookNext).toHaveBeenCalledWith();
  });
});
