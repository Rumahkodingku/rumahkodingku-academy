import { Injectable } from "@nestjs/common";
import { UserStatus } from "@rumahkodingku-academy/db";
import { ApiError } from "../../common/http/api-response";
import { toAuthUser } from "../../common/auth/auth-user.mapper";
import { RbacService } from "../rbac/rbac.service";
import { AuthUsersRepository } from "../auth/repositories/auth-users.repository";
import { UserProfileRepository } from "../auth/repositories/user-profile.repository";
import type { AuthUser } from "../auth/auth.types";
import type { UpdateProfileInput } from "./profile.dto";

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ER_DUP_ENTRY"
  );
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly users: AuthUsersRepository,
    private readonly profiles: UserProfileRepository,
    private readonly rbac: RbacService,
  ) {}

  async getSessionUser(userId: string): Promise<AuthUser> {
    const user = await this.users.findById(userId);

    if (!user || user.status !== UserStatus.Active) {
      throw new ApiError(401, "AUTH_UNAUTHENTICATED", "Sesi tidak valid.");
    }

    const access = await this.rbac.getAccess(user.id);
    const authUser = toAuthUser(user, access);

    if (!authUser) {
      throw new ApiError(500, "AUTH_PROFILE_MISSING", "Profil pengguna tidak ditemukan.");
    }

    return authUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileInput): Promise<AuthUser> {
    if (dto.username) {
      const existing = await this.profiles.findByUsername(dto.username);

      if (existing && existing.userId !== userId) {
        throw new ApiError(409, "AUTH_USERNAME_TAKEN", "Username sudah digunakan.");
      }
    }

    try {
      await this.profiles.update(userId, dto);
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ApiError(409, "AUTH_USERNAME_TAKEN", "Username sudah digunakan.");
      }

      throw error;
    }

    return this.getSessionUser(userId);
  }

  async getAvatarKey(userId: string): Promise<string | null> {
    const user = await this.users.findById(userId);
    return user?.profile?.avatarStorageKey ?? null;
  }

  async updateAvatar(userId: string, storageKey: string): Promise<void> {
    await this.profiles.updateAvatar(userId, storageKey);
  }

  async removeAvatar(userId: string): Promise<string | null> {
    const user = await this.users.findById(userId);
    const key = user?.profile?.avatarStorageKey ?? null;
    await this.profiles.updateAvatar(userId, null);
    return key;
  }
}
