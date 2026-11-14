import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";

import { Role } from "./role.entity";

@Entity("model_has_roles")
@Index(["modelType", "modelId"])
export class ModelHasRole {
  @PrimaryColumn({ name: "role_id", type: "char", length: 36 })
  roleId!: string;

  @PrimaryColumn({ name: "model_type", type: "varchar", length: 64 })
  modelType!: string;

  @PrimaryColumn({ name: "model_id", type: "char", length: 36 })
  modelId!: string;

  @ManyToOne(() => Role, { onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role!: Relation<Role>;
}
