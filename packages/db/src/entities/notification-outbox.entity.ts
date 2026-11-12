import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

export enum OutboxStatus {
  Pending = "PENDING",
  Sent = "SENT",
  Failed = "FAILED",
}

@Entity("notification_outbox")
@Index(["status", "nextAttemptAt"])
export class NotificationOutbox extends BaseEntity {
  @Column({ name: "event_type", type: "varchar", length: 128 })
  eventType!: string;

  @Column({ name: "recipient_user_id", type: "char", length: 36, nullable: true })
  recipientUserId?: string | null;

  @Column({ name: "recipient_email", type: "varchar", length: 255, nullable: true })
  recipientEmail?: string | null;

  @Column({ type: "json" })
  payload!: Record<string, unknown>;

  @Column({ type: "enum", enum: OutboxStatus, default: OutboxStatus.Pending })
  status!: OutboxStatus;

  @Column({ type: "int", default: 0 })
  attempts!: number;

  @Column({ name: "next_attempt_at", type: "datetime", nullable: true })
  nextAttemptAt?: Date | null;

  @Column({ name: "sent_at", type: "datetime", nullable: true })
  sentAt?: Date | null;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage?: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "recipient_user_id" })
  recipient?: User | null;
}
