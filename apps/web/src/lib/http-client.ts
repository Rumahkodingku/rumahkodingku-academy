import { env } from "@rumahkodingku-academy/env/web";
import axios from "axios";

const serverBaseURL = `${env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "")}/api/v1`;

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  requestId?: string;
  errors?: unknown;
};

export class ApiProblemError extends Error {
  constructor(
    public readonly problem: ProblemDetails,
    public readonly status: number,
  ) {
    super(problem.detail ?? problem.title);
    this.name = "ApiProblemError";
  }
}

let csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "title" in value &&
    "status" in value
  );
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
  const response = await httpClient.get<{ data: { csrfToken: string } }>("/csrf/token");
  const token = response.data.data.csrfToken;
  setCsrfToken(token);
  return token;
}
