import { describe, expect, it, vi } from "vitest";

import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("reports down dependencies instead of throwing", async () => {
    const health = {
      check: vi.fn(async (indicators: Array<() => Promise<unknown>>) =>
        Promise.all(indicators.map((indicator) => indicator())),
      ),
    };
    const database = { query: vi.fn().mockRejectedValue(new Error("db down")) };
    const redis = { ping: vi.fn().mockRejectedValue(new Error("redis down")) };
    const controller = new HealthController(health as never, database as never, redis as never);

    const result = await controller.check();

    expect(result).toEqual([
      { database: { status: "down", message: "database unavailable" } },
      { redis: { status: "down", message: "redis unavailable" } },
    ]);
  });
});
