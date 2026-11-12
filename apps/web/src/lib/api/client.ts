import { env } from "@rumahkodingku-academy/env/web";
import axios from "axios";

import { ApiProblemError, isProblemDetails } from "./problem-details";
import type { ApiSuccess } from "./types";

const serverBaseURL = `${env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "")}/api/v1`;

let csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function createHttpClient(baseURL = serverBaseURL) {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout: 10_000,
  });

  client.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toLowerCase();

    if (csrfToken && !["get", "head", "options"].includes(method)) {
      config.headers.set("x-csrf-token", csrfToken);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.data &&
        isProblemDetails(error.response.data)
      ) {
        return Promise.reject(new ApiProblemError(error.response.data, error.response.status));
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const httpClient = createHttpClient();

export async function fetchCsrfToken(): Promise<string> {
  const response = await httpClient.get<ApiSuccess<{ csrfToken: string }>>("/csrf/token");
  const token = response.data.data.csrfToken;
  setCsrfToken(token);
  return token;
}
