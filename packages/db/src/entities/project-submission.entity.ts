import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { FinalProject } from "./final-project.entity";
import { User } from "./user.entity";
import { SubmissionFile } from "./submission-file.entity";
import { SubmissionScore } from "./submission-score.entity";

export enum ProjectSubmissionStatus {
  Submitted = "SUBMITTED",
  UnderReview = "UNDER_REVIEW",
  RevisionRequired = "REVISION_REQUIRED",
  Approved = "APPROVED",
}

@Entity("project_submissions")
@Index(["finalProject", "user", "version"], { unique: true })
export class ProjectSubmission extends BaseEntity {
  @Column({ name: "final_project_id", type: "char", length: 36 })
  finalProjectId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ type: "int" })
  version!: number;

  @Column({ name: "github_url", type: "varchar", length: 512 })
  githubUrl!: string;

  @Column({ name: "deployment_url", type: "varchar", length: 512 })
  deploymentUrl!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Column({
    type: "enum",
    enum: ProjectSubmissionStatus,
    default: ProjectSubmissionStatus.Submitted,
  })
  status!: ProjectSubmissionStatus;

  @Column({ name: "reviewer_id", type: "char", length: 36, nullable: true })
  reviewerId?: string | null;

  @Column({ type: "text", nullable: true })
  feedback?: string | null;

  @Column({ name: "reviewed_at", type: "datetime", nullable: true })
  reviewedAt?: Date | null;

  @ManyToOne(() => FinalProject, (project) => project.submissions, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "final_project_id" })
  finalProject!: Relation<FinalProject>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "reviewer_id" })
  reviewer?: Relation<User | null>;

  @OneToMany(() => SubmissionFile, (file) => file.submission)
  files!: Relation<SubmissionFile[]>;

  @OneToMany(() => SubmissionScore, (score) => score.submission)
  scores!: Relation<SubmissionScore[]>;
}
