import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Quiz } from "./quiz.entity";
import { User } from "./user.entity";
import { QuizAnswer } from "./quiz-answer.entity";

export enum QuizAttemptStatus {
  InProgress = "IN_PROGRESS",
  Submitted = "SUBMITTED",
  Expired = "EXPIRED",
  Cancelled = "CANCELLED",
}

@Entity("quiz_attempts")
@Index(["quiz", "user", "attemptNumber"], { unique: true })
export class QuizAttempt extends BaseEntity {
  @Column({ name: "quiz_id", type: "char", length: 36 })
  quizId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "attempt_number", type: "int" })
  attemptNumber!: number;

  @Column({ name: "started_at", type: "datetime" })
  startedAt!: Date;

  @Column({ name: "submitted_at", type: "datetime", nullable: true })
  submittedAt?: Date | null;

  @Column({ type: "int", default: 0 })
  score!: number;

  @Column({ type: "boolean", default: false })
  passed!: boolean;

  @Column({ type: "enum", enum: QuizAttemptStatus, default: QuizAttemptStatus.InProgress })
  status!: QuizAttemptStatus;

  @ManyToOne(() => Quiz, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "quiz_id" })
  quiz!: Relation<Quiz>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @OneToMany(() => QuizAnswer, (answer) => answer.attempt)
  answers!: Relation<QuizAnswer[]>;
}
