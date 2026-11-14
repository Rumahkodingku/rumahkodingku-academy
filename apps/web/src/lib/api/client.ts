import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ApiProblemError, isProblemDetails } from "./problem-details";
import type { ApiSuccess } from "./types";

const baseURL = "/api/v1";
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

type RetriableConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
  _csrfRetry?: boolean;
};

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;
let refreshPromise: Promise<void> | null = null;

const rawClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 10_000,
});

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export async function fetchCsrfToken(): Promise<string> {
  const response = await rawClient.get<ApiSuccess<{ csrfToken: string }>>("/csrf/token");
  const token = response.data.data.csrfToken;
  csrfToken = token;
  return token;
}

async function ensureCsrfToken(force = false): Promise<string> {
  if (force) {
    csrfToken = null;
  }

  if (csrfToken) {
    return csrfToken;
  }

  csrfPromise ??= fetchCsrfToken().finally(() => {
    csrfPromise = null;
  });

  return csrfPromise;
}

async function refreshSession(): Promise<void> {
  const token = await ensureCsrfToken();
  await rawClient.post("/auth/refresh", null, {
    headers: { "x-csrf-token": token },
  });
}

function isNoRefreshPath(url: string | undefined): boolean {
  return NO_REFRESH_PATHS.some((path) => url?.includes(path));
}

export function createHttpClient() {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout: 10_000,
  });

  client.interceptors.request.use(async (config) => {
    const method = (config.method ?? "get").toLowerCase();

    if (!["get", "head", "options"].includes(method)) {
      const token = await ensureCsrfToken();
      config.headers.set("x-csrf-token", token);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) {
        return Promise.reject(error);
      }

      const config = error.config as RetriableConfig;
      const status = error.response?.status;
      const payload = error.response?.data;

      if (
        status === 403 &&
        isProblemDetails(payload) &&
        payload.code === "INVALID_CSRF_TOKEN" &&
        !config._csrfRetry
      ) {
        config._csrfRetry = true;
        const token = await ensureCsrfToken(true);
        config.headers.set("x-csrf-token", token);
        return client.request(config);
      }

      if (
        status === 401 &&
        !config._authRetry &&
        !isNoRefreshPath(config.url) &&
        !config.url?.includes("/users/me/avatar")
      ) {
        config._authRetry = true;

        try {
          refreshPromise ??= refreshSession().finally(() => {
            refreshPromise = null;
          });
          await refreshPromise;
          return client.request(config);
        } catch {
          // Fall through to the original 401.
        }
      }

      if (isProblemDetails(payload)) {
        return Promise.reject(new ApiProblemError(payload, status ?? 500));
      }

      return Promise.reject(
        new ApiProblemError(
          {
            type: "about:blank",
            title: "API request failed",
            status: status ?? 500,
            detail: "The API request failed.",
          },
          status ?? 500,
        ),
      );
    },
  );

  return client;
}

export const httpClient = createHttpClient();

export type { AxiosError };
