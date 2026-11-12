import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { CourseLesson } from "./course-lesson.entity";
import { User } from "./user.entity";
import { LessonAnswer } from "./lesson-answer.entity";
import { ModerationState } from "./moderation-state";

@Entity("lesson_questions")
export class LessonQuestion extends BaseEntity {
  @Column({ name: "lesson_id", type: "char", length: 36 })
  lessonId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ name: "author_id", type: "char", length: 36 })
  authorId!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ name: "accepted_answer_id", type: "char", length: 36, nullable: true })
  acceptedAnswerId?: string | null;

  @Column({
    name: "moderation_state",
    type: "enum",
    enum: ModerationState,
    default: ModerationState.Visible,
  })
  moderationState!: ModerationState;

  @ManyToOne(() => CourseLesson, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "lesson_id" })
  lesson!: Relation<CourseLesson>;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: Relation<User>;

  @OneToMany(() => LessonAnswer, (answer) => answer.question)
  answers!: Relation<LessonAnswer[]>;
}
