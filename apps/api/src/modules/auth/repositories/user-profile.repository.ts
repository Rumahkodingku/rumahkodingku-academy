import { Inject, Injectable } from "@nestjs/common";
import { UserProfile } from "@rumahkodingku-academy/db";
import type { EntityManager } from "typeorm";
import { DataSource } from "typeorm";

import { DATA_SOURCE } from "../../../infrastructure/database/database.module";

@Injectable()
export class UserProfileRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.dataSource.getRepository(UserProfile).findOne({ where: { userId } });
  }

  async findByUsername(username: string): Promise<UserProfile | null> {
    return this.dataSource
      .getRepository(UserProfile)
      .findOne({ where: { username: username.trim().toLowerCase() } });
  }

  async createInTransaction(
    manager: EntityManager,
    userId: string,
    displayName: string,
  ): Promise<UserProfile> {
    const profile = manager.create(UserProfile, {
      userId,
      displayName,
      locale: "id",
      emailNotifications: true,
      inAppNotifications: true,
    });

    return manager.save(profile);
  }

  async update(
    userId: string,
    patch: Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt" | "user">>,
  ): Promise<UserProfile> {
    await this.dataSource.getRepository(UserProfile).update({ userId }, patch);
    const profile = await this.findByUserId(userId);

    if (!profile) {
      throw new Error("User profile not found after update");
    }

    return profile;
  }

  async updateAvatar(userId: string, storageKey: string | null): Promise<void> {
    await this.dataSource
      .getRepository(UserProfile)
      .update({ userId }, { avatarStorageKey: storageKey });
  }
}
