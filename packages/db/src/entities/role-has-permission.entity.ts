import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";

import { Permission } from "./permission.entity";
import { Role } from "./role.entity";

@Entity("role_has_permissions")
@Index(["permissionId"])
export class RoleHasPermission {
  @PrimaryColumn({ name: "role_id", type: "char", length: 36 })
  roleId!: string;

  @PrimaryColumn({ name: "permission_id", type: "char", length: 36 })
  permissionId!: string;

  @ManyToOne(() => Role, { onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role!: Relation<Role>;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id" })
  permission!: Relation<Permission>;
}
