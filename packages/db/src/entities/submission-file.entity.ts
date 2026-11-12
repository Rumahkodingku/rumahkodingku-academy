import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { ProjectSubmission } from "./project-submission.entity";

@Entity("submission_files")
export class SubmissionFile extends BaseEntity {
  @Column({ name: "submission_id", type: "char", length: 36 })
  submissionId!: string;

  @Column({ name: "storage_key", type: "varchar", length: 512 })
  storageKey!: string;

  @Column({ name: "display_filename", type: "varchar", length: 255 })
  displayFilename!: string;

  @Column({ name: "mime_type", type: "varchar", length: 128 })
  mimeType!: string;

  @Column({ type: "varchar", length: 32 })
  extension!: string;

  @Column({ name: "byte_size", type: "int" })
  byteSize!: number;

  @Column({ type: "varchar", length: 128, nullable: true })
  checksum?: string | null;

  @ManyToOne(() => ProjectSubmission, (submission) => submission.files, { onDelete: "CASCADE" })
  @JoinColumn({ name: "submission_id" })
  submission!: Relation<ProjectSubmission>;
}
