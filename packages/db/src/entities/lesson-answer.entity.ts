import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { LessonQuestion } from "./lesson-question.entity";
import { User } from "./user.entity";
import { ModerationState } from "./moderation-state";

@Entity("lesson_answers")
export class LessonAnswer extends BaseEntity {
  @Column({ name: "question_id", type: "char", length: 36 })
  questionId!: string;

  @Column({ name: "author_id", type: "char", length: 36 })
  authorId!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "boolean", default: false })
  accepted!: boolean;

  @Column({
    name: "moderation_state",
    type: "enum",
    enum: ModerationState,
    default: ModerationState.Visible,
  })
  moderationState!: ModerationState;

  @ManyToOne(() => LessonQuestion, (question) => question.answers, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "question_id" })
  question!: Relation<LessonQuestion>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: Relation<User>;
}
