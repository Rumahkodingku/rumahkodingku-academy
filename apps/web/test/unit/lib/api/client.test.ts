import type { InternalAxiosRequestConfig } from "axios";

import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  queue: [] as Array<{
    match: string;
    method?: string;
    status: number;
    data?: unknown;
  }>,
  requests: [] as Array<{ url: string; method: string; headers: Record<string, string> }>,
}));

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  const { AxiosError } = actual;

  function adapter(config: InternalAxiosRequestConfig) {
    const url = config.url ?? "";
    const method = (config.method ?? "get").toUpperCase();
    const rawHeaders: Record<string, unknown> = config.headers.toJSON
      ? config.headers.toJSON()
      : { ...config.headers };
    const headers = Object.fromEntries(
      Object.entries(rawHeaders).map(([key, value]) => [key.toLowerCase(), String(value)]),
    );

    state.requests.push({ url, method, headers });

    const index = state.queue.findIndex(
      (entry) => url.includes(entry.match) && (!entry.method || entry.method === method),
    );
    const entry = index >= 0 ? state.queue.splice(index, 1)[0] : undefined;
    const status = entry?.status ?? 200;
    const response = {
      data: entry?.data ?? { data: {} },
      status,
      statusText: "",
      headers: {},
      config,
      request: {},
    };

    if (status >= 400) {
      return Promise.reject(
        new AxiosError("Request failed", "ERR_BAD_REQUEST", config, {}, response),
      );
    }

    return Promise.resolve(response);
  }

  return {
    ...actual,
    default: {
      ...actual.default,
      create: (config: Record<string, unknown> = {}) =>
        actual.default.create({ ...config, adapter }),
    },
  };
});

const { httpClient, setCsrfToken } = await import("../../../../src/lib/api/client");
const { ApiProblemError } = await import("../../../../src/lib/api/problem-details");

function problem(status: number, code: string) {
  return {
    type: "https://rumahkodingku.com/problems/test",
    title: "Test",
    status,
    detail: "Test problem",
    code,
  };
}

function headerOf(url: string, method: string, occurrence = 0): Record<string, string> {
  const matches = state.requests.filter(
    (request) => request.url.includes(url) && request.method === method,
  );
  return matches[occurrence]?.headers ?? {};
}

function count(url: string, method?: string): number {
  return state.requests.filter(
    (request) => request.url.includes(url) && (!method || request.method === method),
  ).length;
}

beforeEach(() => {
  state.queue = [];
  state.requests = [];
  setCsrfToken(null);
});

describe("http client", () => {
  it("bootstraps and reuses the CSRF token for mutations", async () => {
    state.queue.push(
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-1" } } },
      { match: "/users/me", method: "POST", status: 200 },
      { match: "/users/me", method: "POST", status: 200 },
    );

    await httpClient.post("/users/me", { displayName: "A" });
    await httpClient.post("/users/me", { displayName: "B" });

    expect(count("/csrf/token", "GET")).toBe(1);
    expect(headerOf("/users/me", "POST")["x-csrf-token"]).toBe("csrf-1");
    expect(headerOf("/users/me", "POST", 1)["x-csrf-token"]).toBe("csrf-1");
  });

  it("refreshes the CSRF token once and retries the mutation", async () => {
    state.queue.push(
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-1" } } },
      {
        match: "/users/me",
        method: "POST",
        status: 403,
        data: problem(403, "INVALID_CSRF_TOKEN"),
      },
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-2" } } },
      { match: "/users/me", method: "POST", status: 200 },
    );

    const response = await httpClient.post("/users/me", { displayName: "A" });

    expect(response.status).toBe(200);
    expect(count("/csrf/token", "GET")).toBe(2);
    expect(headerOf("/users/me", "POST", 1)["x-csrf-token"]).toBe("csrf-2");
  });

  it("refreshes the session on 401 and retries the request", async () => {
    state.queue.push(
      {
        match: "/users/me",
        method: "GET",
        status: 401,
        data: problem(401, "AUTH_UNAUTHENTICATED"),
      },
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-1" } } },
      { match: "/auth/refresh", method: "POST", status: 200 },
      { match: "/users/me", method: "GET", status: 200, data: { data: { user: { id: "1" } } } },
    );

    const response = await httpClient.get("/users/me");

    expect(response.status).toBe(200);
    expect(count("/auth/refresh", "POST")).toBe(1);
    expect(headerOf("/auth/refresh", "POST")["x-csrf-token"]).toBe("csrf-1");
    expect(count("/users/me", "GET")).toBe(2);
  });

  it("does not loop when the retried request still returns 401", async () => {
    state.queue.push(
      {
        match: "/users/me",
        method: "GET",
        status: 401,
        data: problem(401, "AUTH_UNAUTHENTICATED"),
      },
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-1" } } },
      { match: "/auth/refresh", method: "POST", status: 200 },
      {
        match: "/users/me",
        method: "GET",
        status: 401,
        data: problem(401, "AUTH_UNAUTHENTICATED"),
      },
    );

    await expect(httpClient.get("/users/me")).rejects.toMatchObject({
      name: "ApiProblemError",
      status: 401,
    });
    expect(count("/auth/refresh", "POST")).toBe(1);
    expect(count("/users/me", "GET")).toBe(2);
  });

  it("does not refresh on auth endpoints", async () => {
    state.queue.push(
      { match: "/csrf/token", method: "GET", status: 200, data: { data: { csrfToken: "csrf-1" } } },
      {
        match: "/auth/login",
        method: "POST",
        status: 401,
        data: problem(401, "AUTH_INVALID_CREDENTIALS"),
      },
    );

    await expect(httpClient.post("/auth/login", {})).rejects.toBeInstanceOf(ApiProblemError);
    expect(count("/auth/refresh", "POST")).toBe(0);
  });
});
