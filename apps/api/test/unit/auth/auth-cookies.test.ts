import { describe, expect, it, vi } from "vitest";
import type { Response } from "express";

const { env } = vi.hoisted(() => ({
  env: {
    NODE_ENV: "production",
    AUTH_SESSION_COOKIE: "access_token",
    AUTH_REFRESH_COOKIE: "refresh_token",
    JWT_REFRESH_TTL: "30d",
  },
}));

vi.mock("@rumahkodingku-academy/env/server", () => ({ env }));

const { clearAuthCookies, setAuthCookies } = await import("../../../src/modules/auth/auth-cookies");

function response() {
  return { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as Response;
}

describe("auth cookies", () => {
  it("sets host-only HttpOnly Secure cookies with the configured lifetimes", () => {
    const res = response();

    setAuthCookies(res, {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 900,
    });

    const cookie = res.cookie as unknown as ReturnType<typeof vi.fn>;
    expect(cookie).toHaveBeenNthCalledWith(1, "access_token", "access-token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 900_000,
    });
    expect(cookie).toHaveBeenNthCalledWith(2, "refresh_token", "refresh-token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    expect(cookie.mock.calls[0]?.[2]).not.toHaveProperty("domain");
  });

  it("clears both cookies with the same flags", () => {
    const res = response();

    clearAuthCookies(res);

    const clear = res.clearCookie as unknown as ReturnType<typeof vi.fn>;
    expect(clear).toHaveBeenCalledTimes(2);
    expect(clear).toHaveBeenNthCalledWith(1, "access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    expect(clear).toHaveBeenNthCalledWith(2, "refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  });
});
