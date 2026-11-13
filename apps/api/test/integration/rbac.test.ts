import "reflect-metadata";

import {
  AppDataSource,
  ModelHasPermission,
  ModelHasRole,
  Permission,
  User,
  UserStatus,
} from "@rumahkodingku-academy/db";
import { PasswordHasher } from "@nestjs/authentication";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { v7 as uuidv7 } from "uuid";

import { ensureAdmin } from "../../src/cli/create-admin";
import { seedRbac } from "../../src/cli/seed-rbac";
import {
  DEFAULT_ROLES,
  PERMISSIONS,
  RBAC_GUARD,
  RBAC_MODEL_TYPE,
} from "../../src/modules/rbac/rbac.constants";
import { RbacService } from "../../src/modules/rbac/rbac.service";
import { setupDatabase, truncateAuthTables } from "./setup";

async function createUser(email: string): Promise<User> {
  const hasher = new PasswordHasher({ logN: 10 });
  const users = AppDataSource.getRepository(User);
  return users.save(
    users.create({
      id: uuidv7(),
      email,
      passwordHash: await hasher.hash("correct-horse-battery"),
      status: UserStatus.Active,
    }),
  );
}

describe("RBAC seed, startup validation, and admin CLI", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await truncateAuthTables();
  });

  afterAll(async () => {
    await seedRbac(AppDataSource);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("seeds roles and the admin permission idempotently", async () => {
    await seedRbac(AppDataSource);
    await seedRbac(AppDataSource);

    const defaults = (await AppDataSource.query(
      "SELECT id FROM `roles` WHERE `guard_name` = ? AND `is_default` = 1",
      [RBAC_GUARD],
    )) as Array<{ id: string }>;
    expect(defaults).toHaveLength(1);

    const roles = (await AppDataSource.query(
      "SELECT name FROM `roles` WHERE `guard_name` = ? ORDER BY `name`",
      [RBAC_GUARD],
    )) as Array<{ name: string }>;
    expect(roles.map((role) => role.name)).toEqual([DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.USER]);

    const permissions = (await AppDataSource.query(
      "SELECT name FROM `permissions` WHERE `name` = ? AND `guard_name` = ?",
      [PERMISSIONS.ADMIN_ACCESS, RBAC_GUARD],
    )) as Array<{ name: string }>;
    expect(permissions).toHaveLength(1);

    const attached = (await AppDataSource.query(
      `SELECT r.name
         FROM role_has_permissions rp
         INNER JOIN roles r ON r.id = rp.role_id
         INNER JOIN permissions p ON p.id = rp.permission_id
        WHERE p.name = ? AND r.guard_name = ?`,
      [PERMISSIONS.ADMIN_ACCESS, RBAC_GUARD],
    )) as Array<{ name: string }>;
    expect(attached).toEqual([{ name: DEFAULT_ROLES.ADMIN }]);
  });

  it("fails startup validation when the default role or admin permission is missing", async () => {
    await seedRbac(AppDataSource);
    const rbac = new RbacService(AppDataSource);

    await expect(rbac.validateConfiguration()).resolves.toBeUndefined();

    await AppDataSource.query("UPDATE `roles` SET `is_default` = 0 WHERE `guard_name` = ?", [
      RBAC_GUARD,
    ]);
    await expect(rbac.validateConfiguration()).rejects.toThrow(/default role/);
    await seedRbac(AppDataSource);

    await AppDataSource.query("DELETE FROM `permissions` WHERE `name` = ? AND `guard_name` = ?", [
      PERMISSIONS.ADMIN_ACCESS,
      RBAC_GUARD,
    ]);
    await expect(rbac.validateConfiguration()).rejects.toThrow(/admin\.access/);
    await seedRbac(AppDataSource);
    await expect(rbac.validateConfiguration()).resolves.toBeUndefined();
  });

  it("creates an admin once and reuses the same user, profile, and role", async () => {
    const email = `admin-cli-${randomUUID()}@example.com`;
    const input = { email, name: "CLI Admin", password: "correct-horse-battery" };

    const first = await ensureAdmin(AppDataSource, input);
    const second = await ensureAdmin(AppDataSource, input);

    expect(second.id).toBe(first.id);

    const profiles = (await AppDataSource.query(
      "SELECT id FROM `users_profile` WHERE `user_id` = ?",
      [first.id],
    )) as Array<{ id: string }>;
    expect(profiles).toHaveLength(1);

    const roles = (await AppDataSource.query(
      `SELECT r.name
         FROM model_has_roles mr
         INNER JOIN roles r ON r.id = mr.role_id
        WHERE mr.model_type = ? AND mr.model_id = ?`,
      [RBAC_MODEL_TYPE, first.id],
    )) as Array<{ name: string }>;
    expect(roles).toEqual([{ name: DEFAULT_ROLES.ADMIN }]);
    expect(first.emailVerifiedAt).toBeInstanceOf(Date);
  });

  it("resolves default roles, direct permissions, and role permissions, and removes them", async () => {
    await seedRbac(AppDataSource);
    const user = await createUser(`rbac-${randomUUID()}@example.com`);
    const rbac = new RbacService(AppDataSource);
    const userRole = await rbac.getDefaultRole();
    const adminRole = await rbac.findRoleByName(DEFAULT_ROLES.ADMIN);

    expect(userRole.name).toBe(DEFAULT_ROLES.USER);
    expect(adminRole?.name).toBe(DEFAULT_ROLES.ADMIN);

    const permission = await AppDataSource.getRepository(Permission).save(
      AppDataSource.getRepository(Permission).create({
        id: uuidv7(),
        name: `test.manage.${randomUUID()}`,
        guardName: RBAC_GUARD,
      }),
    );

    try {
      await rbac.assignDefaultRole(user.id);
      expect(await rbac.getAccess(user.id)).toEqual({
        roles: [DEFAULT_ROLES.USER],
        permissions: [],
      });

      await rbac.givePermissionToRole(userRole.id, permission.id);
      expect(await rbac.getAccess(user.id)).toEqual({
        roles: [DEFAULT_ROLES.USER],
        permissions: [permission.name],
      });

      await AppDataSource.getRepository(ModelHasPermission).insert({
        permissionId: permission.id,
        modelType: RBAC_MODEL_TYPE,
        modelId: user.id,
      });
      expect(await rbac.hasPermission(user.id, permission.name)).toBe(true);

      await AppDataSource.getRepository(ModelHasPermission).delete({
        permissionId: permission.id,
        modelId: user.id,
      });
      expect(await rbac.getAccess(user.id)).toEqual({
        roles: [DEFAULT_ROLES.USER],
        permissions: [permission.name],
      });

      await rbac.syncRolePermissions(userRole.id, []);
      expect(await rbac.getAccess(user.id)).toEqual({
        roles: [DEFAULT_ROLES.USER],
        permissions: [],
      });

      await rbac.assignRole(user.id, adminRole?.id ?? "");
      const adminAccess = await rbac.getAccess(user.id);
      expect(adminAccess.roles.sort()).toEqual([DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.USER].sort());
      expect(adminAccess.permissions).toContain(PERMISSIONS.ADMIN_ACCESS);

      await rbac.removeRole(user.id, adminRole?.id ?? "");
      expect((await rbac.getAccess(user.id)).roles).toEqual([DEFAULT_ROLES.USER]);

      await rbac.removeRole(user.id, userRole.id);
      expect(await rbac.getAccess(user.id)).toEqual({ roles: [], permissions: [] });
    } finally {
      await rbac.syncRolePermissions(userRole.id, []);
      await AppDataSource.getRepository(Permission).delete({ id: permission.id });
      await AppDataSource.getRepository(ModelHasPermission).delete({ permissionId: permission.id });
      await AppDataSource.getRepository(ModelHasRole).delete({ modelId: user.id });
    }
  });
});
