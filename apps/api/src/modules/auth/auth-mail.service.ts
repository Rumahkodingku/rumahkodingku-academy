import type { EmailVerificationLink, PasswordResetLink } from "@nestjs/authentication";
import { Mailer } from "@nestjs/mail";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthMailService {
  constructor(private readonly mailer: Mailer) {}

  async sendVerification(link: EmailVerificationLink): Promise<void> {
    await this.mailer.send({
      to: link.email,
      subject: "Verifikasi email RumahKodingku Academy",
      template: "verify-email",
      context: {
        url: link.url,
        expiresAt: link.expiresAt.toISOString(),
      },
    });
  }

  async sendPasswordReset(link: PasswordResetLink): Promise<void> {
    await this.mailer.send({
      to: link.email,
      subject: "Reset password RumahKodingku Academy",
      template: "reset-password",
      context: {
        url: link.url,
        expiresAt: link.expiresAt.toISOString(),
      },
    });
  }
}
