import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("refresh_sessions")
@Index(["tokenHash"], { unique: true })
export class RefreshSession extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "datetime" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "datetime", nullable: true })
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
}
