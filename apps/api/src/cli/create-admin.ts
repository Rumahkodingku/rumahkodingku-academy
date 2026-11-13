import "reflect-metadata";
import { User, UserProfile, UserStatus, ModelHasRole, Role } from "@rumahkodingku-academy/db";
import { PasswordHasher } from "@nestjs/authentication";
import type { DataSource } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import {
  normalizeEmail,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../modules/auth/auth.constants";
import { DEFAULT_ROLES, RBAC_GUARD, RBAC_MODEL_TYPE } from "../modules/rbac/rbac.constants";
import { seedRbac } from "./seed-rbac";

export type CreateAdminInput = {
  email: string;
  name: string;
  password: string;
};

export function validateAdminInput(input: CreateAdminInput): CreateAdminInput {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();

  if (
    !email ||
    !name ||
    input.password.length < PASSWORD_MIN_LENGTH ||
    input.password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new Error(
      "Set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD (12–128 characters) to create the first admin.",
    );
  }

  return { email, name, password: input.password };
}

export async function ensureAdmin(dataSource: DataSource, input: CreateAdminInput): Promise<User> {
  const valid = validateAdminInput(input);

  await seedRbac(dataSource);

  const users = dataSource.getRepository(User);
  const profiles = dataSource.getRepository(UserProfile);
  const roles = dataSource.getRepository(Role);
  const adminRole = await roles.findOne({
    where: {
      name: DEFAULT_ROLES.ADMIN,
      guardName: RBAC_GUARD,
    },
  });

  if (!adminRole) {
    throw new Error("Admin role not found after RBAC seed");
  }

  let user = await users.findOne({ where: { email: valid.email } });

  if (!user) {
    const hasher = new PasswordHasher();
    const passwordHash = await hasher.hash(valid.password);
    user = await users.save(
      users.create({
        id: uuidv7(),
        email: valid.email,
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
        displayName: valid.name,
        locale: "id",
        emailNotifications: true,
        inAppNotifications: true,
      }),
    );
  }

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(ModelHasRole)
    .values({ roleId: adminRole.id, modelType: RBAC_MODEL_TYPE, modelId: user.id })
    .orIgnore()
    .execute();

  return user;
}
