import { Column, Entity, Index, ManyToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";

@Entity("categories")
@Index(["slug"], { unique: true })
export class Category extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "int", default: 0 })
  position!: number;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @ManyToMany(() => Course, (course) => course.categories)
  courses!: Course[];
}
