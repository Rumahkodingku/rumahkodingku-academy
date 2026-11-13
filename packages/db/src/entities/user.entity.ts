import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { UserProfile } from "./user-profile.entity";
import { RefreshSession } from "./refresh-session.entity";

export enum UserStatus {
  Active = "ACTIVE",
  Suspended = "SUSPENDED",
  Deleted = "DELETED",
}

@Entity("users")
@Index(["email"], { unique: true })
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Active })
  status!: UserStatus;

  @Column({ name: "email_verified_at", type: "datetime", nullable: true })
  emailVerifiedAt?: Date | null;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile!: Relation<UserProfile>;

  @OneToMany(() => RefreshSession, (session) => session.user)
  refreshSessions!: Relation<RefreshSession[]>;
}
