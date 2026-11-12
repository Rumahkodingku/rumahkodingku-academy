import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { CourseLesson } from "./course-lesson.entity";

@Entity("course_sections")
@Index(["course", "position"], { unique: true })
export class CourseSection extends BaseEntity {
  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "int", default: 0 })
  position!: number;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @OneToMany(() => CourseLesson, (lesson) => lesson.section)
  lessons!: CourseLesson[];
}
