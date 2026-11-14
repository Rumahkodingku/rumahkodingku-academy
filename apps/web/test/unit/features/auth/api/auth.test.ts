import { describe, expect, it, vi } from "vitest";

const post = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/client", () => ({
  httpClient: { post },
}));

const { refreshSession } = await import("../../../../../src/features/auth/api/auth");

const user = {
  id: "user-1",
  email: "user@example.com",
  emailVerified: true,
  status: "ACTIVE",
  roles: ["user"],
  permissions: [],
  profile: { displayName: "User" },
};

describe("refreshSession", () => {
  it("deduplicates concurrent refresh requests", async () => {
    let resolveResponse: ((value: unknown) => void) | undefined;
    post.mockReturnValue(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );

    const first = refreshSession();
    const second = refreshSession();

    expect(post).toHaveBeenCalledTimes(1);

    resolveResponse?.({ data: { data: { user } } });

    await expect(first).resolves.toEqual(user);
    await expect(second).resolves.toEqual(user);
  });
});
