import { describe, expect, it } from "vitest";

import { hasPermission, PERMISSIONS } from "../../../../src/features/auth/permissions";
import type { AuthUser } from "../../../../src/features/auth/types";

const user = (permissions: string[]): AuthUser => ({
  id: "user-1",
  email: "user@example.com",
  emailVerified: true,
  status: "ACTIVE",
  roles: ["user"],
  permissions,
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
});

describe("permissions", () => {
  it("checks permissions, not roles", () => {
    expect(hasPermission(user([PERMISSIONS.ADMIN_ACCESS]), PERMISSIONS.ADMIN_ACCESS)).toBe(true);
    expect(hasPermission(user([]), PERMISSIONS.ADMIN_ACCESS)).toBe(false);
    expect(hasPermission(null, PERMISSIONS.ADMIN_ACCESS)).toBe(false);
  });
});
