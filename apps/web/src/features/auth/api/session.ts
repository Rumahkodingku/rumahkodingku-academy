"use client";

import { useQuery } from "@tanstack/react-query";

import { httpClient } from "@/lib/api/client";
import { ApiProblemError } from "@/lib/api/problem-details";
import type { ApiSuccess } from "@/lib/api/types";

import type { AuthUser } from "../types";

export const authKeys = {
  all: ["auth"] as const,
  session: ["auth", "session"] as const,
};

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        const response = await httpClient.get<ApiSuccess<{ user: AuthUser }>>("/users/me");
        return response.data.data.user;
      } catch (error) {
        if (error instanceof ApiProblemError && error.status === 401) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}
