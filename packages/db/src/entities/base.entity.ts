import { BeforeInsert, Column, PrimaryColumn } from "typeorm";

import { uuidv7 } from "../utils/uuid";

export abstract class BaseEntity {
  @PrimaryColumn({ type: "char", length: 36 })
  id!: string;

  @Column({
    name: "created_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @BeforeInsert()
  assignId(): void {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
