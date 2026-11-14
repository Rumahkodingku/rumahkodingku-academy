import { afterEach, describe, expect, it, vi } from "vitest";

import { closeRedis } from "../../../../src/infrastructure/redis/redis.service";

describe("closeRedis", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("disconnects when quit does not settle", async () => {
    vi.useFakeTimers();
    const client = {
      status: "connecting",
      quit: vi.fn(() => new Promise<"OK">(() => undefined)),
      disconnect: vi.fn(),
    };

    const closing = closeRedis(client as never, 1000);
    await vi.advanceTimersByTimeAsync(1000);
    await closing;

    expect(client.disconnect).toHaveBeenCalledOnce();
  });

  it("does not disconnect when quit closes the client", async () => {
    const client = {
      status: "ready",
      quit: vi.fn(async () => {
        client.status = "end";
        return "OK" as const;
      }),
      disconnect: vi.fn(),
    };

    await closeRedis(client as never, 1000);

    expect(client.disconnect).not.toHaveBeenCalled();
  });
});
