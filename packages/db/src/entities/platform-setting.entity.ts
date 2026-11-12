import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("platform_settings")
@Index(["key"], { unique: true })
export class PlatformSetting extends BaseEntity {
  @Column({ type: "varchar", length: 128 })
  key!: string;

  @Column({ type: "text" })
  value!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "updated_by", type: "char", length: 36, nullable: true })
  updatedBy?: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "updated_by" })
  updater?: Relation<User | null>;
}
