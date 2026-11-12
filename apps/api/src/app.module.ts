import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { TerminusModule } from "@nestjs/terminus";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { env } from "@rumahkodingku-academy/env/server";

import { ApiResponseInterceptor } from "./common/http/api-response.interceptor";
import { LoggingInterceptor } from "./common/logging/logging.interceptor";
import { PostHogModule } from "./infrastructure/analytics/posthog.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { MetricsInterceptor } from "./infrastructure/metrics/metrics.interceptor";
import { MetricsModule } from "./infrastructure/metrics/metrics.module";
import { SecurityModule } from "./infrastructure/security/security.module";
import { AppMailModule } from "./infrastructure/mail/mail.module";
import { NotificationsGateway } from "./infrastructure/realtime/notifications.gateway";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { RedisThrottlerStorage } from "./infrastructure/redis/redis-throttler.storage";
import { AppStorageModule } from "./infrastructure/storage/storage.module";
import { CsrfModule } from "./modules/csrf/csrf.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisThrottlerStorage],
      useFactory: (storage: RedisThrottlerStorage) => ({
        throttlers: [{ ttl: 60_000, limit: 100 }],
        storage,
      }),
    }),
    TerminusModule,
    DevtoolsModule.register({
      http: env.NODE_ENV !== "production",
      port: 8003,
    }),
    SecurityModule,
    DatabaseModule,
    RedisModule,
    MetricsModule,
    PostHogModule,
    AppMailModule,
    AppStorageModule,
    CsrfModule,
    HealthModule,
  ],
  providers: [
    NotificationsGateway,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
