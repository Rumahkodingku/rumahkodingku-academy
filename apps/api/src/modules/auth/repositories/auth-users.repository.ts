import { Inject, Injectable } from "@nestjs/common";
import { User, UserStatus } from "@rumahkodingku-academy/db";
import type { EntityManager } from "typeorm";
import { DataSource } from "typeorm";

import { DATA_SOURCE } from "../../../infrastructure/database/database.module";

export type CreateAccountInput = {
  email: string;
  passwordHash: string;
};

@Injectable()
export class AuthUsersRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<User | null> {
    return this.dataSource.getRepository(User).findOne({
      where: { id },
      relations: { profile: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.dataSource.getRepository(User).findOne({
      where: { email: email.trim().toLowerCase() },
      relations: { profile: true },
    });
  }

  async createAccountInTransaction(
    manager: EntityManager,
    input: CreateAccountInput,
  ): Promise<User> {
    const user = manager.create(User, {
      email: input.email,
      passwordHash: input.passwordHash,
      status: UserStatus.Active,
      emailVerifiedAt: null,
    });

    return manager.save(user);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.dataSource.getRepository(User).update({ id: userId }, { passwordHash });
  }

  async markEmailVerified(userId: string, email: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({ emailVerifiedAt: new Date() })
      .where("id = :userId AND email = :email", { userId, email: email.trim().toLowerCase() })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async setStatus(userId: string, status: UserStatus): Promise<void> {
    await this.dataSource.getRepository(User).update({ id: userId }, { status });
  }
}
