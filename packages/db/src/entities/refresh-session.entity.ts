import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { RefreshTokenFamily } from "./refresh-token-family.entity";
import { User } from "./user.entity";

@Entity("refresh_sessions")
@Index(["tokenHash"], { unique: true })
@Index(["familyId"])
export class RefreshSession extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ name: "family_id", type: "char", length: 36, nullable: true })
  familyId?: string | null;

  @Column({ name: "expires_at", type: "datetime", precision: 3 })
  expiresAt!: Date;

  @Column({ name: "family_expires_at", type: "datetime", precision: 3, nullable: true })
  familyExpiresAt?: Date | null;

  @Column({ name: "used_at", type: "datetime", precision: 3, nullable: true })
  usedAt?: Date | null;

  @Column({ type: "json", nullable: true })
  claims?: Record<string, unknown> | null;

  @Column({ name: "revoked_at", type: "datetime", precision: 3, nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "device_name", type: "varchar", length: 255, nullable: true })
  deviceName?: string | null;

  @Column({ name: "user_agent", type: "varchar", length: 512, nullable: true })
  userAgent?: string | null;

  @Column({ name: "ip_address", type: "varchar", length: 64, nullable: true })
  ipAddress?: string | null;

  @ManyToOne(() => User, (user) => user.refreshSessions, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => RefreshTokenFamily, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn({ name: "family_id" })
  family?: Relation<RefreshTokenFamily> | null;
}
