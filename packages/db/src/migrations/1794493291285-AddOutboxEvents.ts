import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddOutboxEvents1794493291285 implements MigrationInterface {
  name = "AddOutboxEvents1794493291285";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`outbox_events\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`event_type\` varchar(128) NOT NULL, \`event_version\` int NOT NULL DEFAULT '1', \`aggregate_type\` varchar(64) NULL, \`aggregate_id\` char(36) NULL, \`payload\` json NOT NULL, \`status\` enum ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'DEAD') NOT NULL DEFAULT 'PENDING', \`attempts\` int NOT NULL DEFAULT '0', \`available_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`published_at\` datetime NULL, \`last_error\` text NULL, INDEX \`IDX_86b43fda98c6228febcbd37f17\` (\`aggregate_type\`, \`aggregate_id\`), INDEX \`IDX_6386ea4d00463337e4d9e50305\` (\`status\`, \`available_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_6386ea4d00463337e4d9e50305\` ON \`outbox_events\``);
    await queryRunner.query(`DROP INDEX \`IDX_86b43fda98c6228febcbd37f17\` ON \`outbox_events\``);
    await queryRunner.query(`DROP TABLE \`outbox_events\``);
  }
}
