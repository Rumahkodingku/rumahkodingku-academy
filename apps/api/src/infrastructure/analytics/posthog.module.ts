import { Global, Module } from "@nestjs/common";
import { env } from "@rumahkodingku-academy/env/server";

import { POSTHOG_CONFIG, PostHogService } from "./posthog.service";

@Global()
@Module({
  providers: [
    {
      provide: POSTHOG_CONFIG,
      useValue: { apiKey: env.POSTHOG_API_KEY, host: env.POSTHOG_HOST },
    },
    PostHogService,
  ],
  exports: [PostHogService],
})
export class PostHogModule {}
