import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

export enum AnnouncementAudience {
  Public = "PUBLIC",
  User = "USER",
  Admin = "ADMIN",
}

export enum AnnouncementStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Archived = "ARCHIVED",
}

@Entity("announcements")
export class Announcement extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "enum", enum: AnnouncementAudience, default: AnnouncementAudience.User })
  audience!: AnnouncementAudience;

  @Column({ type: "enum", enum: AnnouncementStatus, default: AnnouncementStatus.Draft })
  status!: AnnouncementStatus;

  @Column({ name: "starts_at", type: "datetime", nullable: true })
  startsAt?: Date | null;

  @Column({ name: "expires_at", type: "datetime", nullable: true })
  expiresAt?: Date | null;

  @Column({ name: "author_id", type: "char", length: 36 })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: User;
}
