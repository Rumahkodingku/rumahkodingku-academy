import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Coupon } from "./coupon.entity";
import { Order } from "./order.entity";
import { User } from "./user.entity";

@Entity("coupon_redemptions")
@Index(["order"], { unique: true })
export class CouponRedemption extends BaseEntity {
  @Column({ name: "coupon_id", type: "char", length: 36 })
  couponId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "order_id", type: "char", length: 36 })
  orderId!: string;

  @Column({ name: "redeemed_amount", type: "int" })
  redeemedAmount!: number;

  @ManyToOne(() => Coupon, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "coupon_id" })
  coupon!: Coupon;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Order, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "order_id" })
  order!: Order;
}
