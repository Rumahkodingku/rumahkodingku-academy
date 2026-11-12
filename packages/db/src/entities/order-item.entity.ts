import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";
import { Course } from "./course.entity";

@Entity("order_items")
@Index(["order", "course"], { unique: false })
export class OrderItem extends BaseEntity {
  @Column({ name: "order_id", type: "char", length: 36 })
  orderId!: string;

  @Column({ name: "course_id", type: "char", length: 36, nullable: true })
  courseId?: string | null;

  @Column({ name: "course_title", type: "varchar", length: 255 })
  courseTitle!: string;

  @Column({ name: "unit_price", type: "int" })
  unitPrice!: number;

  @Column({ type: "int", default: 1 })
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "order_id" })
  order!: Relation<Order>;

  @ManyToOne(() => Course, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "course_id" })
  course?: Relation<Course | null>;
}
