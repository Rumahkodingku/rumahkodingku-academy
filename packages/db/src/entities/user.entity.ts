import { Column, Entity, Index, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import { RefreshSession } from "./refresh-session.entity";

export enum UserRole {
  User = "USER",
  Admin = "ADMIN",
}

export enum UserStatus {
  Active = "ACTIVE",
  Suspended = "SUSPENDED",
  Deleted = "DELETED",
}

@Entity("users")
@Index(["email"], { unique: true })
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role!: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Active })
  status!: UserStatus;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ name: "avatar_storage_key", type: "varchar", length: 512, nullable: true })
  avatarStorageKey?: string | null;

  @Column({ name: "email_verified_at", type: "datetime", nullable: true })
  emailVerifiedAt?: Date | null;

  @Column({ type: "json", nullable: true })
  profile?: Record<string, unknown> | null;

  @OneToMany(() => RefreshSession, (session) => session.user)
  refreshSessions!: RefreshSession[];
}
