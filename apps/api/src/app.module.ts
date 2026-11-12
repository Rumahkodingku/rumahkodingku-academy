import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { BullModule } from "@nestjs/bullmq";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { ScheduleModule } from "@nestjs/schedule";
import { TerminusModule } from "@nestjs/terminus";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { env } from "@rumahkodingku-academy/env/server";

import { ApiResponseInterceptor } from "./common/http/api-response.interceptor";
import { SecurityModule } from "./infrastructure/security/security.module";
import { AppMailModule } from "./infrastructure/mail/mail.module";
import { NotificationsGateway } from "./infrastructure/realtime/notifications.gateway";
import { AppStorageModule } from "./infrastructure/storage/storage.module";
import { RedisThrottlerStorage } from "./infrastructure/redis/redis-throttler.storage";
import { CsrfModule } from "./modules/csrf/csrf.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
      storage: new RedisThrottlerStorage(),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: { url: env.REDIS_URL },
    }),
    TerminusModule,
    DevtoolsModule.register({
      http: env.NODE_ENV !== "production",
      port: 8003,
    }),
    SecurityModule,
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
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
