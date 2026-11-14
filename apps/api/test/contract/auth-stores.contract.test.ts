import "reflect-metadata";

import type {
  EmailTokenRecord,
  EmailTokenStore,
  RefreshTokenRecord,
  RefreshTokenStore,
} from "@nestjs/authentication";
import { AuthenticationStorage, PasswordHasher } from "@nestjs/authentication";
import { authenticationStoreContract } from "@nestjs/authentication/testing";
import { AppDataSource, User, UserStatus } from "@rumahkodingku-academy/db";
import { afterAll, beforeAll, describe, it } from "vitest";
import { v7 as uuidv7 } from "uuid";

import { TypeOrmEmailTokenStore } from "../../src/modules/auth/stores/typeorm-email-token.store";
import { TypeOrmRefreshTokenStore } from "../../src/modules/auth/stores/typeorm-refresh-token.store";
import { setupDatabase } from "../integration/setup";

// The package contract uses opaque user ids; the schema stores UUID foreign keys.
class UserIdMap {
  private readonly byExternal = new Map<string, string>();
  private readonly byInternal = new Map<string, string>();

  async resolve(external: string): Promise<string> {
    const existing = this.byExternal.get(external);

    if (existing) {
      return existing;
    }

    const internal = uuidv7();
    this.byExternal.set(external, internal);
    this.byInternal.set(internal, external);

    const hasher = new PasswordHasher({ logN: 10 });
    const users = AppDataSource.getRepository(User);
    await users.save(
      users.create({
        id: internal,
        email: `contract-${internal}@example.com`,
        passwordHash: await hasher.hash("correct-horse-battery"),
        status: UserStatus.Active,
      }),
    );

    return internal;
  }

  external(internal: string): string {
    return this.byInternal.get(internal) ?? internal;
  }
}

function refreshAdapter(store: TypeOrmRefreshTokenStore, ids: UserIdMap): RefreshTokenStore {
  return {
    async getRefreshToken(id) {
      const record = await store.getRefreshToken(id);
      return record ? { ...record, userId: ids.external(record.userId) } : undefined;
    },
    async saveRefreshToken(record: RefreshTokenRecord) {
      await store.saveRefreshToken({ ...record, userId: await ids.resolve(record.userId) });
    },
    markRefreshTokenUsed: (id, at) => store.markRefreshTokenUsed(id, at),
    revokeRefreshTokenFamily: (familyId) => store.revokeRefreshTokenFamily(familyId),
    isRefreshTokenFamilyRevoked: (familyId) => store.isRefreshTokenFamilyRevoked(familyId),
    async revokeUserRefreshTokens(userId) {
      await store.revokeUserRefreshTokens(await ids.resolve(userId));
    },
  };
}

function emailAdapter(store: TypeOrmEmailTokenStore, ids: UserIdMap): EmailTokenStore {
  return {
    async saveEmailToken(record: EmailTokenRecord) {
      await store.saveEmailToken({ ...record, userId: await ids.resolve(record.userId) });
    },
    async consumeEmailToken(id, purpose) {
      const record = await store.consumeEmailToken(id, purpose);
      return record ? { ...record, userId: ids.external(record.userId) } : undefined;
    },
    async deleteUserEmailTokens(userId, purpose) {
      await store.deleteUserEmailTokens(await ids.resolve(userId), purpose);
    },
  };
}

async function freshStores() {
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const table of [
    "refresh_sessions",
    "refresh_token_families",
    "email_verification_tokens",
    "password_reset_tokens",
    "users",
  ]) {
    await AppDataSource.query(`TRUNCATE TABLE \`${table}\``);
  }
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");

  const storage = new AuthenticationStorage();
  const ids = new UserIdMap();
  const refresh = new TypeOrmRefreshTokenStore(AppDataSource, storage);
  const email = new TypeOrmEmailTokenStore(AppDataSource, storage);

  return {
    refreshTokens: refreshAdapter(refresh, ids),
    emailTokens: emailAdapter(email, ids),
  };
}

describe("mysql auth stores", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  const cases = authenticationStoreContract(freshStores, {
    contracts: ["refreshTokens", "emailTokens"],
    concurrent: true,
  });

  for (const contractCase of cases) {
    it(contractCase.name, contractCase.run);
  }
});
