import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { ProjectRubricCriterion } from "./project-rubric-criterion.entity";
import { ProjectSubmission } from "./project-submission.entity";

@Entity("final_projects")
export class FinalProject extends BaseEntity {
  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "text", nullable: true })
  instructions?: string | null;

  @Column({ type: "text", nullable: true })
  requirements?: string | null;

  @Column({ name: "submission_guide", type: "text", nullable: true })
  submissionGuide?: string | null;

  @Column({ name: "deadline_at", type: "datetime", nullable: true })
  deadlineAt?: Date | null;

  @Column({ name: "minimum_score", type: "int", default: 0 })
  minimumScore!: number;

  @Column({ name: "files_enabled", type: "boolean", default: false })
  filesEnabled!: boolean;

  @Column({ type: "boolean", default: false })
  enabled!: boolean;

  @OneToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;

  @OneToMany(() => ProjectRubricCriterion, (criterion) => criterion.finalProject)
  rubricCriteria!: Relation<ProjectRubricCriterion[]>;

  @OneToMany(() => ProjectSubmission, (submission) => submission.finalProject)
  submissions!: Relation<ProjectSubmission[]>;
}
