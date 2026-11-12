import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";
import { Payment } from "./payment.entity";
import { User } from "./user.entity";

export enum RefundStatus {
  Requested = "REQUESTED",
  UnderReview = "UNDER_REVIEW",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Processing = "PROCESSING",
  Succeeded = "SUCCEEDED",
  Failed = "FAILED",
}

@Entity("refund_requests")
export class RefundRequest extends BaseEntity {
  @Column({ name: "order_id", type: "char", length: 36 })
  orderId!: string;

  @Column({ name: "payment_id", type: "char", length: 36 })
  paymentId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ type: "text" })
  reason!: string;

  @Column({ type: "json", nullable: true })
  evidence?: Record<string, unknown> | null;

  @Column({ type: "int" })
  amount!: number;

  @Column({ type: "enum", enum: RefundStatus, default: RefundStatus.Requested })
  status!: RefundStatus;

  @Column({ name: "reviewer_id", type: "char", length: 36, nullable: true })
  reviewerId?: string | null;

  @Column({ name: "decision_reason", type: "text", nullable: true })
  decisionReason?: string | null;

  @Column({ name: "provider_reference", type: "varchar", length: 255, nullable: true })
  providerReference?: string | null;

  @ManyToOne(() => Order, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "order_id" })
  order!: Relation<Order>;

  @ManyToOne(() => Payment, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "payment_id" })
  payment!: Relation<Payment>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "reviewer_id" })
  reviewer?: Relation<User | null>;
}
