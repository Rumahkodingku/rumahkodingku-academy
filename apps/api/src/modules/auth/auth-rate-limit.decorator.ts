import { SetMetadata } from "@nestjs/common";

export const AUTH_RATE_LIMIT_KEY = "auth-rate-limit";

export type AuthRateLimitAction =
  | "register"
  | "login"
  | "refresh"
  | "forgot"
  | "reset"
  | "verify"
  | "resend"
  | "avatar";

export const AuthRateLimit = (action: AuthRateLimitAction) =>
  SetMetadata(AUTH_RATE_LIMIT_KEY, action);
