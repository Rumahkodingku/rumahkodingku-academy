import { Inject, Injectable } from "@nestjs/common";
import { AuthenticationStorage } from "@nestjs/authentication";
import type { EmailTokenPurpose, EmailTokenRecord, EmailTokenStore } from "@nestjs/authentication";
import { DataSource } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import { DATA_SOURCE } from "../../../infrastructure/database/database.module";

const TABLE_BY_PURPOSE: Record<EmailTokenPurpose, string> = {
  "email-verification": "email_verification_tokens",
  "password-reset": "password_reset_tokens",
};

@Injectable()
export class TypeOrmEmailTokenStore implements EmailTokenStore {
  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ emailTokens: this });
  }

  async saveEmailToken(record: EmailTokenRecord): Promise<void> {
    const table = TABLE_BY_PURPOSE[record.purpose];

    await this.dataSource.transaction(async (manager) => {
      await manager.query(`DELETE FROM \`${table}\` WHERE \`expires_at\` <= ?`, [record.createdAt]);

      const pending = (await manager.query(
        `SELECT \`id\` FROM \`${table}\` WHERE \`user_id\` = ? ORDER BY \`created_at\` ASC`,
        [record.userId],
      )) as Array<{ id: string }>;

      const overflow = pending.length - 4;

      if (overflow > 0) {
        const ids = pending.slice(0, overflow).map((row) => row.id);

        for (const id of ids) {
          await manager.query(`DELETE FROM \`${table}\` WHERE \`id\` = ?`, [id]);
        }
      }

      await manager.query(
        `INSERT INTO \`${table}\` (\`id\`, \`created_at\`, \`user_id\`, \`token_hash\`, \`email\`, \`fingerprint\`, \`expires_at\`) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv7(),
          record.createdAt,
          record.userId,
          record.id,
          record.email,
          record.fingerprint ?? null,
          record.expiresAt,
        ],
      );
    });
  }

  async consumeEmailToken(
    id: string,
    purpose: EmailTokenPurpose,
  ): Promise<EmailTokenRecord | undefined> {
    const table = TABLE_BY_PURPOSE[purpose];

    return this.dataSource.transaction(async (manager) => {
      const rows = (await manager.query(
        `SELECT * FROM \`${table}\` WHERE \`token_hash\` = ? AND \`consumed_at\` IS NULL LIMIT 1 FOR UPDATE`,
        [id],
      )) as Array<{
        id: string;
        user_id: string;
        token_hash: string;
        email: string | null;
        fingerprint: string | null;
        expires_at: Date;
        created_at: Date;
      }>;

      const row = rows[0];

      if (!row?.email) {
        return undefined;
      }

      await manager.query(`DELETE FROM \`${table}\` WHERE \`id\` = ?`, [row.id]);

      return {
        id: row.token_hash,
        purpose,
        userId: row.user_id,
        email: row.email,
        fingerprint: row.fingerprint ?? undefined,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
      };
    });
  }

  async deleteUserEmailTokens(userId: string, purpose: EmailTokenPurpose): Promise<void> {
    const table = TABLE_BY_PURPOSE[purpose];
    await this.dataSource.query(`DELETE FROM \`${table}\` WHERE \`user_id\` = ?`, [userId]);
  }
}
