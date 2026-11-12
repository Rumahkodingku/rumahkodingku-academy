import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Quiz } from "./quiz.entity";
import { QuizOption } from "./quiz-option.entity";

export enum QuizQuestionType {
  MultipleChoice = "MULTIPLE_CHOICE",
  MultipleSelect = "MULTIPLE_SELECT",
  TrueFalse = "TRUE_FALSE",
  ShortAnswer = "SHORT_ANSWER",
}

@Entity("quiz_questions")
@Index(["quiz", "position"], { unique: true })
export class QuizQuestion extends BaseEntity {
  @Column({ name: "quiz_id", type: "char", length: 36 })
  quizId!: string;

  @Column({ type: "enum", enum: QuizQuestionType })
  type!: QuizQuestionType;

  @Column({ type: "text" })
  prompt!: string;

  @Column({ type: "text", nullable: true })
  explanation?: string | null;

  @Column({ type: "int", default: 0 })
  position!: number;

  @Column({ type: "int", default: 1 })
  points!: number;

  @Column({ name: "normalized_answer_key", type: "varchar", length: 512, nullable: true })
  normalizedAnswerKey?: string | null;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "quiz_id" })
  quiz!: Relation<Quiz>;

  @OneToMany(() => QuizOption, (option) => option.question)
  options!: Relation<QuizOption[]>;
}
