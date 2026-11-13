import "reflect-metadata";

import { AppDataSource } from "@rumahkodingku-academy/db";
import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { RBAC_MODEL_TYPE } from "@rumahkodingku-academy/db";
import { setupDatabase, truncateAuthTables } from "./setup";

describe("auth schema migration", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("keeps account columns only and enforces RBAC/profile keys", async () => {
    const columns = (await AppDataSource.query("SHOW COLUMNS FROM `users`")) as Array<{
      Field: string;
    }>;
    const names = columns.map((column) => column.Field);

    expect(names).not.toContain("role");
    expect(names).not.toContain("name");
    expect(names).not.toContain("avatar_storage_key");
    expect(names).not.toContain("profile");
    expect(names).toEqual(
      expect.arrayContaining(["email", "password_hash", "status", "email_verified_at"]),
    );

    const profileIndexes = (await AppDataSource.query("SHOW INDEX FROM `users_profile`")) as Array<{
      Key_name: string;
      Non_unique: number;
      Column_name: string;
    }>;
    expect(
      profileIndexes.some(
        (index) => index.Column_name === "user_id" && Number(index.Non_unique) === 0,
      ),
    ).toBe(true);

    const roleIndexes = (await AppDataSource.query("SHOW INDEX FROM `model_has_roles`")) as Array<{
      Key_name: string;
      Non_unique: number;
      Column_name: string;
    }>;
    const primary = roleIndexes.filter((index) => index.Key_name === "PRIMARY");
    expect(primary.map((index) => index.Column_name).sort()).toEqual(
      ["model_id", "model_type", "role_id"].sort(),
    );
  });

  it("backfills a Phase 2 user into users_profile and the admin role", async () => {
    await truncateAuthTables();

    try {
      // Revert the timestamp precision migration, then the RBAC/profile migration.
      runDbScript("db:revert");
      runDbScript("db:revert");

      await AppDataSource.query(
        `INSERT INTO \`users\`
           (\`id\`, \`email\`, \`password_hash\`, \`role\`, \`status\`, \`name\`, \`email_verified_at\`)
         VALUES (?, ?, ?, 'ADMIN', 'ACTIVE', ?, NOW())`,
        [
          "00000000-0000-7000-8000-000000000001",
          "legacy-phase2@example.com",
          "legacy-hash",
          "Legacy Admin",
        ],
      );

      runDbScript("db:migrate");

      const rows = (await AppDataSource.query(
        `SELECT u.email, p.display_name, r.name
           FROM \`users\` u
           INNER JOIN \`users_profile\` p ON p.user_id = u.id
           INNER JOIN \`model_has_roles\` mr ON mr.model_id = u.id
           INNER JOIN \`roles\` r ON r.id = mr.role_id
          WHERE u.email = ? AND mr.model_type = ?`,
        ["legacy-phase2@example.com", RBAC_MODEL_TYPE],
      )) as Array<{ email: string; display_name: string; name: string }>;

      expect(rows).toEqual([
        {
          email: "legacy-phase2@example.com",
          display_name: "Legacy Admin",
          name: "admin",
        },
      ]);

      const columns = (await AppDataSource.query("SHOW COLUMNS FROM `users`")) as Array<{
        Field: string;
      }>;
      expect(columns.map((column) => column.Field)).not.toContain("role");
    } finally {
      runDbScript("db:migrate");
      await truncateAuthTables();
    }
  });
});

function runDbScript(script: string): void {
  execFileSync("pnpm", ["--filter", "@rumahkodingku-academy/db", script], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "pipe",
  });
}
