import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794486493728 implements MigrationInterface {
  name = "InitialSchema1794486493728";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`refresh_sessions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked_at\` datetime NULL, \`device_name\` varchar(255) NULL, \`user_agent\` varchar(512) NULL, \`ip_address\` varchar(64) NULL, UNIQUE INDEX \`IDX_d76f5941d821678137ef15d965\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`email\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`role\` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER', \`status\` enum ('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE', \`name\` varchar(255) NOT NULL, \`avatar_storage_key\` varchar(512) NULL, \`email_verified_at\` datetime NULL, \`profile\` json NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`email_verification_tokens\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`consumed_at\` datetime NULL, UNIQUE INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`password_reset_tokens\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`consumed_at\` datetime NULL, UNIQUE INDEX \`IDX_91185d86d5d7557b19abbb2868\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lessons\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`section_id\` char(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`content_type\` enum ('YOUTUBE_VIDEO', 'RICH_TEXT') NOT NULL, \`video_reference\` varchar(512) NULL, \`rich_text_body\` longtext NULL, \`duration_minutes\` int NOT NULL DEFAULT '0', \`required\` tinyint NOT NULL DEFAULT 1, \`preview\` tinyint NOT NULL DEFAULT 0, \`position\` int NOT NULL DEFAULT '0', \`status\` enum ('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT', UNIQUE INDEX \`IDX_6027570fdcb789b3f4e6a7e78d\` (\`section_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`course_sections\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`course_id\` char(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`position\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_838165371707a5e0ca71f5dc0d\` (\`course_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`courses\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`short_description\` varchar(500) NULL, \`description\` text NULL, \`thumbnail_storage_key\` varchar(512) NULL, \`banner_storage_key\` varchar(512) NULL, \`difficulty\` enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER', \`language\` varchar(16) NOT NULL DEFAULT 'id', \`estimated_duration_minutes\` int NOT NULL DEFAULT '0', \`learning_outcomes\` json NULL, \`prerequisites\` json NULL, \`instructor_name\` varchar(255) NULL, \`instructor_bio\` text NULL, \`instructor_avatar_storage_key\` varchar(512) NULL, \`price\` int NOT NULL DEFAULT '0', \`discount_price\` int NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'IDR', \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', \`featured\` tinyint NOT NULL DEFAULT 0, \`completion_policy\` json NULL, \`final_project_enabled\` tinyint NOT NULL DEFAULT 0, \`final_project_files_enabled\` tinyint NOT NULL DEFAULT 0, \`published_at\` datetime NULL, UNIQUE INDEX \`IDX_a3bb2d01cfa0f95bc5e034e1b7\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` text NULL, \`position\` int NOT NULL DEFAULT '0', \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_items\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`order_id\` char(36) NOT NULL, \`course_id\` char(36) NULL, \`course_title\` varchar(255) NOT NULL, \`unit_price\` int NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', INDEX \`IDX_ab4aa72a3af9744a35d11d4eb8\` (\`order_id\`, \`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payments\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`order_id\` char(36) NOT NULL, \`provider\` varchar(64) NOT NULL, \`provider_reference\` varchar(255) NOT NULL, \`method\` varchar(64) NOT NULL, \`status\` enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING', \`amount\` int NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'IDR', \`paid_at\` datetime NULL, \`expired_at\` datetime NULL, \`raw_metadata_key\` varchar(512) NULL, UNIQUE INDEX \`IDX_4f23ec78802f18963f584dbac6\` (\`provider\`, \`provider_reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refund_requests\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`order_id\` char(36) NOT NULL, \`payment_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`reason\` text NOT NULL, \`evidence\` json NULL, \`amount\` int NOT NULL, \`status\` enum ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'SUCCEEDED', 'FAILED') NOT NULL DEFAULT 'REQUESTED', \`reviewer_id\` char(36) NULL, \`decision_reason\` text NULL, \`provider_reference\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`orders\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`order_number\` varchar(64) NOT NULL, \`status\` enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING', \`currency\` varchar(3) NOT NULL DEFAULT 'IDR', \`subtotal\` int NOT NULL DEFAULT '0', \`discount_total\` int NOT NULL DEFAULT '0', \`coupon_code\` varchar(64) NULL, \`total\` int NOT NULL DEFAULT '0', \`idempotency_key\` varchar(128) NULL, UNIQUE INDEX \`IDX_75eba1c6b1a66b09f2a97e6927\` (\`order_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment_webhook_events\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`provider\` varchar(64) NOT NULL, \`provider_event_id\` varchar(255) NOT NULL, \`payload_hash\` varchar(128) NOT NULL, \`processing_state\` enum ('RECEIVED', 'PROCESSED', 'FAILED') NOT NULL DEFAULT 'RECEIVED', \`processed_at\` datetime NULL, \`error_metadata\` json NULL, UNIQUE INDEX \`IDX_fe716618e28a78e3dc8d8cc723\` (\`provider\`, \`provider_event_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`coupons\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`code\` varchar(64) NOT NULL, \`type\` enum ('PERCENTAGE', 'FIXED') NOT NULL, \`value\` int NOT NULL, \`maximum_discount\` int NULL, \`minimum_purchase\` int NOT NULL DEFAULT '0', \`starts_at\` datetime NULL, \`expires_at\` datetime NULL, \`global_limit\` int NOT NULL DEFAULT '0', \`per_user_limit\` int NOT NULL DEFAULT '1', \`active\` tinyint NOT NULL DEFAULT 1, \`eligible_course_ids\` json NULL, UNIQUE INDEX \`IDX_e025109230e82925843f2a14c4\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`coupon_redemptions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`coupon_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`order_id\` char(36) NOT NULL, \`redeemed_amount\` int NOT NULL, UNIQUE INDEX \`IDX_adb70aa4959d5b2676fa4fde83\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`enrollments\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, \`source\` enum ('PURCHASE', 'FREE', 'ADMIN_GRANT') NOT NULL, \`source_order_id\` char(36) NULL, \`source_reference\` varchar(255) NULL, \`granted_by\` char(36) NULL, \`reason\` text NULL, \`status\` enum ('ACTIVE', 'SUSPENDED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE', UNIQUE INDEX \`IDX_647c6bda9ead37b702421710fd\` (\`user_id\`, \`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lesson_progress\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`lesson_id\` char(36) NOT NULL, \`status\` enum ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED', \`completed_at\` datetime NULL, UNIQUE INDEX \`IDX_f34e3a227170e0ce674e0afb58\` (\`user_id\`, \`lesson_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quiz_options\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`question_id\` char(36) NOT NULL, \`label\` text NOT NULL, \`is_correct\` tinyint NOT NULL DEFAULT 0, \`position\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_057112c0404193e08e18db6e7f\` (\`question_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quiz_questions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`quiz_id\` char(36) NOT NULL, \`type\` enum ('MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER') NOT NULL, \`prompt\` text NOT NULL, \`explanation\` text NULL, \`position\` int NOT NULL DEFAULT '0', \`points\` int NOT NULL DEFAULT '1', \`normalized_answer_key\` varchar(512) NULL, UNIQUE INDEX \`IDX_a125b628c173c06291a646affb\` (\`quiz_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quiz_answers\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`attempt_id\` char(36) NOT NULL, \`question_id\` char(36) NOT NULL, \`selected_option_ids\` json NULL, \`short_answer_text\` text NULL, \`awarded_points\` int NOT NULL DEFAULT '0', \`is_correct\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_ac615105e07af5d9814b075c38\` (\`attempt_id\`, \`question_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quiz_attempts\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`quiz_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`attempt_number\` int NOT NULL, \`started_at\` datetime NOT NULL, \`submitted_at\` datetime NULL, \`score\` int NOT NULL DEFAULT '0', \`passed\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROGRESS', UNIQUE INDEX \`IDX_a12e8cb6e1d7dbd0e471cf769d\` (\`quiz_id\`, \`user_id\`, \`attempt_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quizzes\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`course_id\` char(36) NOT NULL, \`lesson_id\` char(36) NULL, \`section_id\` char(36) NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`pass_score\` int NOT NULL DEFAULT '70', \`time_limit_minutes\` int NULL, \`attempt_limit\` int NOT NULL DEFAULT '3', \`randomize_questions\` tinyint NOT NULL DEFAULT 0, \`randomize_options\` tinyint NOT NULL DEFAULT 0, \`answer_reveal\` enum ('NEVER', 'AFTER_SUBMISSION', 'AFTER_PASS') NOT NULL DEFAULT 'AFTER_SUBMISSION', \`required\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', CONSTRAINT \`CK_quizzes_lesson_or_section\` CHECK ((\`lesson_id\` IS NULL) <> (\`section_id\` IS NULL)), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roadmap_courses\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`roadmap_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, \`position\` int NOT NULL, UNIQUE INDEX \`IDX_80bf9ab9b569a8a0c7011f7f12\` (\`roadmap_id\`, \`course_id\`), UNIQUE INDEX \`IDX_7f54ac0f726351d631f9a99f2c\` (\`roadmap_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roadmaps\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`thumbnail_storage_key\` varchar(512) NULL, \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', UNIQUE INDEX \`IDX_c0bf076764c15eeaf8c288e84f\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_rubric_criteria\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`final_project_id\` char(36) NOT NULL, \`label\` varchar(255) NOT NULL, \`weight\` int NOT NULL, \`position\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_992d33a4b1d51f68100cfbb693\` (\`final_project_id\`, \`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`submission_files\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`submission_id\` char(36) NOT NULL, \`storage_key\` varchar(512) NOT NULL, \`display_filename\` varchar(255) NOT NULL, \`mime_type\` varchar(128) NOT NULL, \`extension\` varchar(32) NOT NULL, \`byte_size\` int NOT NULL, \`checksum\` varchar(128) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`submission_scores\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`submission_id\` char(36) NOT NULL, \`criterion_id\` char(36) NOT NULL, \`score\` int NOT NULL, \`reviewer_id\` char(36) NOT NULL, UNIQUE INDEX \`IDX_44021d3ee01a380a7796883fde\` (\`submission_id\`, \`criterion_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_submissions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`final_project_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`version\` int NOT NULL, \`github_url\` varchar(512) NOT NULL, \`deployment_url\` varchar(512) NOT NULL, \`description\` text NULL, \`notes\` text NULL, \`status\` enum ('SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUIRED', 'APPROVED') NOT NULL DEFAULT 'SUBMITTED', \`reviewer_id\` char(36) NULL, \`feedback\` text NULL, \`reviewed_at\` datetime NULL, UNIQUE INDEX \`IDX_38c6eb50925688f56ba927b8a1\` (\`final_project_id\`, \`user_id\`, \`version\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`final_projects\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`course_id\` char(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`instructions\` text NULL, \`requirements\` text NULL, \`submission_guide\` text NULL, \`deadline_at\` datetime NULL, \`minimum_score\` int NOT NULL DEFAULT '0', \`files_enabled\` tinyint NOT NULL DEFAULT 0, \`enabled\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`REL_9eb92c831d830bfd8a698c13ef\` (\`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`certificates\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`enrollment_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, \`number\` varchar(64) NOT NULL, \`verification_code\` varchar(64) NOT NULL, \`issuer\` varchar(255) NOT NULL, \`issued_at\` datetime NOT NULL, \`status\` enum ('ISSUED', 'REVOKED') NOT NULL DEFAULT 'ISSUED', \`revoked_at\` datetime NULL, \`revoke_reason\` text NULL, \`reissued_from_certificate_id\` char(36) NULL, \`pdf_storage_key\` varchar(512) NULL, \`active_enrollment_id\` char(36) NULL, UNIQUE INDEX \`IDX_8b379f595aea96c9406c5a4490\` (\`number\`), UNIQUE INDEX \`IDX_b8da93b1f21f3ab2f62cf685f2\` (\`verification_code\`), UNIQUE INDEX \`IDX_10e2a139f089303ec03c3d1f58\` (\`active_enrollment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`discussion_replies\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`topic_id\` char(36) NOT NULL, \`author_id\` char(36) NOT NULL, \`body\` text NOT NULL, \`moderation_state\` enum ('VISIBLE', 'HIDDEN', 'REMOVED') NOT NULL DEFAULT 'VISIBLE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`discussion_topics\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`course_id\` char(36) NOT NULL, \`author_id\` char(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`pinned\` tinyint NOT NULL DEFAULT 0, \`locked\` tinyint NOT NULL DEFAULT 0, \`moderation_state\` enum ('VISIBLE', 'HIDDEN', 'REMOVED') NOT NULL DEFAULT 'VISIBLE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lesson_answers\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`question_id\` char(36) NOT NULL, \`author_id\` char(36) NOT NULL, \`body\` text NOT NULL, \`accepted\` tinyint NOT NULL DEFAULT 0, \`moderation_state\` enum ('VISIBLE', 'HIDDEN', 'REMOVED') NOT NULL DEFAULT 'VISIBLE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lesson_questions\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`lesson_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, \`author_id\` char(36) NOT NULL, \`body\` text NOT NULL, \`accepted_answer_id\` char(36) NULL, \`moderation_state\` enum ('VISIBLE', 'HIDDEN', 'REMOVED') NOT NULL DEFAULT 'VISIBLE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`content_reports\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`reporter_id\` char(36) NOT NULL, \`resource_type\` varchar(64) NOT NULL, \`resource_id\` char(36) NOT NULL, \`reason\` text NOT NULL, \`status\` enum ('OPEN', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'OPEN', \`moderator_id\` char(36) NULL, \`resolution\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`course_reviews\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`enrollment_id\` char(36) NOT NULL, \`user_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, \`rating\` int NOT NULL, \`body\` text NULL, \`status\` enum ('PENDING', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'PENDING', \`moderated_by\` char(36) NULL, UNIQUE INDEX \`IDX_8c312efd27cfaf67af7a94c983\` (\`enrollment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`wishlists\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`course_id\` char(36) NOT NULL, UNIQUE INDEX \`IDX_e572b039c52c60db4fbeeab418\` (\`user_id\`, \`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` char(36) NOT NULL, \`type\` varchar(64) NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`resource_type\` varchar(64) NULL, \`resource_id\` char(36) NULL, \`read_at\` datetime NULL, INDEX \`IDX_2affd92afb4d9b86f1c2211530\` (\`user_id\`, \`read_at\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification_outbox\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`event_type\` varchar(128) NOT NULL, \`recipient_user_id\` char(36) NULL, \`recipient_email\` varchar(255) NULL, \`payload\` json NOT NULL, \`status\` enum ('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING', \`attempts\` int NOT NULL DEFAULT '0', \`next_attempt_at\` datetime NULL, \`sent_at\` datetime NULL, \`error_message\` text NULL, INDEX \`IDX_936c616ab46210ea7fa275d052\` (\`status\`, \`next_attempt_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`announcements\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`audience\` enum ('PUBLIC', 'USER', 'ADMIN') NOT NULL DEFAULT 'USER', \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', \`starts_at\` datetime NULL, \`expires_at\` datetime NULL, \`author_id\` char(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`platform_settings\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`key\` varchar(128) NOT NULL, \`value\` text NOT NULL, \`description\` text NULL, \`updated_by\` char(36) NULL, UNIQUE INDEX \`IDX_5d9031e30fac3ec3ec8b9602e1\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`audit_logs\` (\`id\` char(36) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`actor_user_id\` char(36) NULL, \`action\` varchar(128) NOT NULL, \`resource_type\` varchar(64) NOT NULL, \`resource_id\` char(36) NULL, \`before_metadata\` json NULL, \`after_metadata\` json NULL, \`request_id\` varchar(128) NULL, INDEX \`IDX_15ac17ebaf362b36170ed0cc24\` (\`actor_user_id\`, \`action\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`course_categories\` (\`course_id\` char(36) NOT NULL, \`category_id\` char(36) NOT NULL, INDEX \`IDX_c961c57e9f869094eebab0d547\` (\`course_id\`), INDEX \`IDX_53c2e5fe2bb1ba3c21deac6a98\` (\`category_id\`), PRIMARY KEY (\`course_id\`, \`category_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` ADD CONSTRAINT \`FK_a7ab4fd82c654c85b9de53d971a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` ADD CONSTRAINT \`FK_fdcb77f72f529bf65c95d72a147\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` ADD CONSTRAINT \`FK_52ac39dd8a28730c63aeb428c9c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lessons\` ADD CONSTRAINT \`FK_19261e484ffd22b40ea596ece4d\` FOREIGN KEY (\`section_id\`) REFERENCES \`course_sections\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_sections\` ADD CONSTRAINT \`FK_348f9a7c13a6b413f10d2a1ef1a\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_72050220d9ee042049b15d35e31\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_b2f7b823a21562eeca20e72b006\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` ADD CONSTRAINT \`FK_41ecc6daf51bf70bb55597e2f03\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` ADD CONSTRAINT \`FK_6cffffc4e01e1e212c3538f40e0\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` ADD CONSTRAINT \`FK_228d14156b20be394872d6c3aaa\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` ADD CONSTRAINT \`FK_763a6fabbaf846e9b858dfaa9ef\` FOREIGN KEY (\`reviewer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` ADD CONSTRAINT \`FK_9df1b9bc48e3eea5da3762f8e56\` FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupons\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` ADD CONSTRAINT \`FK_986f8dd830915cf2835f89709df\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` ADD CONSTRAINT \`FK_adb70aa4959d5b2676fa4fde836\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_ff997f5a39cd24a491b9aca45c9\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_b79d0bf01779fdf9cfb6b092af3\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_0d9292b3eb40707950eeeba9617\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_980e74721039ebe210fee2eeca2\` FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_options\` ADD CONSTRAINT \`FK_2aa44934a4602aef1ede068f4a7\` FOREIGN KEY (\`question_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_14c6d2b8f5be0bdb406a3895bb4\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_answers\` ADD CONSTRAINT \`FK_6fe76f6b4d4953d99e1672d1084\` FOREIGN KEY (\`attempt_id\`) REFERENCES \`quiz_attempts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_answers\` ADD CONSTRAINT \`FK_fbe5e1758631924a83c73b521d9\` FOREIGN KEY (\`question_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_a720e260138b64fcff2fca19b2d\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_1701aaf48f6a78e96bfe08dd395\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_e460dcb813c2cc28c93c95f2504\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_2cf4e4b5b533af8dc6b38d4fa9b\` FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_09653811f5a4b031bec737a85a4\` FOREIGN KEY (\`section_id\`) REFERENCES \`course_sections\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roadmap_courses\` ADD CONSTRAINT \`FK_3449413b07821bbd50a2efed866\` FOREIGN KEY (\`roadmap_id\`) REFERENCES \`roadmaps\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roadmap_courses\` ADD CONSTRAINT \`FK_e6dc3c2565a9641e1da0fc0beee\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_rubric_criteria\` ADD CONSTRAINT \`FK_7face5320b0015f85691d250c3f\` FOREIGN KEY (\`final_project_id\`) REFERENCES \`final_projects\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_files\` ADD CONSTRAINT \`FK_2922aa3bbea583473e9b510618c\` FOREIGN KEY (\`submission_id\`) REFERENCES \`project_submissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` ADD CONSTRAINT \`FK_60b6432533ce75c224598af6bf5\` FOREIGN KEY (\`submission_id\`) REFERENCES \`project_submissions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` ADD CONSTRAINT \`FK_55cd3bf418851799a974b6b84ae\` FOREIGN KEY (\`criterion_id\`) REFERENCES \`project_rubric_criteria\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` ADD CONSTRAINT \`FK_7a1bb4cff0b1b9bdebec5c42866\` FOREIGN KEY (\`reviewer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` ADD CONSTRAINT \`FK_d75e9aa8f2c3a70cc3db5c5f2a2\` FOREIGN KEY (\`final_project_id\`) REFERENCES \`final_projects\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` ADD CONSTRAINT \`FK_3bc833788946ed9431caeac95db\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` ADD CONSTRAINT \`FK_fb0183b6eaeca68cc06f8b3ed00\` FOREIGN KEY (\`reviewer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`final_projects\` ADD CONSTRAINT \`FK_9eb92c831d830bfd8a698c13efa\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_f0f3773b2ccb7811da9ccd63d94\` FOREIGN KEY (\`enrollment_id\`) REFERENCES \`enrollments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_88f90b1b9c635c14271e509cec0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_3b6a412073ea28153dc20a843b4\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_replies\` ADD CONSTRAINT \`FK_acb586600d4215f3b89e057e9de\` FOREIGN KEY (\`topic_id\`) REFERENCES \`discussion_topics\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_replies\` ADD CONSTRAINT \`FK_58982359a1aa87d51e829beaaca\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_topics\` ADD CONSTRAINT \`FK_5aae82ac8a2e72c2fa102ac24f0\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_topics\` ADD CONSTRAINT \`FK_d3312505bfd5b2e13a3a966fc47\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_answers\` ADD CONSTRAINT \`FK_a19c859cc8e6577ad5d5170a446\` FOREIGN KEY (\`question_id\`) REFERENCES \`lesson_questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_answers\` ADD CONSTRAINT \`FK_b701230709c5928ade9bade6816\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` ADD CONSTRAINT \`FK_789d67e873abc1c4aa1347627ad\` FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` ADD CONSTRAINT \`FK_59ecb08f1642a4e1bceaa7fb491\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` ADD CONSTRAINT \`FK_649939c87d4b9104d5eebf73651\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`content_reports\` ADD CONSTRAINT \`FK_0aababfebc5662624a4a66b639b\` FOREIGN KEY (\`reporter_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`content_reports\` ADD CONSTRAINT \`FK_98407cb7a2b3be9050a75d48ad6\` FOREIGN KEY (\`moderator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` ADD CONSTRAINT \`FK_8c312efd27cfaf67af7a94c9839\` FOREIGN KEY (\`enrollment_id\`) REFERENCES \`enrollments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` ADD CONSTRAINT \`FK_4f144342761fa0c6c3f129da76c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` ADD CONSTRAINT \`FK_1f69fdcbd7ea5f0e52c3230c00b\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` ADD CONSTRAINT \`FK_768810b87ad638d612b3e9fe3e6\` FOREIGN KEY (\`moderated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_b5e6331a1a7d61c25d7a25cab8f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wishlists\` ADD CONSTRAINT \`FK_e75b95de9990fc2ef8ee1f402bf\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_outbox\` ADD CONSTRAINT \`FK_a6802aba2db87fc757a8abe42a1\` FOREIGN KEY (\`recipient_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcements\` ADD CONSTRAINT \`FK_0a13cf0aa1f1a2666699ff473f0\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`platform_settings\` ADD CONSTRAINT \`FK_62e70f824fccd12d37b7fe11b01\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`audit_logs\` ADD CONSTRAINT \`FK_f160d97a931844109de9d04228f\` FOREIGN KEY (\`actor_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_categories\` ADD CONSTRAINT \`FK_c961c57e9f869094eebab0d547d\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_categories\` ADD CONSTRAINT \`FK_53c2e5fe2bb1ba3c21deac6a986\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`course_categories\` DROP FOREIGN KEY \`FK_53c2e5fe2bb1ba3c21deac6a986\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_categories\` DROP FOREIGN KEY \`FK_c961c57e9f869094eebab0d547d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`audit_logs\` DROP FOREIGN KEY \`FK_f160d97a931844109de9d04228f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`platform_settings\` DROP FOREIGN KEY \`FK_62e70f824fccd12d37b7fe11b01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcements\` DROP FOREIGN KEY \`FK_0a13cf0aa1f1a2666699ff473f0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_outbox\` DROP FOREIGN KEY \`FK_a6802aba2db87fc757a8abe42a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_e75b95de9990fc2ef8ee1f402bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wishlists\` DROP FOREIGN KEY \`FK_b5e6331a1a7d61c25d7a25cab8f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` DROP FOREIGN KEY \`FK_768810b87ad638d612b3e9fe3e6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` DROP FOREIGN KEY \`FK_1f69fdcbd7ea5f0e52c3230c00b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` DROP FOREIGN KEY \`FK_4f144342761fa0c6c3f129da76c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_reviews\` DROP FOREIGN KEY \`FK_8c312efd27cfaf67af7a94c9839\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`content_reports\` DROP FOREIGN KEY \`FK_98407cb7a2b3be9050a75d48ad6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`content_reports\` DROP FOREIGN KEY \`FK_0aababfebc5662624a4a66b639b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` DROP FOREIGN KEY \`FK_649939c87d4b9104d5eebf73651\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` DROP FOREIGN KEY \`FK_59ecb08f1642a4e1bceaa7fb491\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_questions\` DROP FOREIGN KEY \`FK_789d67e873abc1c4aa1347627ad\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_answers\` DROP FOREIGN KEY \`FK_b701230709c5928ade9bade6816\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_answers\` DROP FOREIGN KEY \`FK_a19c859cc8e6577ad5d5170a446\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_topics\` DROP FOREIGN KEY \`FK_d3312505bfd5b2e13a3a966fc47\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_topics\` DROP FOREIGN KEY \`FK_5aae82ac8a2e72c2fa102ac24f0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_replies\` DROP FOREIGN KEY \`FK_58982359a1aa87d51e829beaaca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`discussion_replies\` DROP FOREIGN KEY \`FK_acb586600d4215f3b89e057e9de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_3b6a412073ea28153dc20a843b4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_88f90b1b9c635c14271e509cec0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_f0f3773b2ccb7811da9ccd63d94\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`final_projects\` DROP FOREIGN KEY \`FK_9eb92c831d830bfd8a698c13efa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` DROP FOREIGN KEY \`FK_fb0183b6eaeca68cc06f8b3ed00\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` DROP FOREIGN KEY \`FK_3bc833788946ed9431caeac95db\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_submissions\` DROP FOREIGN KEY \`FK_d75e9aa8f2c3a70cc3db5c5f2a2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` DROP FOREIGN KEY \`FK_7a1bb4cff0b1b9bdebec5c42866\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` DROP FOREIGN KEY \`FK_55cd3bf418851799a974b6b84ae\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_scores\` DROP FOREIGN KEY \`FK_60b6432533ce75c224598af6bf5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submission_files\` DROP FOREIGN KEY \`FK_2922aa3bbea583473e9b510618c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_rubric_criteria\` DROP FOREIGN KEY \`FK_7face5320b0015f85691d250c3f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roadmap_courses\` DROP FOREIGN KEY \`FK_e6dc3c2565a9641e1da0fc0beee\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roadmap_courses\` DROP FOREIGN KEY \`FK_3449413b07821bbd50a2efed866\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_09653811f5a4b031bec737a85a4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_2cf4e4b5b533af8dc6b38d4fa9b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_e460dcb813c2cc28c93c95f2504\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_1701aaf48f6a78e96bfe08dd395\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_a720e260138b64fcff2fca19b2d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_answers\` DROP FOREIGN KEY \`FK_fbe5e1758631924a83c73b521d9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_answers\` DROP FOREIGN KEY \`FK_6fe76f6b4d4953d99e1672d1084\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_14c6d2b8f5be0bdb406a3895bb4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`quiz_options\` DROP FOREIGN KEY \`FK_2aa44934a4602aef1ede068f4a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_980e74721039ebe210fee2eeca2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_0d9292b3eb40707950eeeba9617\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_b79d0bf01779fdf9cfb6b092af3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_ff997f5a39cd24a491b9aca45c9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` DROP FOREIGN KEY \`FK_adb70aa4959d5b2676fa4fde836\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` DROP FOREIGN KEY \`FK_986f8dd830915cf2835f89709df\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`coupon_redemptions\` DROP FOREIGN KEY \`FK_9df1b9bc48e3eea5da3762f8e56\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` DROP FOREIGN KEY \`FK_763a6fabbaf846e9b858dfaa9ef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` DROP FOREIGN KEY \`FK_228d14156b20be394872d6c3aaa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` DROP FOREIGN KEY \`FK_6cffffc4e01e1e212c3538f40e0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refund_requests\` DROP FOREIGN KEY \`FK_41ecc6daf51bf70bb55597e2f03\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_b2f7b823a21562eeca20e72b006\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_72050220d9ee042049b15d35e31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course_sections\` DROP FOREIGN KEY \`FK_348f9a7c13a6b413f10d2a1ef1a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lessons\` DROP FOREIGN KEY \`FK_19261e484ffd22b40ea596ece4d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`password_reset_tokens\` DROP FOREIGN KEY \`FK_52ac39dd8a28730c63aeb428c9c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`email_verification_tokens\` DROP FOREIGN KEY \`FK_fdcb77f72f529bf65c95d72a147\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` DROP FOREIGN KEY \`FK_a7ab4fd82c654c85b9de53d971a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_53c2e5fe2bb1ba3c21deac6a98\` ON \`course_categories\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c961c57e9f869094eebab0d547\` ON \`course_categories\``,
    );
    await queryRunner.query(`DROP TABLE \`course_categories\``);
    await queryRunner.query(`DROP INDEX \`IDX_15ac17ebaf362b36170ed0cc24\` ON \`audit_logs\``);
    await queryRunner.query(`DROP TABLE \`audit_logs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_5d9031e30fac3ec3ec8b9602e1\` ON \`platform_settings\``,
    );
    await queryRunner.query(`DROP TABLE \`platform_settings\``);
    await queryRunner.query(`DROP TABLE \`announcements\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_936c616ab46210ea7fa275d052\` ON \`notification_outbox\``,
    );
    await queryRunner.query(`DROP TABLE \`notification_outbox\``);
    await queryRunner.query(`DROP INDEX \`IDX_2affd92afb4d9b86f1c2211530\` ON \`notifications\``);
    await queryRunner.query(`DROP TABLE \`notifications\``);
    await queryRunner.query(`DROP INDEX \`IDX_e572b039c52c60db4fbeeab418\` ON \`wishlists\``);
    await queryRunner.query(`DROP TABLE \`wishlists\``);
    await queryRunner.query(`DROP INDEX \`IDX_8c312efd27cfaf67af7a94c983\` ON \`course_reviews\``);
    await queryRunner.query(`DROP TABLE \`course_reviews\``);
    await queryRunner.query(`DROP TABLE \`content_reports\``);
    await queryRunner.query(`DROP TABLE \`lesson_questions\``);
    await queryRunner.query(`DROP TABLE \`lesson_answers\``);
    await queryRunner.query(`DROP TABLE \`discussion_topics\``);
    await queryRunner.query(`DROP TABLE \`discussion_replies\``);
    await queryRunner.query(`DROP INDEX \`IDX_10e2a139f089303ec03c3d1f58\` ON \`certificates\``);
    await queryRunner.query(`DROP INDEX \`IDX_b8da93b1f21f3ab2f62cf685f2\` ON \`certificates\``);
    await queryRunner.query(`DROP INDEX \`IDX_8b379f595aea96c9406c5a4490\` ON \`certificates\``);
    await queryRunner.query(`DROP TABLE \`certificates\``);
    await queryRunner.query(`DROP INDEX \`REL_9eb92c831d830bfd8a698c13ef\` ON \`final_projects\``);
    await queryRunner.query(`DROP TABLE \`final_projects\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_38c6eb50925688f56ba927b8a1\` ON \`project_submissions\``,
    );
    await queryRunner.query(`DROP TABLE \`project_submissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_44021d3ee01a380a7796883fde\` ON \`submission_scores\``,
    );
    await queryRunner.query(`DROP TABLE \`submission_scores\``);
    await queryRunner.query(`DROP TABLE \`submission_files\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_992d33a4b1d51f68100cfbb693\` ON \`project_rubric_criteria\``,
    );
    await queryRunner.query(`DROP TABLE \`project_rubric_criteria\``);
    await queryRunner.query(`DROP INDEX \`IDX_c0bf076764c15eeaf8c288e84f\` ON \`roadmaps\``);
    await queryRunner.query(`DROP TABLE \`roadmaps\``);
    await queryRunner.query(`DROP INDEX \`IDX_7f54ac0f726351d631f9a99f2c\` ON \`roadmap_courses\``);
    await queryRunner.query(`DROP INDEX \`IDX_80bf9ab9b569a8a0c7011f7f12\` ON \`roadmap_courses\``);
    await queryRunner.query(`DROP TABLE \`roadmap_courses\``);
    await queryRunner.query(`DROP TABLE \`quizzes\``);
    await queryRunner.query(`DROP INDEX \`IDX_a12e8cb6e1d7dbd0e471cf769d\` ON \`quiz_attempts\``);
    await queryRunner.query(`DROP TABLE \`quiz_attempts\``);
    await queryRunner.query(`DROP INDEX \`IDX_ac615105e07af5d9814b075c38\` ON \`quiz_answers\``);
    await queryRunner.query(`DROP TABLE \`quiz_answers\``);
    await queryRunner.query(`DROP INDEX \`IDX_a125b628c173c06291a646affb\` ON \`quiz_questions\``);
    await queryRunner.query(`DROP TABLE \`quiz_questions\``);
    await queryRunner.query(`DROP INDEX \`IDX_057112c0404193e08e18db6e7f\` ON \`quiz_options\``);
    await queryRunner.query(`DROP TABLE \`quiz_options\``);
    await queryRunner.query(`DROP INDEX \`IDX_f34e3a227170e0ce674e0afb58\` ON \`lesson_progress\``);
    await queryRunner.query(`DROP TABLE \`lesson_progress\``);
    await queryRunner.query(`DROP INDEX \`IDX_647c6bda9ead37b702421710fd\` ON \`enrollments\``);
    await queryRunner.query(`DROP TABLE \`enrollments\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_adb70aa4959d5b2676fa4fde83\` ON \`coupon_redemptions\``,
    );
    await queryRunner.query(`DROP TABLE \`coupon_redemptions\``);
    await queryRunner.query(`DROP INDEX \`IDX_e025109230e82925843f2a14c4\` ON \`coupons\``);
    await queryRunner.query(`DROP TABLE \`coupons\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe716618e28a78e3dc8d8cc723\` ON \`payment_webhook_events\``,
    );
    await queryRunner.query(`DROP TABLE \`payment_webhook_events\``);
    await queryRunner.query(`DROP INDEX \`IDX_75eba1c6b1a66b09f2a97e6927\` ON \`orders\``);
    await queryRunner.query(`DROP TABLE \`orders\``);
    await queryRunner.query(`DROP TABLE \`refund_requests\``);
    await queryRunner.query(`DROP INDEX \`IDX_4f23ec78802f18963f584dbac6\` ON \`payments\``);
    await queryRunner.query(`DROP TABLE \`payments\``);
    await queryRunner.query(`DROP INDEX \`IDX_ab4aa72a3af9744a35d11d4eb8\` ON \`order_items\``);
    await queryRunner.query(`DROP TABLE \`order_items\``);
    await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP INDEX \`IDX_a3bb2d01cfa0f95bc5e034e1b7\` ON \`courses\``);
    await queryRunner.query(`DROP TABLE \`courses\``);
    await queryRunner.query(`DROP INDEX \`IDX_838165371707a5e0ca71f5dc0d\` ON \`course_sections\``);
    await queryRunner.query(`DROP TABLE \`course_sections\``);
    await queryRunner.query(`DROP INDEX \`IDX_6027570fdcb789b3f4e6a7e78d\` ON \`lessons\``);
    await queryRunner.query(`DROP TABLE \`lessons\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_91185d86d5d7557b19abbb2868\` ON \`password_reset_tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` ON \`email_verification_tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`email_verification_tokens\``);
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d76f5941d821678137ef15d965\` ON \`refresh_sessions\``,
    );
    await queryRunner.query(`DROP TABLE \`refresh_sessions\``);
  }
}
