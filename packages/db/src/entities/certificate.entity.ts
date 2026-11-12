import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { User } from "./user.entity";

export enum CertificateStatus {
  Issued = "ISSUED",
  Revoked = "REVOKED",
}

@Entity("certificates")
@Index(["number"], { unique: true })
@Index(["verificationCode"], { unique: true })
@Index(["activeEnrollmentId"], { unique: true })
export class Certificate extends BaseEntity {
  @Column({ name: "enrollment_id", type: "char", length: 36 })
  enrollmentId!: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "varchar", length: 64, unique: true })
  number!: string;

  @Column({ name: "verification_code", type: "varchar", length: 64, unique: true })
  verificationCode!: string;

  @Column({ type: "varchar", length: 255 })
  issuer!: string;

  @Column({ name: "issued_at", type: "datetime" })
  issuedAt!: Date;

  @Column({ type: "enum", enum: CertificateStatus, default: CertificateStatus.Issued })
  status!: CertificateStatus;

  @Column({ name: "revoked_at", type: "datetime", nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "revoke_reason", type: "text", nullable: true })
  revokeReason?: string | null;

  @Column({ name: "reissued_from_certificate_id", type: "char", length: 36, nullable: true })
  reissuedFromCertificateId?: string | null;

  @Column({ name: "pdf_storage_key", type: "varchar", length: 512, nullable: true })
  pdfStorageKey?: string | null;

  @Column({ name: "active_enrollment_id", type: "char", length: 36, nullable: true, unique: true })
  activeEnrollmentId?: string | null;

  @ManyToOne(() => Enrollment, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "enrollment_id" })
  enrollment!: Enrollment;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Course;
}
