import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Category } from "./category.entity";
import { CourseSection } from "./course-section.entity";

export enum CourseDifficulty {
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
  Advanced = "ADVANCED",
}

export enum CourseStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Archived = "ARCHIVED",
}

@Entity("courses")
@Index(["slug"], { unique: true })
export class Course extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "short_description", type: "varchar", length: 500, nullable: true })
  shortDescription?: string | null;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "thumbnail_storage_key", type: "varchar", length: 512, nullable: true })
  thumbnailStorageKey?: string | null;

  @Column({ name: "banner_storage_key", type: "varchar", length: 512, nullable: true })
  bannerStorageKey?: string | null;

  @Column({ type: "enum", enum: CourseDifficulty, default: CourseDifficulty.Beginner })
  difficulty!: CourseDifficulty;

  @Column({ type: "varchar", length: 16, default: "id" })
  language!: string;

  @Column({ name: "estimated_duration_minutes", type: "int", default: 0 })
  estimatedDurationMinutes!: number;

  @Column({ name: "learning_outcomes", type: "json", nullable: true })
  learningOutcomes?: string[] | null;

  @Column({ type: "json", nullable: true })
  prerequisites?: string[] | null;

  @Column({ name: "instructor_name", type: "varchar", length: 255, nullable: true })
  instructorName?: string | null;

  @Column({ name: "instructor_bio", type: "text", nullable: true })
  instructorBio?: string | null;

  @Column({ name: "instructor_avatar_storage_key", type: "varchar", length: 512, nullable: true })
  instructorAvatarStorageKey?: string | null;

  @Column({ type: "int", default: 0 })
  price!: number;

  @Column({ name: "discount_price", type: "int", nullable: true })
  discountPrice?: number | null;

  @Column({ type: "varchar", length: 3, default: "IDR" })
  currency!: string;

  @Column({ type: "enum", enum: CourseStatus, default: CourseStatus.Draft })
  status!: CourseStatus;

  @Column({ type: "boolean", default: false })
  featured!: boolean;

  @Column({ name: "completion_policy", type: "json", nullable: true })
  completionPolicy?: Record<string, unknown> | null;

  @Column({ name: "final_project_enabled", type: "boolean", default: false })
  finalProjectEnabled!: boolean;

  @Column({ name: "final_project_files_enabled", type: "boolean", default: false })
  finalProjectFilesEnabled!: boolean;

  @Column({ name: "published_at", type: "datetime", nullable: true })
  publishedAt?: Date | null;

  @OneToMany(() => CourseSection, (section) => section.course)
  sections!: Relation<CourseSection[]>;

  @ManyToMany(() => Category, (category) => category.courses)
  @JoinTable({
    name: "course_categories",
    joinColumn: { name: "course_id" },
    inverseJoinColumn: { name: "category_id" },
  })
  categories!: Relation<Category[]>;
}
