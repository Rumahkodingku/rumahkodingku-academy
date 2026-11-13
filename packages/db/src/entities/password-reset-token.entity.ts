import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("password_reset_tokens")
@Index(["tokenHash"], { unique: true })
export class PasswordResetToken extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string | null;

  @Column({ type: "varchar", length: 128, nullable: true })
  fingerprint?: string | null;

  @Column({ name: "expires_at", type: "datetime", precision: 3 })
  expiresAt!: Date;

  @Column({ name: "consumed_at", type: "datetime", precision: 3, nullable: true })
  consumedAt?: Date | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;
}
