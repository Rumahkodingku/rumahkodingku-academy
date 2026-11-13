import { describe, expect, it, vi } from "vitest";

import { RedisThrottlerStorage } from "../../../../src/infrastructure/redis/redis-throttler.storage";

function createRedis(values: { hits: number; ttl?: number }) {
  return {
    client: {
      incr: vi.fn().mockResolvedValue(values.hits),
      pexpire: vi.fn().mockResolvedValue(1),
      pttl: vi.fn().mockResolvedValue(values.ttl ?? 60_000),
    },
  };
}

describe("RedisThrottlerStorage", () => {
  it("sets expiry on the first hit", async () => {
    const redis = createRedis({ hits: 1 });

    await new RedisThrottlerStorage(redis as never).increment(
      "key",
      60_000,
      100,
      60_000,
      "default",
    );

    expect(redis.client.pexpire).toHaveBeenCalledWith("key", 60_000);
  });

  it("blocks after the limit", async () => {
    const redis = createRedis({ hits: 101 });

    const result = await new RedisThrottlerStorage(redis as never).increment(
      "key",
      60_000,
      100,
      60_000,
      "default",
    );

    expect(result.isBlocked).toBe(true);
    expect(result.totalHits).toBe(101);
    expect(result.timeToBlockExpire).toBe(60_000);
  });
});
