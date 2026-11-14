import { UserStatus } from "@rumahkodingku-academy/db";
import { describe, expect, it } from "vitest";

import { PermissionPolicy } from "../../../src/modules/rbac/policies/permission.policy";
import {
  EmailVerifiedPolicy,
  OwnershipPolicy,
} from "../../../src/modules/auth/policies/auth.policies";
import type { AuthUser } from "../../../src/modules/auth/auth.types";

function user(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: "user-1",
    email: "user@example.com",
    emailVerified: false,
    status: UserStatus.Active,
    roles: ["user"],
    permissions: [],
    profile: {
      displayName: "User",
      fullName: null,
      username: null,
      bio: null,
      headline: null,
      avatarUrl: null,
      phone: null,
      countryCode: null,
      city: null,
      timezone: null,
      locale: "id",
      websiteUrl: null,
      githubUrl: null,
      linkedinUrl: null,
      xUrl: null,
      instagramUrl: null,
      emailNotifications: true,
      inAppNotifications: true,
    },
    ...overrides,
  } as AuthUser;
}

describe("authorization policies", () => {
  const permission = new PermissionPolicy();
  const verification = new EmailVerifiedPolicy();
  const ownership = new OwnershipPolicy();

  it("denies guests", () => {
    expect(permission.has(null, "admin.access")).toBe(false);
    expect(verification.verified(null)).toBe(false);
    expect(ownership.owns(null, "user-1")).toBe(false);
  });

  it("denies a USER role without the permission", () => {
    expect(permission.has(user({ roles: ["user"] }), "admin.access")).toBe(false);
    expect(verification.verified(user())).toBe(false);
    expect(ownership.owns(user(), "user-1")).toBe(true);
  });

  it("denies an unverified user", () => {
    expect(verification.verified(user({ emailVerified: false }))).toBe(false);
  });

  it("allows a verified user only for granted ownership", () => {
    const verified = user({ emailVerified: true });
    expect(verification.verified(verified)).toBe(true);
    expect(ownership.owns(verified, "user-1")).toBe(true);
    expect(ownership.owns(verified, "user-2")).toBe(false);
  });

  it("allows an admin with admin.access", () => {
    const admin = user({ roles: ["admin"], permissions: ["admin.access"], emailVerified: true });
    expect(permission.has(admin, "admin.access")).toBe(true);
    expect(permission.has(admin, "billing.manage")).toBe(false);
  });
});
