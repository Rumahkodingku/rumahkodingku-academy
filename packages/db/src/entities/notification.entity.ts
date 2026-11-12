import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("notifications")
@Index(["user", "readAt", "createdAt"])
export class Notification extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ type: "varchar", length: 64 })
  type!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ name: "resource_type", type: "varchar", length: 64, nullable: true })
  resourceType?: string | null;

  @Column({ name: "resource_id", type: "char", length: 36, nullable: true })
  resourceId?: string | null;

  @Column({ name: "read_at", type: "datetime", nullable: true })
  readAt?: Date | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
