import { describe, expect, it } from "vitest";

import { assertProductionSecrets } from "./security.config";

describe("assertProductionSecrets", () => {
  it("throws for placeholder secrets in production", () => {
    expect(() =>
      assertProductionSecrets({
        NODE_ENV: "production",
        JWT_SECRET: "change-me-development-jwt-secret-at-least-32-chars",
        CSRF_SECRET: "change-me-development-csrf-secret-at-least-32-chars",
        JWT_ISSUER: "https://api.example.com",
      }),
    ).toThrow(/JWT_SECRET|CSRF_SECRET/);
  });

  it("throws for a localhost issuer in production", () => {
    expect(() =>
      assertProductionSecrets({
        NODE_ENV: "production",
        JWT_SECRET: "a".repeat(40),
        CSRF_SECRET: "b".repeat(40),
        JWT_ISSUER: "http://localhost:3000",
      }),
    ).toThrow(/JWT_ISSUER/);
  });

  it("allows placeholders in development", () => {
    expect(() =>
      assertProductionSecrets({
        NODE_ENV: "development",
        JWT_SECRET: "change-me-development-jwt-secret-at-least-32-chars",
        CSRF_SECRET: "change-me-development-csrf-secret-at-least-32-chars",
        JWT_ISSUER: "http://localhost:3000",
      }),
    ).not.toThrow();
  });
});
