import { Injectable } from "@nestjs/common";
import type { ThrottlerStorage } from "@nestjs/throttler";
import { Redis } from "ioredis";

import { env } from "@rumahkodingku-academy/env/server";

type ThrottlerStorageRecord = {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
};

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis = new Redis(env.REDIS_URL);

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    _throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const totalHits = await this.redis.incr(key);

    if (totalHits === 1) {
      await this.redis.pexpire(key, ttl);
    }

    const isBlocked = totalHits > limit;

    if (isBlocked) {
      await this.redis.pexpire(key, blockDuration);
    }

    return {
      totalHits,
      timeToExpire: Math.max(await this.redis.pttl(key), 0),
      isBlocked,
      timeToBlockExpire: isBlocked ? blockDuration : 0,
    };
  }
}
