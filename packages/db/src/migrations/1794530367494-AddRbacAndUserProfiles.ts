import type { MigrationInterface, QueryRunner } from "typeorm";
import { v7 as uuidv7 } from "uuid";

export class AddRbacAndUserProfiles1794530367494 implements MigrationInterface {
  name = "AddRbacAndUserProfiles1794530367494";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users_profile\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`display_name\` varchar(100) NOT NULL, \`full_name\` varchar(255) NULL, \`username\` varchar(50) NULL, \`bio\` text NULL, \`headline\` varchar(120) NULL, \`avatar_storage_key\` varchar(512) NULL, \`phone\` varchar(32) NULL, \`country_code\` char(2) NULL, \`city\` varchar(100) NULL, \`timezone\` varchar(64) NULL, \`locale\` varchar(5) NOT NULL DEFAULT 'id', \`website_url\` varchar(512) NULL, \`github_url\` varchar(512) NULL, \`linkedin_url\` varchar(512) NULL, \`x_url\` varchar(512) NULL, \`instagram_url\` varchar(512) NULL, \`email_notifications\` tinyint NOT NULL DEFAULT 1, \`in_app_notifications\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_070157bb83f9a429cd7523261d\` (\`country_code\`), UNIQUE INDEX \`IDX_4a1ea7a18428c8a6b8d553b7c4\` (\`username\`), UNIQUE INDEX \`REL_3b54c423c063e833e0c1d88a1b\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_token_families\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked_at\` datetime NULL, INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` (\`user_id\`, \`revoked_at\`), INDEX \`IDX_cb724d64e7cc9276571acdabeb\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(64) NOT NULL, \`guard_name\` varchar(64) NOT NULL DEFAULT 'api', \`description\` varchar(255) NULL, \`is_default\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_c5640b88586bd722077992f87d\` (\`guard_name\`, \`is_default\`), UNIQUE INDEX \`IDX_b01a9275fe5822842779f38f76\` (\`name\`, \`guard_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(128) NOT NULL, \`guard_name\` varchar(64) NOT NULL DEFAULT 'api', \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_2b0743e414b05ecdb03d2d381d\` (\`name\`, \`guard_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_has_permissions\` (\`role_id\` char(36) NOT NULL, \`permission_id\` char(36) NOT NULL, INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`model_has_roles\` (\`role_id\` char(36) NOT NULL, \`model_type\` varchar(64) NOT NULL, \`model_id\` char(36) NOT NULL, INDEX \`IDX_b6df09bb8d994583c3764793d1\` (\`model_type\`, \`model_id\`), PRIMARY KEY (\`role_id\`, \`model_type\`, \`model_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`model_has_permissions\` (\`permission_id\` char(36) NOT NULL, \`model_type\` varchar(64) NOT NULL, \`model_id\` char(36) NOT NULL, INDEX \`IDX_cb1e8ffd03e2a14ce86f411b0d\` (\`model_type\`, \`model_id\`), PRIMARY KEY (\`permission_id\`, \`model_type\`, \`model_id\`)) ENGINE=InnoDB`,
    );

    const userRoleId = uuidv7();
    const adminRoleId = uuidv7();
    const adminAccessPermissionId = uuidv7();

