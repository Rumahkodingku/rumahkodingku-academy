import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { CourseLesson } from "./course-lesson.entity";
import { User } from "./user.entity";

export enum LessonProgressStatus {
  NotStarted = "NOT_STARTED",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
}

@Entity("lesson_progress")
@Index(["user", "lesson"], { unique: true })
export class LessonProgress extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "lesson_id", type: "char", length: 36 })
  lessonId!: string;

  @Column({ type: "enum", enum: LessonProgressStatus, default: LessonProgressStatus.NotStarted })
  status!: LessonProgressStatus;

  @Column({ name: "completed_at", type: "datetime", nullable: true })
  completedAt?: Date | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => CourseLesson, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "lesson_id" })
  lesson!: Relation<CourseLesson>;
}
