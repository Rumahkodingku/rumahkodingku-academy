import { Column, Entity, Index } from "typeorm";

import { BaseEntity } from "./base.entity";

@Entity("roles")
@Index(["name", "guardName"], { unique: true })
@Index(["guardName", "isDefault"])
export class Role extends BaseEntity {
  @Column({ type: "varchar", length: 64 })
  name!: string;

  @Column({ name: "guard_name", type: "varchar", length: 64, default: "api" })
  guardName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string | null;

  @Column({ name: "is_default", type: "boolean", default: false })
  isDefault!: boolean;
}
