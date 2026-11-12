import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { ProjectRubricCriterion } from "./project-rubric-criterion.entity";
import { ProjectSubmission } from "./project-submission.entity";
import { User } from "./user.entity";

@Entity("submission_scores")
@Index(["submission", "criterion"], { unique: true })
export class SubmissionScore extends BaseEntity {
  @Column({ name: "submission_id", type: "char", length: 36 })
  submissionId!: string;

  @Column({ name: "criterion_id", type: "char", length: 36 })
  criterionId!: string;

  @Column({ type: "int" })
  score!: number;

  @Column({ name: "reviewer_id", type: "char", length: 36 })
  reviewerId!: string;

  @ManyToOne(() => ProjectSubmission, (submission) => submission.scores, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "submission_id" })
  submission!: ProjectSubmission;

  @ManyToOne(() => ProjectRubricCriterion, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "criterion_id" })
  criterion!: ProjectRubricCriterion;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "reviewer_id" })
  reviewer!: User;
}
