import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { EntityManager } from "typeorm";

import { DATA_SOURCE } from "../../infrastructure/database/database.module";
import { PERMISSIONS, RBAC_GUARD, RBAC_MODEL_TYPE } from "./rbac.constants";
import type { AccessSnapshot, RoleRecord } from "./rbac.types";

type RoleRow = {
  id: string;
  name: string;
  guard_name: string;
  description: string | null;
  is_default: number | boolean;
};

type NameRow = { name: string };

@Injectable()
export class RbacService implements OnModuleInit {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: import("typeorm").DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.validateConfiguration();
  }

  async validateConfiguration(): Promise<void> {
    const defaults = (await this.dataSource.query(
      "SELECT id FROM `roles` WHERE `guard_name` = ? AND `is_default` = 1",
      [RBAC_GUARD],
    )) as Array<{ id: string }>;

    if (defaults.length !== 1) {
      throw new Error(
        `RBAC configuration is invalid: expected exactly one default role for guard "${RBAC_GUARD}", found ${defaults.length}. Run db:seed:rbac.`,
      );
    }

    const permission = (await this.dataSource.query(
      "SELECT id FROM `permissions` WHERE `name` = ? AND `guard_name` = ? LIMIT 1",
      [PERMISSIONS.ADMIN_ACCESS, RBAC_GUARD],
    )) as Array<{ id: string }>;

    if (permission.length !== 1) {
      throw new Error(
        `RBAC configuration is invalid: permission "${PERMISSIONS.ADMIN_ACCESS}" is missing. Run db:seed:rbac.`,
      );
    }
  }

  async getAccess(userId: string, guardName = RBAC_GUARD): Promise<AccessSnapshot> {
    const roles = (await this.dataSource.query(
      `SELECT r.name
         FROM model_has_roles mr
         INNER JOIN roles r ON r.id = mr.role_id
        WHERE mr.model_type = ? AND mr.model_id = ? AND r.guard_name = ?`,
      [RBAC_MODEL_TYPE, userId, guardName],
    )) as NameRow[];

    const directPermissions = (await this.dataSource.query(
      `SELECT p.name
         FROM model_has_permissions mp
         INNER JOIN permissions p ON p.id = mp.permission_id
        WHERE mp.model_type = ? AND mp.model_id = ? AND p.guard_name = ?`,
      [RBAC_MODEL_TYPE, userId, guardName],
    )) as NameRow[];

    const rolePermissions = (await this.dataSource.query(
      `SELECT DISTINCT p.name
         FROM model_has_roles mr
         INNER JOIN role_has_permissions rp ON rp.role_id = mr.role_id
         INNER JOIN permissions p ON p.id = rp.permission_id
        WHERE mr.model_type = ? AND mr.model_id = ? AND p.guard_name = ?`,
      [RBAC_MODEL_TYPE, userId, guardName],
    )) as NameRow[];

    const permissionNames = [
      ...new Set([...directPermissions, ...rolePermissions].map((row) => row.name)),
    ];

    return {
      roles: roles.map((row) => row.name),
      permissions: permissionNames.sort(),
    };
  }

  async hasPermission(
    userId: string,
    permission: string,
    guardName = RBAC_GUARD,
  ): Promise<boolean> {
    const access = await this.getAccess(userId, guardName);
    return access.permissions.includes(permission);
  }

  async getDefaultRole(guardName = RBAC_GUARD): Promise<RoleRecord> {
    const rows = (await this.dataSource.query(
      "SELECT id, name, guard_name, description, is_default FROM `roles` WHERE `guard_name` = ? AND `is_default` = 1 LIMIT 1",
      [guardName],
    )) as RoleRow[];

    const row = rows[0];

    if (!row) {
      throw new Error(`No default RBAC role configured for guard "${guardName}".`);
    }

    return this.mapRole(row);
  }

  async findRoleByName(name: string, guardName = RBAC_GUARD): Promise<RoleRecord | null> {
    const rows = (await this.dataSource.query(
      "SELECT id, name, guard_name, description, is_default FROM `roles` WHERE `name` = ? AND `guard_name` = ? LIMIT 1",
      [name, guardName],
    )) as RoleRow[];

    const row = rows[0];
    return row ? this.mapRole(row) : null;
  }

  async assignDefaultRole(userId: string, manager?: EntityManager): Promise<void> {
    const executor = manager ?? this.dataSource.manager;
    const rows = (await executor.query(
      "SELECT id FROM `roles` WHERE `guard_name` = ? AND `is_default` = 1 LIMIT 1",
      [RBAC_GUARD],
    )) as Array<{ id: string }>;

    const role = rows[0];

    if (!role) {
      throw new Error(`No default RBAC role configured for guard "${RBAC_GUARD}".`);
    }

    await this.assignRoleWithManager(executor, userId, role.id);
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.assignRoleWithManager(this.dataSource.manager, userId, roleId);
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.dataSource.query(
      "DELETE FROM `model_has_roles` WHERE `role_id` = ? AND `model_type` = ? AND `model_id` = ?",
      [roleId, RBAC_MODEL_TYPE, userId],
    );
  }

  async givePermissionToRole(roleId: string, permissionId: string): Promise<void> {
    await this.dataSource.query(
      "INSERT IGNORE INTO `role_has_permissions` (`role_id`, `permission_id`) VALUES (?, ?)",
      [roleId, permissionId],
    );
  }

  async syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.query("DELETE FROM `role_has_permissions` WHERE `role_id` = ?", [roleId]);

      for (const permissionId of permissionIds) {
        await manager.query(
          "INSERT INTO `role_has_permissions` (`role_id`, `permission_id`) VALUES (?, ?)",
          [roleId, permissionId],
        );
      }
    });
  }

  private async assignRoleWithManager(
    manager: EntityManager,
    userId: string,
    roleId: string,
  ): Promise<void> {
    await manager.query(
      "INSERT IGNORE INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES (?, ?, ?)",
      [roleId, RBAC_MODEL_TYPE, userId],
    );
  }

  private mapRole(row: RoleRow): RoleRecord {
    return {
      id: row.id,
      name: row.name,
      guardName: row.guard_name,
      description: row.description,
      isDefault: Boolean(row.is_default),
    };
  }
}
