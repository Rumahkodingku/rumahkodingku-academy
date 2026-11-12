import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { loadEnvFiles } from "./load-env";

loadEnvFiles();

export const databaseEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
