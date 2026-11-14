import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { loadEnvFiles } from "./load-env";

loadEnvFiles();

export const env = createEnv({
  server: {
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    REDIS_URL: z.url().default("redis://localhost:6379"),
    POSTHOG_API_KEY: z.string().optional(),
    POSTHOG_HOST: z.url().default("https://us.i.posthog.com"),
    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
      .default("info"),
    METRICS_PORT: z.coerce.number().int().positive().default(9090),
    METRICS_PATH: z.string().default("/metrics"),
    METRICS_PREFIX: z.string().default("rumahkodingku_academy_"),
    JWT_SECRET: z.string().min(32).default("change-me-development-jwt-secret-at-least-32-chars"),
    JWT_ISSUER: z.url().default("http://localhost:3000"),
    JWT_AUDIENCE: z.string().default("web"),
    JWT_TTL: z.enum(["15m", "30m", "1h", "12h", "1d", "7d"]).default("15m"),
    JWT_REFRESH_TTL: z.string().default("30d"),
    JWT_REFRESH_ABSOLUTE_TTL: z.string().default("90d"),
    AUTH_SESSION_COOKIE: z.string().min(1).default("access_token"),
    AUTH_REFRESH_COOKIE: z.string().min(1).default("refresh_token"),
    CSRF_SECRET: z.string().min(32).default("change-me-development-csrf-secret-at-least-32-chars"),
    WEB_APP_URL: z.url().default("http://localhost:3001"),
    TRUST_PROXY: z
      .string()
      .optional()
      .transform((value) => value === "true"),
    AUTH_RATE_LIMIT_REGISTER: z.coerce.number().int().positive().default(5),
    AUTH_RATE_LIMIT_LOGIN: z.coerce.number().int().positive().default(10),
    AUTH_RATE_LIMIT_REFRESH: z.coerce.number().int().positive().default(30),
    AUTH_RATE_LIMIT_FORGOT: z.coerce.number().int().positive().default(3),
    AUTH_RATE_LIMIT_RESET: z.coerce.number().int().positive().default(5),
    AUTH_RATE_LIMIT_VERIFY: z.coerce.number().int().positive().default(10),
    AUTH_RATE_LIMIT_RESEND: z.coerce.number().int().positive().default(3),
    AUTH_RATE_LIMIT_AVATAR: z.coerce.number().int().positive().default(10),
    AUTH_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
    AUTH_RATE_LIMIT_REFRESH_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
    UPLOAD_ROOT: z.string().default("./uploads"),
    EMAIL_SMTP_HOST: z.string().default("localhost"),
    EMAIL_SMTP_PORT: z.coerce.number().int().positive().default(1025),
    EMAIL_SMTP_USER: z.string().optional(),
    EMAIL_SMTP_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().default("Rumah Kodingku Academy <no-reply@rumahkodingku.com>"),
    GARAGE_ENDPOINT: z.url().optional(),
    GARAGE_ACCESS_KEY: z.string().optional(),
    GARAGE_SECRET_KEY: z.string().optional(),
    GARAGE_BUCKET: z.string().default("academy-uploads"),
    STRAPI_URL: z.url().default("http://localhost:1337"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
