import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";

import { BaseEntity } from "./base.entity";
import { DiscussionTopic } from "./discussion-topic.entity";
import { User } from "./user.entity";
import { ModerationState } from "./moderation-state";

@Entity("discussion_replies")
export class DiscussionReply extends BaseEntity {
  @Column({ name: "topic_id", type: "char", length: 36 })
  topicId!: string;

  @Column({ name: "author_id", type: "char", length: 36 })
  authorId!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({
    name: "moderation_state",
    type: "enum",
    enum: ModerationState,
    default: ModerationState.Visible,
  })
  moderationState!: ModerationState;

  @ManyToOne(() => DiscussionTopic, (topic) => topic.replies, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "topic_id" })
  topic!: Relation<DiscussionTopic>;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: Relation<User>;
}
