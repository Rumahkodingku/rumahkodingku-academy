import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { QuizAttempt } from "./quiz-attempt.entity";
import { QuizQuestion } from "./quiz-question.entity";

@Entity("quiz_answers")
@Index(["attempt", "question"], { unique: true })
export class QuizAnswer extends BaseEntity {
  @Column({ name: "attempt_id", type: "char", length: 36 })
  attemptId!: string;

  @Column({ name: "question_id", type: "char", length: 36 })
  questionId!: string;

  @Column({ name: "selected_option_ids", type: "json", nullable: true })
  selectedOptionIds?: string[] | null;

  @Column({ name: "short_answer_text", type: "text", nullable: true })
  shortAnswerText?: string | null;

  @Column({ name: "awarded_points", type: "int", default: 0 })
  awardedPoints!: number;

  @Column({ name: "is_correct", type: "boolean", default: false })
  isCorrect!: boolean;

  @ManyToOne(() => QuizAttempt, (attempt) => attempt.answers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "attempt_id" })
  attempt!: Relation<QuizAttempt>;

  @ManyToOne(() => QuizQuestion, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "question_id" })
  question!: Relation<QuizQuestion>;
}
