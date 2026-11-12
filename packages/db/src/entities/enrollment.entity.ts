import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { User } from "./user.entity";

export enum EnrollmentSource {
  Purchase = "PURCHASE",
  Free = "FREE",
  AdminGrant = "ADMIN_GRANT",
}

export enum EnrollmentStatus {
  Active = "ACTIVE",
  Suspended = "SUSPENDED",
  Revoked = "REVOKED",
}

@Entity("enrollments")
@Index(["user", "course"], { unique: true })
export class Enrollment extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "enum", enum: EnrollmentSource })
  source!: EnrollmentSource;

  @Column({ name: "source_order_id", type: "char", length: 36, nullable: true })
  sourceOrderId?: string | null;

  @Column({ name: "source_reference", type: "varchar", length: 255, nullable: true })
  sourceReference?: string | null;

  @Column({ name: "granted_by", type: "char", length: 36, nullable: true })
  grantedBy?: string | null;

  @Column({ type: "text", nullable: true })
  reason?: string | null;

  @Column({ type: "enum", enum: EnrollmentStatus, default: EnrollmentStatus.Active })
  status!: EnrollmentStatus;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;
}
