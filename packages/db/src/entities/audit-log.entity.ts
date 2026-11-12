import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("audit_logs")
@Index(["actor", "action", "createdAt"])
export class AuditLog extends BaseEntity {
  @Column({ name: "actor_user_id", type: "char", length: 36, nullable: true })
  actorUserId?: string | null;

  @Column({ type: "varchar", length: 128 })
  action!: string;

  @Column({ name: "resource_type", type: "varchar", length: 64 })
  resourceType!: string;

  @Column({ name: "resource_id", type: "char", length: 36, nullable: true })
  resourceId?: string | null;

  @Column({ name: "before_metadata", type: "json", nullable: true })
  beforeMetadata?: Record<string, unknown> | null;

  @Column({ name: "after_metadata", type: "json", nullable: true })
  afterMetadata?: Record<string, unknown> | null;

  @Column({ name: "request_id", type: "varchar", length: 128, nullable: true })
  requestId?: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "actor_user_id" })
  actor?: User | null;
}
