import { createHash, randomBytes } from "node:crypto";

import {
  normalizeEmail as normalizeEmailFromDb,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@rumahkodingku-academy/db";

export { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH };
export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;

export const normalizeEmail = normalizeEmailFromDb;

export function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export function durationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim());

  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier =
    unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;

  return amount * multiplier;
}
