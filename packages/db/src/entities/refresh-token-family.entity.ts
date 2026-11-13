import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("refresh_token_families")
@Index(["user"])
@Index(["user", "revokedAt"])
export class RefreshTokenFamily extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "expires_at", type: "datetime" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "datetime", nullable: true })
  revokedAt?: Date | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;
}
