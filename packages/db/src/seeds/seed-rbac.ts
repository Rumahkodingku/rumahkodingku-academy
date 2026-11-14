import type { DataSource } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import { DEFAULT_ROLES, PERMISSIONS, RBAC_GUARD } from "../constants";

export async function seedRbac(dataSource: DataSource): Promise<void> {
  const roleSeeds = [
    {
      name: DEFAULT_ROLES.USER,
      description: "Default role for registered learners",
      isDefault: true,
    },
    { name: DEFAULT_ROLES.ADMIN, description: "Administrative access", isDefault: false },
  ] as const;

  for (const role of roleSeeds) {
    const existing = (await dataSource.query(
      "SELECT id FROM `roles` WHERE `name` = ? AND `guard_name` = ? LIMIT 1",
      [role.name, RBAC_GUARD],
    )) as Array<{ id: string }>;

    if (existing[0]) {
      await dataSource.query(
        "UPDATE `roles` SET `description` = ?, `is_default` = ? WHERE `id` = ?",
        [role.description, role.isDefault, existing[0].id],
      );
    } else {
      await dataSource.query(
        "INSERT INTO `roles` (`id`, `name`, `guard_name`, `description`, `is_default`) VALUES (?, ?, ?, ?, ?)",
        [uuidv7(), role.name, RBAC_GUARD, role.description, role.isDefault],
      );
    }
  }

  const permissionId = await ensurePermission(dataSource, PERMISSIONS.ADMIN_ACCESS);
  const adminRole = (await dataSource.query(
    "SELECT id FROM `roles` WHERE `name` = ? AND `guard_name` = ? LIMIT 1",
    [DEFAULT_ROLES.ADMIN, RBAC_GUARD],
  )) as Array<{ id: string }>;

  if (!adminRole[0]) {
    throw new Error("Admin role was not seeded");
  }

  await dataSource.query(
    "INSERT IGNORE INTO `role_has_permissions` (`role_id`, `permission_id`) VALUES (?, ?)",
    [adminRole[0].id, permissionId],
  );
}

async function ensurePermission(dataSource: DataSource, name: string): Promise<string> {
  const existing = (await dataSource.query(
    "SELECT id FROM `permissions` WHERE `name` = ? AND `guard_name` = ? LIMIT 1",
    [name, RBAC_GUARD],
  )) as Array<{ id: string }>;

  if (existing[0]) {
    return existing[0].id;
  }

  const id = uuidv7();
  await dataSource.query(
    "INSERT INTO `permissions` (`id`, `name`, `guard_name`, `description`) VALUES (?, ?, ?, ?)",
    [id, name, RBAC_GUARD, "Access administrative surfaces"],
  );

  return id;
}
