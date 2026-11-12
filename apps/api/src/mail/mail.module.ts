import { join } from "node:path";

import { MailModule, SmtpTransport } from "@nestjs/mail";
import { env } from "@rumahkodingku-academy/env/server";

import { HandlebarsTemplateEngine } from "./handlebars-template.engine";

export const AppMailModule = MailModule.forRoot({
  transport: new SmtpTransport({
    host: env.EMAIL_SMTP_HOST,
    port: env.EMAIL_SMTP_PORT,
    secure: env.EMAIL_SMTP_PORT === 465,
    auth:
      env.EMAIL_SMTP_USER && env.EMAIL_SMTP_PASSWORD
        ? { user: env.EMAIL_SMTP_USER, pass: env.EMAIL_SMTP_PASSWORD }
        : undefined,
  }),
  templates: new HandlebarsTemplateEngine({
    dir: join(process.cwd(), "src", "mail", "templates"),
  }),
  from: env.EMAIL_FROM,
});