    await queryRunner.query(
      `INSERT INTO \`roles\` (\`id\`, \`name\`, \`guard_name\`, \`description\`, \`is_default\`) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`,
      [
        userRoleId,
        "user",
        "api",
        "Default role for registered learners",
        true,
        adminRoleId,
        "admin",
        "api",
        "Administrative access",
        false,
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`permissions\` (\`id\`, \`name\`, \`guard_name\`, \`description\`) VALUES (?, ?, ?, ?)`,
      [adminAccessPermissionId, "admin.access", "api", "Access administrative surfaces"],
    );
    await queryRunner.query(
      `INSERT INTO \`role_has_permissions\` (\`role_id\`, \`permission_id\`) VALUES (?, ?)`,
      [adminRoleId, adminAccessPermissionId],
    );

    const existingUsers = (await queryRunner.query(
      `SELECT \`id\`, \`email\`, \`name\`, \`role\`, \`avatar_storage_key\` FROM \`users\``,
    )) as Array<{
      id: string;
      email: string;
      name: string | null;
      role: "USER" | "ADMIN";
      avatar_storage_key: string | null;
    }>;

    for (const user of existingUsers) {
      await queryRunner.query(
        `INSERT INTO \`users_profile\` (\`id\`, \`user_id\`, \`display_name\`, \`avatar_storage_key\`, \`locale\`, \`email_notifications\`, \`in_app_notifications\`) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv7(),
          user.id,
          user.name?.trim() || user.email,
          user.avatar_storage_key,
          "id",
          true,
          true,
        ],
      );
      await queryRunner.query(
        `INSERT INTO \`model_has_roles\` (\`role_id\`, \`model_type\`, \`model_id\`) VALUES (?, ?, ?)`,
        [user.role === "ADMIN" ? adminRoleId : userRoleId, "user", user.id],
      );
    }

    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar_storage_key\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile\``);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` ADD \`family_id\` char(36) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` ADD \`family_expires_at\` datetime NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` ADD \`used_at\` datetime NULL`);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` ADD \`claims\` json NULL`);
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` ADD \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` ADD \`fingerprint\` varchar(128) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` ADD \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` ADD \`fingerprint\` varchar(128) NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f22ad614014a610b9851827b84\` ON \`refresh_sessions\` (\`family_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_profile\` ADD CONSTRAINT \`FK_3b54c423c063e833e0c1d88a1ba\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` ADD CONSTRAINT \`FK_cb724d64e7cc9276571acdabeb5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` ADD CONSTRAINT \`FK_f22ad614014a610b9851827b842\` FOREIGN KEY (\`family_id\`) REFERENCES \`refresh_token_families\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_9135e97d2d840f7dfd6e6649116\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_09ff9df62bd01f8cf45b1b1921a\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`model_has_roles\` ADD CONSTRAINT \`FK_b5dd1765d08875537905531964a\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`model_has_permissions\` ADD CONSTRAINT \`FK_13509c4b6bd22929729065fe962\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`model_has_permissions\` DROP FOREIGN KEY \`FK_13509c4b6bd22929729065fe962\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`model_has_roles\` DROP FOREIGN KEY \`FK_b5dd1765d08875537905531964a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_09ff9df62bd01f8cf45b1b1921a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_9135e97d2d840f7dfd6e6649116\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` DROP FOREIGN KEY \`FK_f22ad614014a610b9851827b842\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` DROP FOREIGN KEY \`FK_cb724d64e7cc9276571acdabeb5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_profile\` DROP FOREIGN KEY \`FK_3b54c423c063e833e0c1d88a1ba\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f22ad614014a610b9851827b84\` ON \`refresh_sessions\``,
    );
    await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` DROP COLUMN \`fingerprint\``);
    await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` DROP COLUMN \`email\``);
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` DROP COLUMN \`fingerprint\``,
    );
    await queryRunner.query(`ALTER TABLE \`email_verification_tokens\` DROP COLUMN \`email\``);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` DROP COLUMN \`claims\``);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` DROP COLUMN \`used_at\``);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` DROP COLUMN \`family_expires_at\``);
    await queryRunner.query(`ALTER TABLE \`refresh_sessions\` DROP COLUMN \`family_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar_storage_key\` varchar(512) NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) NOT NULL DEFAULT ''`);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role\` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER'`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cb1e8ffd03e2a14ce86f411b0d\` ON \`model_has_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`model_has_permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_b6df09bb8d994583c3764793d1\` ON \`model_has_roles\``);
    await queryRunner.query(`DROP TABLE \`model_has_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` ON \`role_has_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`role_has_permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_2b0743e414b05ecdb03d2d381d\` ON \`permissions\``);
    await queryRunner.query(`DROP TABLE \`permissions\``);
    await queryRunner.query(`DROP INDEX \`IDX_b01a9275fe5822842779f38f76\` ON \`roles\``);
    await queryRunner.query(`DROP INDEX \`IDX_c5640b88586bd722077992f87d\` ON \`roles\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_cb724d64e7cc9276571acdabeb\` ON \`refresh_token_families\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` ON \`refresh_token_families\``,
    );
    await queryRunner.query(`DROP TABLE \`refresh_token_families\``);
    await queryRunner.query(`DROP INDEX \`REL_3b54c423c063e833e0c1d88a1b\` ON \`users_profile\``);
    await queryRunner.query(`DROP INDEX \`IDX_4a1ea7a18428c8a6b8d553b7c4\` ON \`users_profile\``);
    await queryRunner.query(`DROP INDEX \`IDX_070157bb83f9a429cd7523261d\` ON \`users_profile\``);
    await queryRunner.query(`DROP TABLE \`users_profile\``);
  }
}
