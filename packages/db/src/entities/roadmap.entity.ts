import { Column, Entity, Index, OneToMany } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { RoadmapCourse } from "./roadmap-course.entity";

export enum RoadmapStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Archived = "ARCHIVED",
}

@Entity("roadmaps")
@Index(["slug"], { unique: true })
export class Roadmap extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "thumbnail_storage_key", type: "varchar", length: 512, nullable: true })
  thumbnailStorageKey?: string | null;

  @Column({ type: "enum", enum: RoadmapStatus, default: RoadmapStatus.Draft })
  status!: RoadmapStatus;

  @OneToMany(() => RoadmapCourse, (roadmapCourse) => roadmapCourse.roadmap)
  courses!: Relation<RoadmapCourse[]>;
}
