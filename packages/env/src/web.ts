import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().default("http://localhost:3001"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://us.i.posthog.com"),
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3001"),
  },
  server: {
    API_URL: z.url().default("http://localhost:3000"),
    AUTH_SESSION_COOKIE: z.string().min(1).default("access_token"),
    AUTH_REFRESH_COOKIE: z.string().min(1).default("refresh_token"),
    WEB_APP_URL: z.url().default("http://localhost:3001"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    API_URL: process.env.API_URL,
    AUTH_SESSION_COOKIE: process.env.AUTH_SESSION_COOKIE,
    AUTH_REFRESH_COOKIE: process.env.AUTH_REFRESH_COOKIE,
    WEB_APP_URL: process.env.WEB_APP_URL,
  },
  emptyStringAsUndefined: true,
});
