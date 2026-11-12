import { Controller, Get, Inject } from "@nestjs/common";
import { Public } from "@nestjs/authentication";
import { SkipThrottle } from "@nestjs/throttler";
import { HealthCheck, HealthCheckService, type HealthIndicatorResult } from "@nestjs/terminus";
import { AppDataSource } from "@rumahkodingku-academy/db";

import { SkipEnvelope } from "../../common/http/api-response";
import { DATA_SOURCE } from "../../infrastructure/database/database.module";
import { RedisService } from "../../infrastructure/redis/redis.service";

@Public()
@SkipEnvelope()
@SkipThrottle()
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    @Inject(DATA_SOURCE) private readonly dataSource: typeof AppDataSource,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.checkReady();
  }

  @Get("ready")
  @HealthCheck()
  ready() {
    return this.checkReady();
  }

  @Get("live")
  live(): { status: "ok" } {
    return { status: "ok" };
  }

  private checkReady() {
    return this.health.check([() => this.checkDatabase(), () => this.checkRedis()]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.dataSource.query("SELECT 1");
      return { database: { status: "up" } };
    } catch {
      return { database: { status: "down", message: "database unavailable" } };
    }
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();
      return { redis: { status: "up" } };
    } catch {
      return { redis: { status: "down", message: "redis unavailable" } };
    }
  }
}
