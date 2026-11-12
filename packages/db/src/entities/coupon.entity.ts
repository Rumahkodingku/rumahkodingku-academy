import { Column, Entity, Index } from "typeorm";

import { BaseEntity } from "./base.entity";

export enum CouponType {
  Percentage = "PERCENTAGE",
  Fixed = "FIXED",
}

@Entity("coupons")
@Index(["code"], { unique: true })
export class Coupon extends BaseEntity {
  @Column({ type: "varchar", length: 64, unique: true })
  code!: string;

  @Column({ type: "enum", enum: CouponType })
  type!: CouponType;

  @Column({ type: "int" })
  value!: number;

  @Column({ name: "maximum_discount", type: "int", nullable: true })
  maximumDiscount?: number | null;

  @Column({ name: "minimum_purchase", type: "int", default: 0 })
  minimumPurchase!: number;

  @Column({ name: "starts_at", type: "datetime", nullable: true })
  startsAt?: Date | null;

  @Column({ name: "expires_at", type: "datetime", nullable: true })
  expiresAt?: Date | null;

  @Column({ name: "global_limit", type: "int", default: 0 })
  globalLimit!: number;

  @Column({ name: "per_user_limit", type: "int", default: 1 })
  perUserLimit!: number;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @Column({ name: "eligible_course_ids", type: "json", nullable: true })
  eligibleCourseIds?: string[] | null;
}
