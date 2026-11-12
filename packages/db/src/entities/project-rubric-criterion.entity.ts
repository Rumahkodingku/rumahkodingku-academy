import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { FinalProject } from "./final-project.entity";

@Entity("project_rubric_criteria")
@Index(["finalProject", "position"], { unique: true })
export class ProjectRubricCriterion extends BaseEntity {
  @Column({ name: "final_project_id", type: "char", length: 36 })
  finalProjectId!: string;

  @Column({ type: "varchar", length: 255 })
  label!: string;

  @Column({ type: "int" })
  weight!: number;

  @Column({ type: "int", default: 0 })
  position!: number;

  @ManyToOne(() => FinalProject, (project) => project.rubricCriteria, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "final_project_id" })
  finalProject!: FinalProject;
}
