import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

export enum ContentReportStatus {
  Open = "OPEN",
  Resolved = "RESOLVED",
  Dismissed = "DISMISSED",
}

@Entity("content_reports")
export class ContentReport extends BaseEntity {
  @Column({ name: "reporter_id", type: "char", length: 36 })
  reporterId!: string;

  @Column({ name: "resource_type", type: "varchar", length: 64 })
  resourceType!: string;

  @Column({ name: "resource_id", type: "char", length: 36 })
  resourceId!: string;

  @Column({ type: "text" })
  reason!: string;

  @Column({ type: "enum", enum: ContentReportStatus, default: ContentReportStatus.Open })
  status!: ContentReportStatus;

  @Column({ name: "moderator_id", type: "char", length: 36, nullable: true })
  moderatorId?: string | null;

  @Column({ type: "text", nullable: true })
  resolution?: string | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "reporter_id" })
  reporter!: Relation<User>;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "moderator_id" })
  moderator?: Relation<User | null>;
}
