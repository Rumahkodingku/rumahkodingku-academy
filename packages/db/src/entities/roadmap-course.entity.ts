import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { Roadmap } from "./roadmap.entity";

@Entity("roadmap_courses")
@Index(["roadmap", "position"], { unique: true })
@Index(["roadmap", "course"], { unique: true })
export class RoadmapCourse extends BaseEntity {
  @Column({ name: "roadmap_id", type: "char", length: 36 })
  roadmapId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "int" })
  position!: number;

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.courses, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "roadmap_id" })
  roadmap!: Roadmap;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Course;
}
