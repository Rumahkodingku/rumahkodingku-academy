import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";

export enum PaymentStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Failed = "FAILED",
  Expired = "EXPIRED",
  Cancelled = "CANCELLED",
  Refunded = "REFUNDED",
}

@Entity("payments")
@Index(["provider", "providerReference"], { unique: true })
export class Payment extends BaseEntity {
  @Column({ name: "order_id", type: "char", length: 36 })
  orderId!: string;

  @Column({ type: "varchar", length: 64 })
  provider!: string;

  @Column({ name: "provider_reference", type: "varchar", length: 255 })
  providerReference!: string;

  @Column({ type: "varchar", length: 64 })
  method!: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.Pending })
  status!: PaymentStatus;

  @Column({ type: "int" })
  amount!: number;

  @Column({ type: "varchar", length: 3, default: "IDR" })
  currency!: string;

  @Column({ name: "paid_at", type: "datetime", nullable: true })
  paidAt?: Date | null;

  @Column({ name: "expired_at", type: "datetime", nullable: true })
  expiredAt?: Date | null;

  @Column({ name: "raw_metadata_key", type: "varchar", length: 512, nullable: true })
  rawMetadataKey?: string | null;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "order_id" })
  order!: Order;
}
