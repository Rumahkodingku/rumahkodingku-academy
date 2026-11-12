import "server-only";

import { cookies } from "next/headers";
import { env } from "@rumahkodingku-academy/env/web";

import { ApiProblemError, isProblemDetails } from "./problem-details";

type ServerFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const apiUrl = (env.API_URL ?? env.NEXT_PUBLIC_SERVER_URL).replace(/\/$/, "");

export async function apiServerFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (!headers.has("Content-Type") && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const cookieHeader = cookieStore.toString();
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const response = await fetch(`${apiUrl}/api/v1${path}`, {
    ...options,
    headers,
    cache: options.cache ?? (options.next ? undefined : "no-store"),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isProblemDetails(payload)) {
      throw new ApiProblemError(payload, response.status);
    }

    throw new ApiProblemError(
      {
        type: "about:blank",
        title: "API request failed",
        status: response.status,
        detail: "The API request failed.",
      },
      response.status,
    );
  }

  return payload as T;
}
