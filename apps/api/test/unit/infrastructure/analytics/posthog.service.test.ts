import { describe, expect, it } from "vitest";

import { PostHogService } from "../../../../src/infrastructure/analytics/posthog.service";

describe("PostHogService", () => {
  it("is a no-op without an API key", async () => {
    const service = new PostHogService({ apiKey: undefined, host: "https://us.i.posthog.com" });

    expect(await service.isFeatureEnabled("flag", "user")).toBe(false);
    expect(await service.getFeatureFlagValue("flag", "user", "default")).toBe("default");
    expect(await service.getAllFlags("user")).toEqual({});
    expect(await service.getFeatureFlagPayload("flag", "user")).toBeUndefined();

    service.capture("user", "event");
    service.identify("user", { plan: "free" });

    await service.onModuleDestroy();
  });
});
