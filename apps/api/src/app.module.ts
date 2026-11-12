import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { BullModule } from "@nestjs/bullmq";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { ScheduleModule } from "@nestjs/schedule";
import { TerminusModule } from "@nestjs/terminus";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { env } from "@rumahkodingku-academy/env/server";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SecurityModule } from "./auth/security.module";
import { CsrfController } from "./csrf/csrf.controller";
import { HealthController } from "./health/health.controller";
import { AppMailModule } from "./mail/mail.module";
import { NotificationsGateway } from "./notifications/notifications.gateway";
import { AppStorageModule } from "./storage/storage.module";
import { RedisThrottlerStorage } from "./throttler/redis-throttler.storage";

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
  ],
  controllers: [AppController, HealthController, CsrfController],
  providers: [
    AppService,
    NotificationsGateway,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
