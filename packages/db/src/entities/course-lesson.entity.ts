import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { CourseSection } from "./course-section.entity";

export enum LessonContentType {
  YouTubeVideo = "YOUTUBE_VIDEO",
  RichText = "RICH_TEXT",
}

export enum LessonStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

@Entity("lessons")
@Index(["section", "position"], { unique: true })
export class CourseLesson extends BaseEntity {
  @Column({ name: "section_id", type: "char", length: 36 })
  sectionId!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "content_type", type: "enum", enum: LessonContentType })
  contentType!: LessonContentType;

  @Column({ name: "video_reference", type: "varchar", length: 512, nullable: true })
  videoReference?: string | null;

  @Column({ name: "rich_text_body", type: "longtext", nullable: true })
  richTextBody?: string | null;

  @Column({ name: "duration_minutes", type: "int", default: 0 })
  durationMinutes!: number;

  @Column({ type: "boolean", default: true })
  required!: boolean;

  @Column({ type: "boolean", default: false })
  preview!: boolean;

  @Column({ type: "int", default: 0 })
  position!: number;

  @Column({ type: "enum", enum: LessonStatus, default: LessonStatus.Draft })
  status!: LessonStatus;

  @ManyToOne(() => CourseSection, (section) => section.lessons, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "section_id" })
  section!: CourseSection;
}
