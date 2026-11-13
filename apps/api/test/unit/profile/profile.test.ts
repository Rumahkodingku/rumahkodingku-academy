import { describe, expect, it } from "vitest";

import { updateProfileSchema } from "../../../src/modules/profile/dto/profile.dto";

describe("profile DTO", () => {
  it("accepts profile fields and normalizes them", () => {
    const parsed = updateProfileSchema.parse({
      displayName: "  Nama Baru  ",
      username: "  Phase_User  ",
      bio: "Belajar backend",
      countryCode: "id",
      timezone: "Asia/Jakarta",
      locale: "en",
      websiteUrl: "https://example.com",
      githubUrl: "http://github.com/example",
      emailNotifications: false,
    });

    expect(parsed.displayName).toBe("Nama Baru");
    expect(parsed.username).toBe("phase_user");
    expect(parsed.countryCode).toBe("ID");
    expect(parsed.emailNotifications).toBe(false);
  });

  it.each(["role", "status", "email", "permissions", "password", "passwordHash"])(
    "rejects privileged field %s",
    (field) => {
      expect(updateProfileSchema.safeParse({ [field]: "change-me" }).success).toBe(false);
    },
  );

  it("rejects invalid URLs, timezones, country codes, and usernames", () => {
    expect(updateProfileSchema.safeParse({ websiteUrl: "javascript:alert(1)" }).success).toBe(
      false,
    );
    expect(updateProfileSchema.safeParse({ timezone: "Mars/Olympus" }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ countryCode: "IDN" }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ username: "Bad Name" }).success).toBe(false);
  });

  it("accepts null to clear optional fields", () => {
    const parsed = updateProfileSchema.parse({
      fullName: null,
      username: null,
      bio: null,
      countryCode: null,
      timezone: null,
      websiteUrl: null,
    });

    expect(parsed.fullName).toBeNull();
    expect(parsed.websiteUrl).toBeNull();
  });
});
