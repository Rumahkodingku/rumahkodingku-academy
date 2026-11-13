import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-pathname": "/learn" }),
}));

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));

vi.mock("@/lib/api/server", () => ({
  apiServerFetch: vi.fn(),
}));

const { apiServerFetch } = await import("../../../../src/lib/api/server");
const { requireAdmin, requirePermission, requireUser, requireVerified } =
  await import("../../../../src/lib/auth/session");
const { ApiProblemError } = await import("../../../../src/lib/api/problem-details");
const { PERMISSIONS } = await import("../../../../src/features/auth/permissions");

const fetchMock = vi.mocked(apiServerFetch);

type TestUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: "ACTIVE";
  roles: string[];
  permissions: string[];
  profile: Record<string, unknown>;
};

function user(overrides: Partial<TestUser> = {}): TestUser {
  return {
    id: "user-1",
    email: "user@example.com",
    emailVerified: true,
    status: "ACTIVE",
    roles: ["user"],
    permissions: [],
    profile: {},
    ...overrides,
  };
}

function unauthenticated() {
  return new ApiProblemError(
    {
      type: "https://rumahkodingku.com/problems/auth-unauthenticated",
      title: "Unauthorized",
      status: 401,
      detail: "Sesi tidak valid.",
    },
    401,
  );
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe("session guards", () => {
  it("redirects unauthenticated users to login with the current path", async () => {
    fetchMock.mockRejectedValue(unauthenticated());

    await expect(requireUser("id")).rejects.toThrow("REDIRECT:/login?next=%2Flearn");
  });

  it("redirects unverified users to verification", async () => {
    fetchMock.mockResolvedValue({ data: { user: user({ emailVerified: false }) } });

    await expect(requireVerified("id")).rejects.toThrow("REDIRECT:/verify-email?next=%2Flearn");
  });

  it("returns the session when the user is verified", async () => {
    fetchMock.mockResolvedValue({ data: { user: user() } });

    await expect(requireVerified("id")).resolves.toMatchObject({ id: "user-1" });
  });

  it("redirects to forbidden when the permission is missing", async () => {
    fetchMock.mockResolvedValue({ data: { user: user() } });

    await expect(requirePermission("id", PERMISSIONS.ADMIN_ACCESS)).rejects.toThrow(
      "REDIRECT:/forbidden",
    );
  });

  it("allows admin access through the permission, not the role name", async () => {
    fetchMock.mockResolvedValue({
      data: { user: user({ roles: ["user"], permissions: [PERMISSIONS.ADMIN_ACCESS] }) },
    });

    await expect(requireAdmin("id")).resolves.toMatchObject({
      permissions: [PERMISSIONS.ADMIN_ACCESS],
    });
  });
});
