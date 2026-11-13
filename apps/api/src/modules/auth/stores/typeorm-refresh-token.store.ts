import { Inject, Injectable } from "@nestjs/common";
import { RefreshSession, RefreshTokenFamily } from "@rumahkodingku-academy/db";
import { AuthenticationStorage, RefreshTokenError } from "@nestjs/authentication";
import type { RefreshTokenRecord, RefreshTokenStore } from "@nestjs/authentication";
import { DataSource } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import { DATA_SOURCE } from "../../../infrastructure/database/database.module";

@Injectable()
export class TypeOrmRefreshTokenStore implements RefreshTokenStore {
  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const session = await this.dataSource.getRepository(RefreshSession).findOne({
      where: { tokenHash: id },
    });

    if (!session?.familyId || !session.familyExpiresAt) {
      return undefined;
    }

    return {
      id: session.tokenHash,
      familyId: session.familyId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      familyExpiresAt: session.familyExpiresAt,
      usedAt: session.usedAt ?? undefined,
      claims: session.claims ?? undefined,
    };
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const family = await manager.getRepository(RefreshTokenFamily).findOne({
        where: { id: record.familyId },
      });

      if (family?.revokedAt) {
        throw new RefreshTokenError("reused");
      }

      if (!family) {
        await manager.getRepository(RefreshTokenFamily).insert({
          id: record.familyId,
          userId: record.userId,
          expiresAt: record.familyExpiresAt,
        });
      }

      await manager.getRepository(RefreshSession).insert({
        id: uuidv7(),
        userId: record.userId,
        tokenHash: record.id,
        familyId: record.familyId,
        expiresAt: record.expiresAt,
        familyExpiresAt: record.familyExpiresAt,
        usedAt: record.usedAt ?? null,
        claims: (record.claims ?? null) as never,
      });
    });
  }

  async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(RefreshSession)
      .createQueryBuilder()
      .update(RefreshSession)
      .set({ usedAt: at })
      .where("token_hash = :id AND used_at IS NULL", { id })
      .execute();

    return (result.affected ?? 0) === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager
        .getRepository(RefreshTokenFamily)
        .createQueryBuilder()
        .update(RefreshTokenFamily)
        .set({ revokedAt: new Date() })
        .where("id = :familyId AND revoked_at IS NULL", { familyId })
        .execute();

      await manager
        .getRepository(RefreshSession)
        .createQueryBuilder()
        .update(RefreshSession)
        .set({ revokedAt: new Date() })
        .where("family_id = :familyId AND revoked_at IS NULL", { familyId })
        .execute();
    });
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    const family = await this.dataSource.getRepository(RefreshTokenFamily).findOne({
      where: { id: familyId },
    });

    return Boolean(family?.revokedAt);
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager
        .getRepository(RefreshTokenFamily)
        .createQueryBuilder()
        .update(RefreshTokenFamily)
        .set({ revokedAt: new Date() })
        .where("user_id = :userId AND revoked_at IS NULL", { userId })
        .execute();

      await manager
        .getRepository(RefreshSession)
        .createQueryBuilder()
        .update(RefreshSession)
        .set({ revokedAt: new Date() })
        .where("user_id = :userId AND revoked_at IS NULL", { userId })
        .execute();
    });
  }
}
