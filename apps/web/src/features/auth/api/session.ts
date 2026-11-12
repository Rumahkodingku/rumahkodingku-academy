"use client";

import { useQuery } from "@tanstack/react-query";

import { httpClient } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types";

import type { SessionUser } from "../types";

export const authKeys = {
  all: ["auth"] as const,
  session: ["auth", "session"] as const,
};

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const response = await httpClient.get<ApiSuccess<SessionUser>>("/auth/me");
      return response.data.data;
    },
    retry: false,
    staleTime: 60_000,
  });
}
