import { Column, Entity, Index } from "typeorm";

import { BaseEntity } from "./base.entity";

export enum OutboxEventStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Published = "PUBLISHED",
  Failed = "FAILED",
  Dead = "DEAD",
}

@Entity("outbox_events")
@Index(["status", "availableAt"])
@Index(["aggregateType", "aggregateId"])
export class OutboxEvent extends BaseEntity {
  @Column({ name: "event_type", type: "varchar", length: 128 })
  eventType!: string;

  @Column({ name: "event_version", type: "int", default: 1 })
  eventVersion!: number;

  @Column({ name: "aggregate_type", type: "varchar", length: 64, nullable: true })
  aggregateType?: string | null;

  @Column({ name: "aggregate_id", type: "char", length: 36, nullable: true })
  aggregateId?: string | null;

  @Column({ type: "json" })
  payload!: Record<string, unknown>;

  @Column({ type: "enum", enum: OutboxEventStatus, default: OutboxEventStatus.Pending })
  status!: OutboxEventStatus;

  @Column({ type: "int", default: 0 })
  attempts!: number;

  @Column({ name: "available_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  availableAt!: Date;

  @Column({ name: "published_at", type: "datetime", nullable: true })
  publishedAt?: Date | null;

  @Column({ name: "last_error", type: "text", nullable: true })
  lastError?: string | null;
}
