import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { env } from "@rumahkodingku-academy/env/server";
import { Redis } from "ioredis";

import { logger } from "../../common/logging/logger";

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client = new Redis(env.REDIS_URL);

  constructor() {
    this.client.on("error", (error: unknown) => {
      logger.error("Redis error", { error });
    });
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }

  async onModuleDestroy(): Promise<void> {
    await this.quit();
  }
}
