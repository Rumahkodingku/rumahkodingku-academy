import { Column, Entity, Index } from "typeorm";

import { BaseEntity } from "./base.entity";

@Entity("permissions")
@Index(["name", "guardName"], { unique: true })
export class Permission extends BaseEntity {
  @Column({ type: "varchar", length: 128 })
  name!: string;

  @Column({ name: "guard_name", type: "varchar", length: 64, default: "api" })
  guardName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string | null;
}
