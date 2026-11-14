import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthTimestampPrecision1794535429057 implements MigrationInterface {
  name = "AddAuthTimestampPrecision1794535429057";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` ON \`refresh_token_families\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` CHANGE \`expires_at\` \`expires_at\` datetime(3) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` CHANGE \`revoked_at\` \`revoked_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`expires_at\` \`expires_at\` datetime(3) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`family_expires_at\` \`family_expires_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`used_at\` \`used_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`revoked_at\` \`revoked_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` CHANGE \`expires_at\` \`expires_at\` datetime(3) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` CHANGE \`consumed_at\` \`consumed_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` CHANGE \`expires_at\` \`expires_at\` datetime(3) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` CHANGE \`consumed_at\` \`consumed_at\` datetime(3) NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` ON \`refresh_token_families\` (\`user_id\`, \`revoked_at\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` ON \`refresh_token_families\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` CHANGE \`consumed_at\` \`consumed_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` CHANGE \`expires_at\` \`expires_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` CHANGE \`consumed_at\` \`consumed_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` CHANGE \`expires_at\` \`expires_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`revoked_at\` \`revoked_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`used_at\` \`used_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`family_expires_at\` \`family_expires_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` CHANGE \`expires_at\` \`expires_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` CHANGE \`revoked_at\` \`revoked_at\` datetime(0) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token_families\` CHANGE \`expires_at\` \`expires_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_e049e8b94a0fab44df35d26ecb\` ON \`refresh_token_families\` (\`user_id\`, \`revoked_at\`)`,
    );
  }
}
