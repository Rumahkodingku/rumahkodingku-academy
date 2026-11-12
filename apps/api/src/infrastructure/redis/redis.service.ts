import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { env } from "@rumahkodingku-academy/env/server";
import { Redis } from "ioredis";

import { logger } from "../../common/logging/logger";

type ClosableRedis = Pick<Redis, "quit" | "disconnect"> & { status: string };

export async function closeRedis(client: ClosableRedis, timeoutMs = 2_000): Promise<void> {
  if (client.status === "end") {
    return;
  }

  let timer: NodeJS.Timeout | undefined;

  try {
    await Promise.race([
      client.quit().catch(() => undefined),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }

  if (client.status !== "end") {
    client.disconnect();
  }
}

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
    await closeRedis(this.client);
  }

  async onModuleDestroy(): Promise<void> {
    await this.quit();
  }
}
