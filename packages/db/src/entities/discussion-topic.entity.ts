import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import { Course } from "./course.entity";
import { User } from "./user.entity";
import { DiscussionReply } from "./discussion-reply.entity";
import { ModerationState } from "./moderation-state";

@Entity("discussion_topics")
export class DiscussionTopic extends BaseEntity {
  @Column({ name: "course_id", type: "char", length: 36 })
  courseId!: string;

  @Column({ name: "author_id", type: "char", length: 36 })
  authorId!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "boolean", default: false })
  pinned!: boolean;

  @Column({ type: "boolean", default: false })
  locked!: boolean;

  @Column({
    name: "moderation_state",
    type: "enum",
    enum: ModerationState,
    default: ModerationState.Visible,
  })
  moderationState!: ModerationState;

  @ManyToOne(() => Course, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @OneToMany(() => DiscussionReply, (reply) => reply.topic)
  replies!: DiscussionReply[];
}
