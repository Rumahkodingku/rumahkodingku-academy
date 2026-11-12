import { describe, expect, it } from "vitest";

import { isLocale, isProtectedPath, localizedPath } from "./routing";

describe("locale routing", () => {
  it("keeps the default locale unprefixed", () => {
    expect(localizedPath("id", "/courses")).toBe("/courses");
    expect(localizedPath("id", "/")).toBe("/");
  });

  it("prefixes a non-default locale", () => {
    expect(localizedPath("en", "/courses")).toBe("/en/courses");
    expect(localizedPath("en", "/")).toBe("/en");
  });

  it("validates supported locales", () => {
    expect(isLocale("id")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("protects learner, account, admin, and checkout paths", () => {
    expect(isProtectedPath("/learn")).toBe(true);
    expect(isProtectedPath("/learn/courses/1")).toBe(true);
    expect(isProtectedPath("/me/orders")).toBe(true);
    expect(isProtectedPath("/admin/courses")).toBe(true);
    expect(isProtectedPath("/checkout/1")).toBe(true);
    expect(isProtectedPath("/courses")).toBe(false);
  });
});
