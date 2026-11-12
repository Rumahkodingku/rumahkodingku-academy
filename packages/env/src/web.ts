import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://us.i.posthog.com"),
    NEXT_PUBLIC_STRAPI_URL: z.url().default("http://localhost:1337"),
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3001"),
  },
  server: {
    STRAPI_API_TOKEN: z.string().optional(),
    API_URL: z.url().optional(),
    AUTH_SESSION_COOKIE: z.string().min(1).default("access_token"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    API_URL: process.env.API_URL,
    AUTH_SESSION_COOKIE: process.env.AUTH_SESSION_COOKIE,
  },
  emptyStringAsUndefined: true,
});
