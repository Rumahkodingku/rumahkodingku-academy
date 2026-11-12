import { Injectable } from "@nestjs/common";
import type { ThrottlerStorage } from "@nestjs/throttler";

import { RedisService } from "./redis.service";

type ThrottlerStorageRecord = {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
};

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: RedisService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    _throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const totalHits = await this.redis.client.incr(key);

    if (totalHits === 1) {
      await this.redis.client.pexpire(key, ttl);
    }

    const isBlocked = totalHits > limit;

    if (isBlocked) {
      await this.redis.client.pexpire(key, blockDuration);
    }

    return {
      totalHits,
      timeToExpire: Math.max(await this.redis.client.pttl(key), 0),
      isBlocked,
      timeToBlockExpire: isBlocked ? blockDuration : 0,
    };
  }
}
