import { describe, expect, it } from "vitest";

import {
  fieldErrors,
  forgotPasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  resetPasswordSchema,
} from "../../../../src/features/auth/validation";

describe("auth validation", () => {
  it("validates login fields", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success).toBe(
      true,
    );
    const invalid = loginSchema.safeParse({ email: "not-an-email", password: "" });
    expect(invalid.success).toBe(false);
    expect(fieldErrors(invalid.error as never)).toMatchObject({
      email: "auth.errors.email",
      password: "auth.errors.passwordRequired",
    });
  });

  it("requires password confirmation", () => {
    const mismatch = registerSchema.safeParse({
      name: "User",
      email: "user@example.com",
      password: "correct-horse-battery",
      confirmPassword: "different-password",
    });
    expect(mismatch.success).toBe(false);
    expect(fieldErrors(mismatch.error as never).confirmPassword).toBe(
      "auth.errors.passwordMismatch",
    );
  });

  it("enforces the password length", () => {
    expect(
      registerSchema.safeParse({
        name: "User",
        email: "user@example.com",
        password: "short",
        confirmPassword: "short",
      }).success,
    ).toBe(false);
  });

  it("validates forgot and reset schemas", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: "correct-horse-battery",
        confirmPassword: "correct-horse-battery",
      }).success,
    ).toBe(true);
  });

  it("strips fields the profile form does not own", () => {
    const parsed = profileSchema.parse({
      displayName: "User",
      locale: "id",
      emailNotifications: true,
      inAppNotifications: true,
      email: "attacker@example.com",
      status: "ACTIVE",
      permissions: ["admin.access"],
    });

    expect(parsed).not.toHaveProperty("email");
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("permissions");
  });

  it("rejects invalid profile URLs, timezones, country codes, and usernames", () => {
    const base = {
      displayName: "User",
      locale: "id" as const,
      emailNotifications: true,
      inAppNotifications: true,
    };

    expect(profileSchema.safeParse({ ...base, websiteUrl: "javascript:alert(1)" }).success).toBe(
      false,
    );
    expect(profileSchema.safeParse({ ...base, timezone: "Mars/Olympus" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, countryCode: "IDN" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, username: "Bad Name" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, websiteUrl: "https://example.com" }).success).toBe(
      true,
    );
  });
});
