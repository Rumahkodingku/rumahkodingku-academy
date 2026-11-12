import { Controller, Get } from "@nestjs/common";
import { Public } from "@nestjs/authentication";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from "@nestjs/terminus";
import { env } from "@rumahkodingku-academy/env/server";

@Public()
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
      () => this.http.pingCheck("strapi", `${env.STRAPI_URL}/_health`),
    ]);
  }
}
