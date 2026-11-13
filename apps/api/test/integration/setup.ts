import type { INestApplication, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { Mailer } from "@nestjs/mail";
import {
  AppDataSource,
  User,
  UserProfile,
  UserStatus,
  ModelHasRole,
  Role,
} from "@rumahkodingku-academy/db";
import { PasswordHasher } from "@nestjs/authentication";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import request from "supertest";
import { v7 as uuidv7 } from "uuid";

import { ApiResponseInterceptor } from "../../src/common/http/api-response.interceptor";
import { ProblemDetailsFilter } from "../../src/common/http/problem-details.filter";
import { requestIdMiddleware } from "../../src/common/http/request-id.middleware";
import { DatabaseModule } from "../../src/infrastructure/database/database.module";
import { RedisModule } from "../../src/infrastructure/redis/redis.module";
import { RedisService } from "../../src/infrastructure/redis/redis.service";
import { SecurityModule } from "../../src/infrastructure/security/security.module";
import { AuthModule } from "../../src/modules/auth/auth.module";
import { cookieToBearer } from "../../src/modules/auth/auth.middleware";
import { DEFAULT_ROLES, RBAC_GUARD, RBAC_MODEL_TYPE } from "../../src/modules/rbac/rbac.constants";
import { csrfProtection, ensureCsrfSession } from "../../src/modules/csrf/csrf";
import { CsrfModule } from "../../src/modules/csrf/csrf.module";
import { ZodValidationPipe } from "nestjs-zod";

type SentMail = {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, unknown>;
};

export const sentMails: SentMail[] = [];

export const testMailer = {
  send: async (message: SentMail): Promise<Record<string, unknown>> => {
    sentMails.push(message);
    return {};
  },
};

export async function setupDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await AppDataSource.runMigrations();
  await truncateAuthTables();
  sentMails.length = 0;
}

export async function truncateAuthTables(): Promise<void> {
  const tables = [
    "users_profile",
    "model_has_roles",
    "model_has_permissions",
    "refresh_sessions",
    "refresh_token_families",
    "email_verification_tokens",
    "password_reset_tokens",
    "audit_logs",
    "users",
  ];

  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");

  for (const table of tables) {
    await AppDataSource.query(`TRUNCATE TABLE \`${table}\``);
  }

  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
  sentMails.length = 0;
}

export async function clearRateLimits(app: INestApplication): Promise<void> {
  const redis = app.get(RedisService);
  const keys = await redis.client.keys("auth:rl:*");

  if (keys.length > 0) {
    await redis.client.del(...keys);
  }
}

export async function createTestApp(controllers: Type<unknown>[] = []): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [SecurityModule, DatabaseModule, RedisModule, CsrfModule, AuthModule],
    controllers,
  })
    .overrideProvider(Mailer)
    .useValue(testMailer)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ApiResponseInterceptor(app.get(Reflector)));
  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.use(cookieToBearer);
  app.use(ensureCsrfSession);
  app.use(csrfProtection);

  const expressApp = app.getHttpAdapter().getInstance() as {
    set: (key: string, value: unknown) => void;
  };
  expressApp.set("trust proxy", true);

  await app.init();

  return app;
}

export function agent(app: INestApplication) {
  return request.agent(app.getHttpServer());
}

export async function csrf(agentInstance: ReturnType<typeof agent>): Promise<string> {
  const response = await agentInstance.get("/api/v1/csrf/token").expect(200);
  return response.body.data.csrfToken as string;
}

export async function register(
  agentInstance: ReturnType<typeof agent>,
  email: string,
  name = "Test User",
): Promise<request.Response> {
  const token = await csrf(agentInstance);
  return agentInstance
    .post("/api/v1/auth/register")
    .set("x-csrf-token", token)
    .send({ name, email, password: "correct-horse-battery" });
}

export async function login(
  agentInstance: ReturnType<typeof agent>,
  email: string,
  password = "correct-horse-battery",
): Promise<request.Response> {
  const token = await csrf(agentInstance);
  return agentInstance
    .post("/api/v1/auth/login")
    .set("x-csrf-token", token)
    .send({ email, password });
}

export function setCookie(response: request.Response, name: string): string | undefined {
  const cookies = response.headers["set-cookie"] as unknown;
  const values = Array.isArray(cookies) ? cookies : cookies ? [String(cookies)] : [];
  const cookie = values.find((value: string) => value.startsWith(`${name}=`));
  return cookie?.split(";")[0]?.split("=").slice(1).join("=");
}

export async function createAdmin(email: string, name = "Admin User"): Promise<void> {
  const hasher = new PasswordHasher({ logN: 10 });
  const passwordHash = await hasher.hash("correct-horse-battery");
  const users = AppDataSource.getRepository(User);
  const profiles = AppDataSource.getRepository(UserProfile);
  const roles = AppDataSource.getRepository(Role);

  const user = await users.save(
    users.create({
      id: uuidv7(),
      email,
      passwordHash,
      status: UserStatus.Active,
      emailVerifiedAt: new Date(),
    }),
  );

  await profiles.save(
    profiles.create({
      id: uuidv7(),
      userId: user.id,
      displayName: name,
      locale: "id",
      emailNotifications: true,
      inAppNotifications: true,
    }),
  );

  const adminRole = await roles.findOne({
    where: { name: DEFAULT_ROLES.ADMIN, guardName: RBAC_GUARD },
  });

  if (!adminRole) {
    throw new Error("Admin role missing in test database");
  }

  await AppDataSource.createQueryBuilder()
    .insert()
    .into(ModelHasRole)
    .values({ roleId: adminRole.id, modelType: RBAC_MODEL_TYPE, modelId: user.id })
    .orIgnore()
    .execute();
}

export async function markVerified(email: string): Promise<void> {
  await AppDataSource.getRepository(User).update({ email }, { emailVerifiedAt: new Date() });
}

export function tokenFromMail(template: string): string {
  const mail = sentMails.find((message) => message.template === template);
  const url = mail?.context?.url;

  if (typeof url !== "string") {
    throw new Error(`No ${template} mail captured`);
  }

  return new URL(url).searchParams.get("token") ?? "";
}

export type TestAgent = ReturnType<typeof agent>;
export type { Request, Response, NextFunction };
