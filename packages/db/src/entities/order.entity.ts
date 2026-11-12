import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { Payment } from "./payment.entity";
import { RefundRequest } from "./refund-request.entity";

export enum OrderStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Failed = "FAILED",
  Expired = "EXPIRED",
  Cancelled = "CANCELLED",
  RefundPending = "REFUND_PENDING",
  Refunded = "REFUNDED",
}

@Entity("orders")
@Index(["orderNumber"], { unique: true })
export class Order extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "order_number", type: "varchar", length: 64 })
  orderNumber!: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status!: OrderStatus;

  @Column({ type: "varchar", length: 3, default: "IDR" })
  currency!: string;

  @Column({ type: "int", default: 0 })
  subtotal!: number;

  @Column({ name: "discount_total", type: "int", default: 0 })
  discountTotal!: number;

  @Column({ name: "coupon_code", type: "varchar", length: 64, nullable: true })
  couponCode?: string | null;

  @Column({ type: "int", default: 0 })
  total!: number;

  @Column({ name: "idempotency_key", type: "varchar", length: 128, nullable: true })
  idempotencyKey?: string | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: Relation<OrderItem[]>;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Relation<Payment[]>;

  @OneToMany(() => RefundRequest, (refund) => refund.order)
  refunds!: Relation<RefundRequest[]>;
}
