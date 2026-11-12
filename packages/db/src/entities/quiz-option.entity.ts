import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { QuizQuestion } from "./quiz-question.entity";

@Entity("quiz_options")
@Index(["question", "position"], { unique: true })
export class QuizOption extends BaseEntity {
  @Column({ name: "question_id", type: "char", length: 36 })
  questionId!: string;

  @Column({ type: "text" })
  label!: string;

  @Column({ name: "is_correct", type: "boolean", default: false })
  isCorrect!: boolean;

  @Column({ type: "int", default: 0 })
  position!: number;

  @ManyToOne(() => QuizQuestion, (question) => question.options, { onDelete: "CASCADE" })
  @JoinColumn({ name: "question_id" })
  question!: QuizQuestion;
}
