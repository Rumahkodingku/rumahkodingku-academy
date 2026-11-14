import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("users_profile")
@Index(["username"], { unique: true })
@Index(["countryCode"])
export class UserProfile extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId!: string;

  @Column({ name: "display_name", type: "varchar", length: 100 })
  displayName!: string;

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName?: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  username?: string | null;

  @Column({ type: "text", nullable: true })
  bio?: string | null;

  @Column({ type: "varchar", length: 120, nullable: true })
  headline?: string | null;

  @Column({ name: "avatar_storage_key", type: "varchar", length: 512, nullable: true })
  avatarStorageKey?: string | null;

  @Column({ type: "varchar", length: 32, nullable: true })
  phone?: string | null;

  @Column({ name: "country_code", type: "char", length: 2, nullable: true })
  countryCode?: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  timezone?: string | null;

  @Column({ type: "varchar", length: 5, default: "id" })
  locale!: string;

  @Column({ name: "website_url", type: "varchar", length: 512, nullable: true })
  websiteUrl?: string | null;

  @Column({ name: "github_url", type: "varchar", length: 512, nullable: true })
  githubUrl?: string | null;

  @Column({ name: "linkedin_url", type: "varchar", length: 512, nullable: true })
  linkedinUrl?: string | null;

  @Column({ name: "x_url", type: "varchar", length: 512, nullable: true })
  xUrl?: string | null;

  @Column({ name: "instagram_url", type: "varchar", length: 512, nullable: true })
  instagramUrl?: string | null;

  @Column({ name: "email_notifications", type: "boolean", default: true })
  emailNotifications!: boolean;

  @Column({ name: "in_app_notifications", type: "boolean", default: true })
  inAppNotifications!: boolean;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<User>;
}
