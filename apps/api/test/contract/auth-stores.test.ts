import "reflect-metadata";

import { AuthenticationStorage, PasswordHasher, RefreshTokenError } from "@nestjs/authentication";
import { AppDataSource, User, UserStatus } from "@rumahkodingku-academy/db";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { v7 as uuidv7 } from "uuid";

import { TypeOrmEmailTokenStore } from "../../src/modules/auth/stores/typeorm-email-token.store";
import { TypeOrmRefreshTokenStore } from "../../src/modules/auth/stores/typeorm-refresh-token.store";
import { setupDatabase, truncateAuthTables } from "../integration/setup";

describe("auth store contracts", () => {
  let userId: string;
  let refreshStore: TypeOrmRefreshTokenStore;
  let emailStore: TypeOrmEmailTokenStore;

  beforeAll(async () => {
    await setupDatabase();
    const storage = new AuthenticationStorage();
    refreshStore = new TypeOrmRefreshTokenStore(AppDataSource, storage);
    emailStore = new TypeOrmEmailTokenStore(AppDataSource, storage);
  });

  beforeEach(async () => {
    await truncateAuthTables();
    const hasher = new PasswordHasher({ logN: 10 });
    const users = AppDataSource.getRepository(User);
    const user = await users.save(
      users.create({
        id: uuidv7(),
        email: `store-${uuidv7()}@example.com`,
        passwordHash: await hasher.hash("correct-horse-battery"),
        status: UserStatus.Active,
      }),
    );
    userId = user.id;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("stores, marks, and revokes refresh tokens with compare-and-set semantics", async () => {
    const familyId = uuidv7();
    const tokenId = uuidv7();
    const now = new Date();
    const familyExpiresAt = new Date(Math.floor((now.getTime() + 90 * 86_400_000) / 1000) * 1000);

    await refreshStore.saveRefreshToken({
      id: tokenId,
      familyId,
      userId,
      createdAt: now,
      expiresAt: new Date(Math.floor((now.getTime() + 30 * 86_400_000) / 1000) * 1000),
      familyExpiresAt,
      claims: { amr: ["pwd"] },
    });

    const stored = await refreshStore.getRefreshToken(tokenId);
    expect(stored?.userId).toBe(userId);
    expect(stored?.familyId).toBe(familyId);
    expect(stored?.familyExpiresAt).toEqual(familyExpiresAt);

    const [first, second] = await Promise.all([
      refreshStore.markRefreshTokenUsed(tokenId, new Date()),
      refreshStore.markRefreshTokenUsed(tokenId, new Date()),
    ]);
    expect([first, second].filter(Boolean)).toHaveLength(1);

    await refreshStore.revokeRefreshTokenFamily(familyId);
    expect(await refreshStore.isRefreshTokenFamilyRevoked(familyId)).toBe(true);

    await expect(
      refreshStore.saveRefreshToken({
        id: uuidv7(),
        familyId,
        userId,
        createdAt: now,
        expiresAt: new Date(Math.floor((now.getTime() + 30 * 86_400_000) / 1000) * 1000),
        familyExpiresAt,
      }),
    ).rejects.toBeInstanceOf(RefreshTokenError);

    await refreshStore.revokeUserRefreshTokens(userId);
  });

  it("consumes email tokens exactly once", async () => {
    const tokenId = uuidv7();
    const now = new Date();

    await emailStore.saveEmailToken({
      id: tokenId,
      purpose: "email-verification",
      userId,
      email: `verify-${uuidv7()}@example.com`,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 86_400_000),
    });

    const [first, second] = await Promise.all([
      emailStore.consumeEmailToken(tokenId, "email-verification"),
      emailStore.consumeEmailToken(tokenId, "email-verification"),
    ]);

    expect([first, second].filter(Boolean)).toHaveLength(1);
    expect(await emailStore.consumeEmailToken(tokenId, "email-verification")).toBeUndefined();
  });

  it("deletes all reset tokens for a user", async () => {
    const now = new Date();

    for (let index = 0; index < 3; index += 1) {
      await emailStore.saveEmailToken({
        id: uuidv7(),
        purpose: "password-reset",
        userId,
        email: `reset-${uuidv7()}@example.com`,
        fingerprint: "fingerprint",
        createdAt: now,
        expiresAt: new Date(now.getTime() + 1_800_000),
      });
    }

    await emailStore.deleteUserEmailTokens(userId, "password-reset");
    const tokenId = uuidv7();
    await emailStore.saveEmailToken({
      id: tokenId,
      purpose: "password-reset",
      userId,
      email: `reset-${uuidv7()}@example.com`,
      fingerprint: "fingerprint",
      createdAt: now,
      expiresAt: new Date(now.getTime() + 1_800_000),
    });

    expect(await emailStore.consumeEmailToken(tokenId, "password-reset")).toBeDefined();
  });
});
