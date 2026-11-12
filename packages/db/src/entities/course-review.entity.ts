import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { User } from "./user.entity";

export enum ReviewStatus {
  Pending = "PENDING",
  Published = "PUBLISHED",
  Rejected = "REJECTED",
}

@Entity("course_reviews")
@Index(["enrollment"], { unique: true })
export class CourseReview extends BaseEntity {
  @Column({ name: "enrollment_id", type: "char", length: 36 })
  enrollmentId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "int" })
  rating!: number;

  @Column({ type: "text", nullable: true })
  body?: string | null;

  @Column({ type: "enum", enum: ReviewStatus, default: ReviewStatus.Pending })
  status!: ReviewStatus;

  @Column({ name: "moderated_by", type: "char", length: 36, nullable: true })
  moderatedBy?: string | null;

  @ManyToOne(() => Enrollment, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "enrollment_id" })
  enrollment!: Relation<Enrollment>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "moderated_by" })
  moderator?: Relation<User | null>;
}
