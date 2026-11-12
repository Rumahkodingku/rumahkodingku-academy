type SecurityInput = {
  NODE_ENV: string;
  JWT_SECRET: string;
  CSRF_SECRET: string;
  JWT_ISSUER: string;
};

const PLACEHOLDER_PREFIX = "change-me";

export function assertProductionSecrets(input: SecurityInput): void {
  if (input.NODE_ENV !== "production") {
    return;
  }

  if (input.JWT_SECRET.startsWith(PLACEHOLDER_PREFIX)) {
    throw new Error("JWT_SECRET must be replaced before running in production");
  }

  if (input.CSRF_SECRET.startsWith(PLACEHOLDER_PREFIX)) {
    throw new Error("CSRF_SECRET must be replaced before running in production");
  }

  if (input.JWT_ISSUER.includes("localhost")) {
    throw new Error("JWT_ISSUER must be a public URL before running in production");
  }
}
