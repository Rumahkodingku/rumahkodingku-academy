import { Injectable } from "@nestjs/common";
import {
  AuthenticationRegistry,
  EmailVerificationHandler,
  type EmailVerificationLink,
} from "@nestjs/authentication";

import { AuthUsersRepository } from "../repositories/auth-users.repository";
import { AuthMailService } from "../auth-mail.service";
import type { AuthUser } from "../auth.types";

@Injectable()
export class EmailVerificationHandlerImpl extends EmailVerificationHandler {
  constructor(
    private readonly users: AuthUsersRepository,
    private readonly mail: AuthMailService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerHandler("emailVerification", this);
  }

  async send(link: EmailVerificationLink): Promise<void> {
    await this.mail.sendVerification(link);
  }

  async markVerified(userId: string, email: string): Promise<boolean> {
    return this.users.markEmailVerified(userId, email);
  }

  isVerified(user: unknown): boolean {
    return Boolean((user as AuthUser | null)?.emailVerified);
  }
}
