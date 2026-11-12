import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { User } from "./user.entity";

@Entity("wishlists")
@Index(["user", "course"], { unique: true })
export class Wishlist extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Relation<Course>;
}
