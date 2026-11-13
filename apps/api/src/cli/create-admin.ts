import "reflect-metadata";
import {
  AppDataSource,
  User,
  UserProfile,
  UserStatus,
  ModelHasRole,
  Role,
} from "@rumahkodingku-academy/db";
import { PasswordHasher } from "@nestjs/authentication";
import { v7 as uuidv7 } from "uuid";

import {
  normalizeEmail,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../modules/auth/auth.constants";
import { DEFAULT_ROLES, RBAC_GUARD, RBAC_MODEL_TYPE } from "../modules/rbac/rbac.constants";
import { seedRbac } from "./seed-rbac";

async function main(): Promise<void> {
  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? "");
  const name = process.env.ADMIN_NAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (
    !email ||
    !name ||
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new Error(
      "Set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD (12–128 characters) to create the first admin.",
    );
  }

  await AppDataSource.initialize();

  try {
    await seedRbac(AppDataSource);

    const users = AppDataSource.getRepository(User);
    const profiles = AppDataSource.getRepository(UserProfile);
    const roles = AppDataSource.getRepository(Role);
    const adminRole = await roles.findOne({
      where: { name: DEFAULT_ROLES.ADMIN, guardName: RBAC_GUARD },
    });

    if (!adminRole) {
      throw new Error("Admin role not found after RBAC seed");
    }

    let user = await users.findOne({ where: { email } });

    if (!user) {
      const hasher = new PasswordHasher();
      const passwordHash = await hasher.hash(password);
      user = await users.save(
        users.create({
          id: uuidv7(),
          email,
          passwordHash,
          status: UserStatus.Active,
          emailVerifiedAt: new Date(),
        }),
      );
    }

    const profile = await profiles.findOne({ where: { userId: user.id } });

    if (!profile) {
      await profiles.save(
        profiles.create({
          id: uuidv7(),
          userId: user.id,
          displayName: name,
          locale: "id",
          emailNotifications: true,
          inAppNotifications: true,
        }),
      );
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(ModelHasRole)
      .values({ roleId: adminRole.id, modelType: RBAC_MODEL_TYPE, modelId: user.id })
      .orIgnore()
      .execute();

    console.log(`Admin ready: ${email}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Failed to create admin");
  process.exit(1);
});
