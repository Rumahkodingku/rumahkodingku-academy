import { describe, expect, it, vi } from "vitest";

import { AvatarService } from "../../../src/modules/profile/avatar.service";

vi.mock("@nestjs/storage", () => ({
  Storage: class Storage {},
  serveFile: vi.fn(async () => "streamed"),
}));

describe("AvatarService", () => {
  it("deletes from the configured disk", async () => {
    const remove = vi.fn(async () => undefined);
    const service = new AvatarService({ disk: () => ({ delete: remove }) } as never);

    await service.remove("avatars/old.png");

    expect(remove).toHaveBeenCalledWith("avatars/old.png");
  });

  it("serves inline with private revalidation", async () => {
    const storageModule = await import("@nestjs/storage");
    const serveFile = vi.mocked(storageModule.serveFile);
    const service = new AvatarService({ disk: () => ({}) } as never);

    const result = await service.serve("avatars/a.png", {}, {});

    expect(result).toBe("streamed");
    expect(serveFile).toHaveBeenCalledWith(
      {},
      "avatars/a.png",
      expect.objectContaining({
        disposition: "inline",
        cacheControl: "private, max-age=0, must-revalidate",
      }),
    );
  });
});
