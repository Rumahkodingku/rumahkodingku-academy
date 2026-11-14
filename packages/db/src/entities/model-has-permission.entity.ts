import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";

import { Permission } from "./permission.entity";

@Entity("model_has_permissions")
@Index(["modelType", "modelId"])
export class ModelHasPermission {
  @PrimaryColumn({ name: "permission_id", type: "char", length: 36 })
  permissionId!: string;

  @PrimaryColumn({ name: "model_type", type: "varchar", length: 64 })
  modelType!: string;

  @PrimaryColumn({ name: "model_id", type: "char", length: 36 })
  modelId!: string;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id" })
  permission!: Relation<Permission>;
}
