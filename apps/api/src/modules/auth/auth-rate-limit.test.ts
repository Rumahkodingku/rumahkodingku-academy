import type { Request } from "express";
import { describe, expect, it } from "vitest";

import type { RedisService } from "../../infrastructure/redis/redis.service";
import { AuthRateLimitService } from "./auth-rate-limit.service";

class FakeRedis {
  readonly counts = new Map<string, number>();
  readonly expiries = new Map<string, number>();
  readonly keys: string[] = [];

  async incr(key: string): Promise<number> {
    this.keys.push(key);
    const next = (this.counts.get(key) ?? 0) + 1;
    this.counts.set(key, next);
    return next;
  }

  async pexpire(key: string, milliseconds: number): Promise<number> {
    this.expiries.set(key, milliseconds);
    return 1;
  }

  async pttl(key: string): Promise<number> {
    return this.expiries.get(key) ?? -2;
  }
}

function service(redis: FakeRedis): AuthRateLimitService {
  return new AuthRateLimitService({ client: redis } as unknown as RedisService);
}

function request(overrides: {
  ip?: string;
  email?: string;
  refreshToken?: string;
  userId?: string;
}): Request {
  return {
    ip: overrides.ip ?? "127.0.0.1",
    socket: { remoteAddress: overrides.ip ?? "127.0.0.1" },
    body: overrides.email ? { email: overrides.email } : {},
    cookies: overrides.refreshToken ? { refresh_token: overrides.refreshToken } : {},
    user: overrides.userId ? { id: overrides.userId } : undefined,
  } as unknown as Request;
}

async function limited(action: Promise<void>): Promise<{ retryAfter: number } | null> {
  try {
    await action;
    return null;
  } catch (error) {
    return { retryAfter: (error as { retryAfter?: number }).retryAfter ?? 0 };
  }
}

describe("auth rate limits", () => {
  it("allows N attempts and rejects the next with a retry delay", async () => {
    const redis = new FakeRedis();
    const limiter = service(redis);
    const email = "Learner@Example.com";

    for (let attempt = 1; attempt <= 10; attempt += 1) {
      expect(await limited(limiter.consume("login", request({ email })))).toBeNull();
    }

    const rejected = await limited(limiter.consume("login", request({ email })));
    expect(rejected?.retryAfter).toBe(900);
    expect(
      redis.keys.every((key) => !key.includes(email) && !key.includes(email.toLowerCase())),
    ).toBe(true);
  });

  it("isolates limits by email and by IP", async () => {
    const redis = new FakeRedis();
    const limiter = service(redis);

    for (let attempt = 1; attempt <= 11; attempt += 1) {
      await limited(limiter.consume("login", request({ email: "a@example.com" })));
    }

    expect(await limited(limiter.consume("login", request({ email: "b@example.com" })))).toBeNull();
    expect(
      await limited(limiter.consume("login", request({ ip: "10.0.0.2", email: "a@example.com" }))),
    ).toBeNull();
  });

  it("hashes refresh tokens in the key", async () => {
    const redis = new FakeRedis();
    const limiter = service(redis);
    const token = "raw-refresh-token-value";

    await limiter.consume("refresh", request({ refreshToken: token }));

    expect(redis.keys[0]).toMatch(/^auth:rl:refresh:127\.0\.0\.1:[A-Za-z0-9_-]{43}$/);
    expect(redis.keys[0]).not.toContain(token);
  });

  it("keys avatar limits by user id, not IP", async () => {
    const redis = new FakeRedis();
    const limiter = service(redis);

    await limiter.consume("avatar", request({ userId: "user-123", ip: "10.0.0.3" }));

    expect(redis.keys[0]).toBe("auth:rl:avatar:user-123");
  });

  it("applies the endpoint-specific windows", async () => {
    const redis = new FakeRedis();
    const limiter = service(redis);

    await limiter.consume("refresh", request({ refreshToken: "token" }));
    expect(redis.expiries.get(redis.keys[0] ?? "")).toBe(60_000);

    await limiter.consume("register", request({}));
    expect(redis.expiries.get(redis.keys[1] ?? "")).toBe(900_000);
  });
});
