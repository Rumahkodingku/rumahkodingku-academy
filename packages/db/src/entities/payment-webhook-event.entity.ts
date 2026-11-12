import { Column, Entity, Index } from "typeorm";

import { BaseEntity } from "./base.entity";

export enum WebhookProcessingState {
  Received = "RECEIVED",
  Processed = "PROCESSED",
  Failed = "FAILED",
}

@Entity("payment_webhook_events")
@Index(["provider", "providerEventId"], { unique: true })
export class PaymentWebhookEvent extends BaseEntity {
  @Column({ type: "varchar", length: 64 })
  provider!: string;

  @Column({ name: "provider_event_id", type: "varchar", length: 255 })
  providerEventId!: string;

  @Column({ name: "payload_hash", type: "varchar", length: 128 })
  payloadHash!: string;

  @Column({
    name: "processing_state",
    type: "enum",
    enum: WebhookProcessingState,
    default: WebhookProcessingState.Received,
  })
  processingState!: WebhookProcessingState;

  @Column({ name: "processed_at", type: "datetime", nullable: true })
  processedAt?: Date | null;

  @Column({ name: "error_metadata", type: "json", nullable: true })
  errorMetadata?: Record<string, unknown> | null;
}
