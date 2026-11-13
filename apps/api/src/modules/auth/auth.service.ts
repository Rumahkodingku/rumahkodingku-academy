import { Inject, Injectable } from "@nestjs/common";
import {
  AuthenticationEvents,
  AuthenticationStorage,
  EmailVerificationService,
  PasswordHasher,
  TokenService,
  type PasswordResetLink,
  type TokenPair,
} from "@nestjs/authentication";
import { env } from "@rumahkodingku-academy/env/server";
import { UserStatus } from "@rumahkodingku-academy/db";
import { DataSource } from "typeorm";

import { ApiError } from "../../common/http/api-response";
import { logger } from "../../common/logging/logger";
import { DATA_SOURCE } from "../../infrastructure/database/database.module";
import { RbacService } from "../rbac/rbac.service";
import { PASSWORD_RESET_TTL_MS, hashToken, normalizeEmail, randomToken } from "./auth.constants";
import { AuthMailService } from "./auth-mail.service";
import { toAuthUser } from "../../common/auth/auth-user.mapper";
import type { AuthUser } from "./auth.types";
import type { RegisterDto } from "./dto/auth.dto";
import { AuthUsersRepository } from "./repositories/auth-users.repository";
import { UserProfileRepository } from "./repositories/user-profile.repository";

type AuthResult = { user: AuthUser; tokens: TokenPair };

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    private readonly users: AuthUsersRepository,
    private readonly profiles: UserProfileRepository,
    private readonly rbac: RbacService,
    private readonly hasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly emailVerification: EmailVerificationService,
    private readonly storage: AuthenticationStorage,
    private readonly mail: AuthMailService,
    private readonly events: AuthenticationEvents,
  ) {}

  async register(dto: RegisterDto): Promise<AuthUser> {
    const email = normalizeEmail(dto.email);
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new ApiError(409, "AUTH_EMAIL_TAKEN", "Email sudah terdaftar.");
    }

    const passwordHash = await this.hasher.hash(dto.password);

    let user;

    try {
      user = await this.dataSource.transaction(async (manager) => {
        const created = await this.users.createAccountInTransaction(manager, {
          email,
          passwordHash,
        });

        await this.profiles.createInTransaction(manager, created.id, dto.name);
        await this.rbac.assignDefaultRole(created.id, manager);

        return created;
      });
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ApiError(409, "AUTH_EMAIL_TAKEN", "Email sudah terdaftar.");
      }

      throw error;
    }

    try {
      await this.emailVerification.send({ id: user.id, email: user.email });
    } catch (error) {
      logger.warn("Verification email could not be sent", {
        userId: user.id,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }

    return this.requireAuthUser(user.id);
  }

  async login(emailInput: string, password: string): Promise<AuthResult> {
    const email = normalizeEmail(emailInput);
    const user = await this.users.findByEmail(email);
    const valid = await this.hasher.verify(password, user?.passwordHash ?? null);

    if (!user || !valid || user.status !== UserStatus.Active) {
      throw new ApiError(401, "AUTH_INVALID_CREDENTIALS", "Email atau password salah.");
    }

    const tokens = await this.tokenService.issue(user.id, { method: "password" });
    const authUser = await this.requireAuthUser(user.id);

    return { user: authUser, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const existing = await this.storage.refreshTokens.getRefreshToken(hashToken(refreshToken));

    if (!existing) {
      throw new ApiError(401, "AUTH_REFRESH_INVALID", "Sesi tidak valid.");
    }

    const tokens = await this.tokenService.refresh(refreshToken);
    const user = await this.requireAuthUser(existing.userId);

    return { user, tokens };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    await this.tokenService.revoke(refreshToken);
  }

  async getSessionUser(userId: string): Promise<AuthUser> {
    return this.requireAuthUser(userId);
  }

  async requestPasswordReset(emailInput: string): Promise<void> {
    const email = normalizeEmail(emailInput);
    const user = await this.users.findByEmail(email);

    if (!user || user.status !== UserStatus.Active) {
      this.events.emit({ type: "password-reset-requested", email });
      return;
    }

    this.events.emit({ type: "password-reset-requested", email: user.email, userId: user.id });

    const token = randomToken();
    const now = new Date();
    const link: PasswordResetLink = {
      userId: user.id,
      email: user.email,
      url: `${env.WEB_APP_URL}/reset-password?token=${encodeURIComponent(token)}`,
      expiresAt: new Date(now.getTime() + PASSWORD_RESET_TTL_MS),
    };

    await this.storage.emailTokens.saveEmailToken({
      id: hashToken(token),
      purpose: "password-reset",
      userId: user.id,
      email: user.email,
      fingerprint: hashToken(user.passwordHash),
      createdAt: now,
      expiresAt: link.expiresAt,
    });

    try {
      await this.mail.sendPasswordReset(link);
    } catch (error) {
      logger.warn("Password reset email could not be sent", {
        userId: user.id,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const record = await this.storage.emailTokens.consumeEmailToken(
      hashToken(token),
      "password-reset",
    );

    if (!record || record.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(
        400,
        "AUTH_TOKEN_INVALID",
        "Tautan reset tidak valid atau sudah kedaluwarsa.",
      );
    }

    const user = await this.users.findById(record.userId);

    if (
      !user ||
      normalizeEmail(user.email) !== normalizeEmail(record.email) ||
      !record.fingerprint ||
      record.fingerprint !== hashToken(user.passwordHash)
    ) {
      throw new ApiError(
        400,
        "AUTH_TOKEN_INVALID",
        "Tautan reset tidak valid atau sudah kedaluwarsa.",
      );
    }

    const passwordHash = await this.hasher.hash(password);
    await this.users.updatePassword(user.id, passwordHash);
    await this.users.markEmailVerified(user.id, user.email);
    await this.tokenService.revokeAll(user.id);
    await this.storage.emailTokens.deleteUserEmailTokens(user.id, "password-reset");
    this.events.emit({ type: "password-reset", userId: user.id });
  }

  async resendVerification(emailInput: string): Promise<void> {
    const user = await this.users.findByEmail(normalizeEmail(emailInput));

    if (!user || user.emailVerifiedAt) {
      return;
    }

    try {
      await this.emailVerification.send({ id: user.id, email: user.email });
    } catch (error) {
      logger.warn("Verification email could not be resent", {
        userId: user.id,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  async verifyEmail(token: string): Promise<string> {
    const result = await this.emailVerification.verify(token);

    if (!result) {
      throw new ApiError(
        400,
        "AUTH_TOKEN_INVALID",
        "Tautan verifikasi tidak valid atau sudah kedaluwarsa.",
      );
    }

    return result.email;
  }

  private async requireAuthUser(userId: string): Promise<AuthUser> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new ApiError(401, "AUTH_UNAUTHENTICATED", "Sesi tidak valid.");
    }

    const access = await this.rbac.getAccess(user.id);
    const authUser = toAuthUser(user, access);

    if (!authUser) {
      throw new ApiError(500, "AUTH_PROFILE_MISSING", "Profil pengguna tidak ditemukan.");
    }

    return authUser;
  }
}

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ER_DUP_ENTRY"
  );
}
