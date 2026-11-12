import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { CourseLesson } from "./course-lesson.entity";
import { CourseSection } from "./course-section.entity";
import { QuizQuestion } from "./quiz-question.entity";
import { QuizAttempt } from "./quiz-attempt.entity";

export enum AnswerRevealTiming {
  Never = "NEVER",
  AfterSubmission = "AFTER_SUBMISSION",
  AfterPass = "AFTER_PASS",
}

export enum QuizStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Archived = "ARCHIVED",
}

@Entity("quizzes")
@Check("CK_quizzes_lesson_or_section", "(lesson_id IS NULL) <> (section_id IS NULL)")
export class Quiz extends BaseEntity {
  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ name: "lesson_id", type: "char", length: 36, nullable: true })
  lessonId?: string | null;

  @Column({ name: "section_id", type: "char", length: 36, nullable: true })
  sectionId?: string | null;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "pass_score", type: "int", default: 70 })
  passScore!: number;

  @Column({ name: "time_limit_minutes", type: "int", nullable: true })
  timeLimitMinutes?: number | null;

  @Column({ name: "attempt_limit", type: "int", default: 3 })
  attemptLimit!: number;

  @Column({ name: "randomize_questions", type: "boolean", default: false })
  randomizeQuestions!: boolean;

  @Column({ name: "randomize_options", type: "boolean", default: false })
  randomizeOptions!: boolean;

  @Column({
    name: "answer_reveal",
    type: "enum",
    enum: AnswerRevealTiming,
    default: AnswerRevealTiming.AfterSubmission,
  })
  answerReveal!: AnswerRevealTiming;

  @Column({ type: "boolean", default: false })
  required!: boolean;

  @Column({ type: "enum", enum: QuizStatus, default: QuizStatus.Draft })
  status!: QuizStatus;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;

  @ManyToOne(() => CourseLesson, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn({ name: "lesson_id" })
  lesson?: Relation<CourseLesson | null>;

  @ManyToOne(() => CourseSection, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn({ name: "section_id" })
  section?: Relation<CourseSection | null>;

  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions!: Relation<QuizQuestion[]>;

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz)
  attempts!: Relation<QuizAttempt[]>;
}
